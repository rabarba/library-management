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

@injectable()
export class UserBookService {
  private userBookRepository: Repository<UserBook>;

  constructor(
    @inject(UserService) private userService: UserService,
    @inject(BookService) private bookService: BookService) {
    this.userBookRepository = AppDataSource.getRepository(UserBook);
  }

  async getUserPresentBook(user: User, book: Book): Promise<UserBook> {
    const userBook = await this.userBookRepository.findOneBy({ user, book, score: IsNull() });
    if (!userBook) throw new HttpException(HttpStatus.NOT_FOUND, 'User Book Not Found');

    return userBook;
  }

  async borrowBook(userId: number, bookId: number): Promise<void> {
    const [user, book] = await Promise.all([
      this.userService.getUser(userId),
      this.bookService.isBookAvailable(bookId),
    ]);

    const newUserBook = this.userBookRepository.create({ user, book });
    await Promise.all([
      this.userBookRepository.save(newUserBook),
      this.bookService.setBookUnavailable(book)
    ]);
   
  }

  async returnBook(userId: number, bookId: number, score: number): Promise<void> {
    const [user, book] = await Promise.all([
      this.userService.getUser(userId),
      this.bookService.getBook(bookId),
    ]);

    const userBook = await this.getUserPresentBook(user, book);
    userBook.score = score;

    await Promise.all([
      this.userBookRepository.save(userBook),
      this.bookService.setBookAvailable(book)
    ])
  }
}