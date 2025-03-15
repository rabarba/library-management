import "reflect-metadata";
import { BookService } from "../services/BookService";
import { CacheService } from "../services/CacheService";
import { Repository } from "typeorm";
import { Book } from "../entity/BookEntity";
import { HttpException } from "../exceptions/HttpException";
import { HttpStatus } from "../enums/HttpStatus";

jest.mock("../services/CacheService");

const mockBookRepository = {
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn()
};

describe("BookService", () => {
  let bookService: any;
  let cacheService: any;

  beforeEach(() => {
    cacheService = new CacheService();
    bookService = new BookService(cacheService);
    bookService.bookRepository = mockBookRepository as unknown as Repository<Book>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getBook should return book if found", async () => {
    const book = { id: 1, name: "Test Book" };
    mockBookRepository.findOneBy.mockResolvedValue(book);

    const result = await bookService.getBook(1);
    expect(result).toEqual(book);
    expect(mockBookRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  test("getBook should throw an exception if not found", async () => {
    mockBookRepository.findOneBy.mockResolvedValue(null);

    await expect(bookService.getBook(1))
      .rejects.toThrow(new HttpException(HttpStatus.NOT_FOUND, "Book Not Found"));
  });

  test("isBookAvailable should return book if available", async () => {
    const book = { id: 1, name: "Test Book", isAvailable: true };
    mockBookRepository.findOneBy.mockResolvedValue(book);

    const result = await bookService.isBookAvailable(1);
    expect(result).toEqual(book);
  });

  test("isBookAvailable should throw an exception if book is not available", async () => {
    mockBookRepository.findOneBy.mockResolvedValue(null);

    await expect(bookService.isBookAvailable(1))
      .rejects.toThrow(new HttpException(HttpStatus.BAD_REQUEST, "Book is not available"));
  });

  test("setBookAvailable should update book availability to true", async () => {
    const book = { id: 1, name: "Test Book", isAvailable: false };
    mockBookRepository.save.mockResolvedValue(null);

    await bookService.setBookAvailable(book);
    expect(book.isAvailable).toBe(true);
    expect(mockBookRepository.save).toHaveBeenCalledWith(book);
  });

  test("setBookUnavailable should update book availability to false", async () => {
    const book = { id: 1, name: "Test Book", isAvailable: true };
    mockBookRepository.save.mockResolvedValue(null);

    await bookService.setBookUnavailable(book);
    expect(book.isAvailable).toBe(false);
    expect(mockBookRepository.save).toHaveBeenCalledWith(book);
  });

  test("createBook should create and save a new book", async () => {
    const bookData = { name: "New Book" };
    const savedBook = { id: 1, ...bookData };
    mockBookRepository.create = jest.fn().mockReturnValue(savedBook);
    mockBookRepository.save.mockResolvedValue(savedBook);

    const result = await bookService.createBook(bookData);
    expect(result).toBe(1);
    expect(mockBookRepository.save).toHaveBeenCalledWith(savedBook);
  });
});
