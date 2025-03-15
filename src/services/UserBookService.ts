import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/UserEntity";
import { UserBook } from "../entity/UserBookEntity";
import { UserService } from "./UserService";
import { BookService } from "./BookService";
import { Book } from "../entity/BookEntity";

@injectable()
export class UserBookService {
  private userBookRepository: Repository<UserBook>;

  constructor(
    @inject(UserService) private userService: UserService,
    @inject(BookService) private bookService: BookService) {
    this.userBookRepository = AppDataSource.getRepository(UserBook);
  }

  async borrowBook(userId: number, bookId: number): Promise<void> {
    const user = (await this.userService.getUser(userId)) as User;
    const book = (await this.bookService.getBook(bookId)) as Book;

    const userBook = this.userBookRepository.create({ user, book });
    await this.userBookRepository.save(userBook);
  }
}