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

  /**
   * Retrieves a list of users from the repository.
   *
   * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
   */
  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param userId - The ID of the user to retrieve.
   * @returns A promise that resolves to the user object.
   * @throws HttpException if the user is not found.
   */
  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'User Not Found');
    return user;
  }

  /**
   * Retrieves a user along with their books, categorized into past and present books.
   * First, it attempts to fetch the data from the cache. If the data is not found in the cache,
   * it fetches the user and their books from the database, categorizes the books, and stores the result in the cache.
   *
   * @param {number} userId - The ID of the user to retrieve.
   * @returns {Promise<UserWithBooks>} A promise that resolves to an object containing the user's details and their books.
   * @throws {HttpException} If the user is not found in the database.
   */
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

  /**
   * Creates a new user with the provided user data.
   *
   * @param userData - Partial data of the user to be created.
   * @returns A promise that resolves to the ID of the newly created user.
   */
  async createUser(userData: Partial<User>): Promise<number> {
    const user = this.userRepository.create(userData);
    return (await this.userRepository.save(user)).id;
  }
}