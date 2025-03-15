import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../dataSource";
import { Book } from "../entity/BookEntity";
import { HttpException } from "../exceptions/HttpException";
import { HttpStatus } from "../enums/HttpStatus";
import { BookWithRatingsType } from "../types/BookWithRatingsType";
import { CacheService } from "./CacheService";

@injectable()
export class BookService {
  bookRepository: Repository<Book>;

  constructor(@inject(CacheService) private cacheService: CacheService) {
    this.bookRepository = AppDataSource.getRepository(Book);
  }


  /**
   * Retrieves a list of books from the repository.
   *
   * @returns {Promise<{ id: number; name: string }[]>} A promise that resolves to an array of books,
   * each containing an `id` and `name` property.
   */
  async getBooks(): Promise<{ id: number; name: string }[]> {
    const books = await this.bookRepository.find();
    return books.map(book => ({ id: book.id, name: book.name }));
  }

  /**
   * Retrieves a book by its ID.
   * 
   * @param bookId - The ID of the book to retrieve.
   * @returns A promise that resolves to the book if found.
   * @throws HttpException with status 404 if the book is not found.
   */
  async getBook(bookId: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id: bookId });
    if (!book) throw new HttpException(HttpStatus.NOT_FOUND, 'Book Not Found');
    return book;
  }


  /**
   * Retrieves a book along with its average rating.
   * 
   * This method first attempts to fetch the book data from the cache. If the data is found in the cache,
   * it is returned immediately. If not, the method fetches the book from the database, calculates the 
   * average rating from the associated user scores, and then stores the result in the cache before returning it.
   * 
   * @param {number} bookId - The ID of the book to retrieve.
   * @returns {Promise<BookWithRatingsType>} A promise that resolves to the book data along with its average rating.
   * @throws {HttpException} If the book is not found in the database.
   */
  async getBookWithRatings(bookId: number): Promise<BookWithRatingsType> {
    const cachedData = await this.cacheService.getDataFromCache('book', bookId);
    if (cachedData) {
      console.log('Book returned from cache!')
      return JSON.parse(cachedData);
    }

    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['userBooks']
    });

    if (!book) throw new HttpException(HttpStatus.NOT_FOUND, 'Book Not Found');

    let avgScore;
    const userBooks = book.userBooks;
    if (userBooks == null || userBooks.length === 0) {
      avgScore = -1;
    } else {
      const bookScores = userBooks.map(userBook => userBook.score);
      avgScore = bookScores.reduce((acc, score) => acc + score, 0) / bookScores.length;
      avgScore = Math.round(avgScore * 100) / 100;
    }

    const bookWithRatings =  {
      id: book.id,
      name: book.name,
      score: avgScore
    };

    await this.cacheService.setDataToCache('book', bookId, bookWithRatings);
    console.log("Book saved to cache");

    return bookWithRatings;
  }


  /**
   * Checks if a book is available based on its ID.
   * 
   * @param {number} bookId - The ID of the book to check.
   * @returns {Promise<Book>} - A promise that resolves to the book if it is available.
   * @throws {HttpException} - Throws an exception if the book is not available.
   */
  async isBookAvailable(bookId: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id: bookId, isAvailable: true });
    if (!book) throw new HttpException(HttpStatus.BAD_REQUEST, 'Book is not available');
    return book;
  }


  /**
   * Sets the availability status of a book to true.
   *
   * @param {Book} book - The book object to update.
   * @returns {Promise<void>} A promise that resolves when the book's availability status has been updated and saved.
   */
  async setBookAvailable(book: Book): Promise<void> {
    book.isAvailable = true;
    await this.bookRepository.save(book);
  }

  /**
   * Marks the given book as unavailable and saves the updated book information to the repository.
   *
   * @param {Book} book - The book to be marked as unavailable.
   * @returns {Promise<void>} A promise that resolves when the book has been successfully updated.
   */
  async setBookUnavailable(book: Book): Promise<void> {
    book.isAvailable = false;
    await this.bookRepository.save(book);
  }

  /**
   * Creates a new book record in the repository.
   *
   * @param bookData - Partial data of the book to be created.
   * @returns A promise that resolves to the ID of the newly created book.
   */
  async createBook(bookData: Partial<Book>): Promise<number> {
    const user = this.bookRepository.create(bookData);
    return (await this.bookRepository.save(user)).id;
  }
}