import "reflect-metadata";
import { UserBookService } from "../services/UserBookService";
import { UserService } from "../services/UserService";
import { BookService } from "../services/BookService";
import { CacheService } from "../services/CacheService";
import { FindOperator, Repository } from "typeorm";
import { UserBook } from "../entity/UserBookEntity";
import { HttpException } from "../exceptions/HttpException";
import { HttpStatus } from "../enums/HttpStatus";

jest.mock("../services/UserService");
jest.mock("../services/BookService");
jest.mock("../services/CacheService");

const mockUserBookRepository = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe("UserBookService", () => {
  let userBookService: any;
  let userService: any;
  let bookService: any;
  let cacheService: any;

  beforeEach(() => {
    cacheService = new CacheService();
    userService = new UserService(cacheService);
    bookService = new BookService(cacheService);

    userBookService = new UserBookService(userService, bookService, cacheService);
    userBookService.userBookRepository = mockUserBookRepository as unknown as Repository<UserBook>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUserPresentBook should return user book if found", async () => {
    const user = { id: 1 };
    const book = { id: 1 };
    const userBook = { user, book, score: null };

    mockUserBookRepository.findOneBy.mockResolvedValue(userBook);

    const result = await userBookService.getUserPresentBook(user, book);
    expect(result).toEqual(userBook);
    expect(mockUserBookRepository.findOneBy).toHaveBeenCalledWith({ user, book, score: expect.any(FindOperator) });
  });

  test("getUserPresentBook should throw an exception if not found", async () => {
    mockUserBookRepository.findOneBy.mockResolvedValue(null);

    await expect(userBookService.getUserPresentBook({ id: 1 }, { id: 1 }))
      .rejects.toThrow(new HttpException(HttpStatus.NOT_FOUND, "User Book Not Found"));
  });

  test("borrowBook should create and save a new UserBook", async () => {
    const user = { id: 1 };
    const book = { id: 1 };

    userService.getUser = jest.fn().mockResolvedValue(user);
    bookService.isBookAvailable = jest.fn().mockResolvedValue(book);
    bookService.setBookUnavailable = jest.fn();
    cacheService.deleteDataFromCache = jest.fn();

    mockUserBookRepository.create.mockReturnValue({ user, book });
    mockUserBookRepository.save.mockResolvedValue(null);

    await userBookService.borrowBook(1, 1);

    expect(mockUserBookRepository.create).toHaveBeenCalledWith({ user, book });
    expect(mockUserBookRepository.save).toHaveBeenCalled();
    expect(bookService.setBookUnavailable).toHaveBeenCalledWith(book);
    expect(cacheService.deleteDataFromCache).toHaveBeenCalledWith("user", 1);
  });

  test("returnBook should update score and set book available", async () => {
    const user = { id: 1 };
    const book = { id: 1 };
    const userBook = { user, book, score: null };

    userService.getUser = jest.fn().mockResolvedValue(user);
    bookService.getBook = jest.fn().mockResolvedValue(book);
    bookService.setBookAvailable = jest.fn();
    cacheService.deleteDataFromCache = jest.fn();

    mockUserBookRepository.findOneBy.mockResolvedValue(userBook);
    mockUserBookRepository.save.mockResolvedValue(null);

    await userBookService.returnBook(1, 1, 5);

    expect(userBook.score).toBe(5);
    expect(mockUserBookRepository.save).toHaveBeenCalledWith(userBook);
    expect(bookService.setBookAvailable).toHaveBeenCalledWith(book);
    expect(cacheService.deleteDataFromCache).toHaveBeenCalledWith("user", 1);
    expect(cacheService.deleteDataFromCache).toHaveBeenCalledWith("book", 1);
  });
});
