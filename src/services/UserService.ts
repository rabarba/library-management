import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../dataSource";
import { User } from "../entity/UserEntity";
import { HttpException } from "../exceptions/HttpException";
import { HttpStatus } from "../enums/HttpStatus";
import { BooksType, UserWithBooks } from "../types/UserWithBooksType";
import { CacheService } from "./CacheService";

@injectable()
export class UserService {
  userRepository: Repository<User>;

  constructor(@inject(CacheService) private cacheService: CacheService) {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'User Not Found');
    return user;
  }

  async getUserWithBooks(userId: number): Promise<UserWithBooks> {
    const cachedData = await this.cacheService.getDataFromCache('user', userId);
    if (cachedData) {
      console.log('User returned from cache!')
      return JSON.parse(cachedData);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userBooks', 'userBooks.book']
    });
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'User Not Found');

    const pastBooks: BooksType[] = [];
    const presentBooks: BooksType[] = [];
    const userBooks = user.userBooks ?? [];

    userBooks.map(userBook => {
      userBook.score ? pastBooks.push({ name: userBook.book.name, userScore: userBook.score }) : presentBooks.push({ name: userBook.book.name });
    });

    const userWithBooks = {
      id: user.id,
      name: user.name,
      books: {
        past: pastBooks,
        present: presentBooks
      }
    };

    await this.cacheService.setDataToCache('user', userId, userWithBooks);
    console.log("User saved to cache");
    return userWithBooks;
  }

  async createUser(userData: Partial<User>): Promise<number> {
    const user = this.userRepository.create(userData);
    return (await this.userRepository.save(user)).id;
  }
}