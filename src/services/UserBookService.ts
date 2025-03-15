import { inject, injectable } from "inversify";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../dataSource";
import { UserBook } from "../entity/UserBookEntity";
import { UserService } from "./UserService";
import { BookService } from "./BookService";
import { HttpException } from "../exceptions/HttpException";
import { HttpStatus } from "../enums/HttpStatus";
import { User } from "../entity/UserEntity";
import { Book } from "../entity/BookEntity";
import { CacheService } from "./CacheService";

@injectable()
export class UserBookService {
  userBookRepository: Repository<UserBook>;

  constructor(
    @inject(UserService) private userService: UserService,
    @inject(BookService) private bookService: BookService,
    @inject(CacheService) private cacheService: CacheService) {
    this.userBookRepository = AppDataSource.getRepository(UserBook);
  }

  /**
   * Retrieves the current book associated with a user that has not been scored yet.
   *
   * @param user - The user for whom the book is being retrieved.
   * @param book - The book that is being checked for the user.
   * @returns A promise that resolves to the UserBook entity if found.
   * @throws HttpException with HttpStatus.NOT_FOUND if the UserBook is not found.
   */
  async getUserPresentBook(user: User, book: Book): Promise<UserBook> {
    const userBook = await this.userBookRepository.findOneBy({ user, book, score: IsNull() });
    if (!userBook) throw new HttpException(HttpStatus.NOT_FOUND, 'User Book Not Found');

    return userBook;
  }

  /**
   * Borrows a book for a user.
   *
   * This method performs the following actions:
   * 1. Retrieves the user and checks if the book is available.
   * 2. Creates a new user-book association.
   * 3. Saves the new user-book association.
   * 4. Sets the book as unavailable.
   * 5. Deletes the user's data from the cache.
   *
   * @param userId - The ID of the user borrowing the book.
   * @param bookId - The ID of the book to be borrowed.
   * @returns A promise that resolves when the book has been successfully borrowed.
   * @throws Will throw an error if the user or book cannot be retrieved, or if any of the subsequent operations fail.
   */
  async borrowBook(userId: number, bookId: number): Promise<void> {
    const [user, book] = await Promise.all([
      this.userService.getUser(userId),
      this.bookService.isBookAvailable(bookId),
    ]);

    const newUserBook = this.userBookRepository.create({ user, book });
    await Promise.all([
      this.userBookRepository.save(newUserBook),
      this.bookService.setBookUnavailable(book),
      this.cacheService.deleteDataFromCache('user', userId)
    ]);

  }

  /**
   * Handles the return of a book by a user. This method performs the following actions:
   * 1. Retrieves the user and book details.
   * 2. Updates the score for the user's book record.
   * 3. Saves the updated user book record.
   * 4. Sets the book as available.
   * 5. Deletes related cache entries for the user and book.
   *
   * @param userId - The ID of the user returning the book.
   * @param bookId - The ID of the book being returned.
   * @param score - The score given by the user for the book.
   * @returns A promise that resolves when the book return process is complete.
   */
  async returnBook(userId: number, bookId: number, score: number): Promise<void> {
    const [user, book] = await Promise.all([
      this.userService.getUser(userId),
      this.bookService.getBook(bookId),
    ]);

    const userBook = await this.getUserPresentBook(user, book);
    userBook.score = score;

    await Promise.all([
      this.userBookRepository.save(userBook),
      this.bookService.setBookAvailable(book),
      this.cacheService.deleteDataFromCache('user', userId),
      this.cacheService.deleteDataFromCache('book', bookId)
    ])
  }
}