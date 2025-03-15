import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/BookEntity";

@injectable()
export class BookService {
  private bookRepository: Repository<Book>;

  constructor() {
    this.bookRepository = AppDataSource.getRepository(Book);
  }

  async getBooks(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async getBook(bookId: number): Promise<Book | null> {
    return this.bookRepository.findOneBy({ id: bookId });
  }

  async createBook(bookData: Partial<Book>): Promise<number> {
    const user = this.bookRepository.create(bookData);
    return (await this.bookRepository.save(user)).id;
  }
}