import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/BookEntity";
import { HttpException } from "../exceptions/HttpException";
import { HttpStatus } from "../enums/HttpStatus";

@injectable()
export class BookService {
  private bookRepository: Repository<Book>;

  constructor() {
    this.bookRepository = AppDataSource.getRepository(Book);
  }

  async getBooks(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async getBook(bookId: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id: bookId });
    if (!book) throw new HttpException(HttpStatus.NOT_FOUND, 'Book Not Found');
    return book;
  }

  async isBookAvailable(bookId: number): Promise<Book>{
    const book = await this.bookRepository.findOneBy({ id: bookId, isAvailable: true });
    if (!book) throw new HttpException(HttpStatus.BAD_REQUEST, 'Book is not available');
    return book;
  }

  async setBookAvailable(book: Book): Promise<void>{
    book.isAvailable = true;
    await this.bookRepository.save(book);
  }

  async setBookUnavailable(book: Book): Promise<void>{
    book.isAvailable = false;
    await this.bookRepository.save(book);
  }

  async createBook(bookData: Partial<Book>): Promise<number> {
    const user = this.bookRepository.create(bookData);
    return (await this.bookRepository.save(user)).id;
  }
}