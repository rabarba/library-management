import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/UserEntity";
import { HttpException } from "../exceptions/HttpException";
import { HttpStatus } from "../enums/HttpStatus";
import { PastBooksType, PresentBooksType, UserWithBooks } from "../types/UserWithBooksType";

@injectable()
export class UserService {
  private userRepository: Repository<User>;

  constructor() {
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
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userBooks', 'userBooks.book']
    });
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'User Not Found');

    const pastBooks: PastBooksType[] = [];
    const presentBooks: PresentBooksType[] = [];
    const userBooks = user.userBooks ?? [];

    userBooks.map(userBook => {
      userBook.score ? pastBooks.push({ name: userBook.book.name, userScore: userBook.score }) : presentBooks.push({ name: userBook.book.name });
    });

    return {
      id: user.id,
      name: user.name,
      books: {
        past: pastBooks,
        present: presentBooks
      }
    };
  }

  async createUser(userData: Partial<User>): Promise<number> {
    const user = this.userRepository.create(userData);
    return (await this.userRepository.save(user)).id;
  }
}