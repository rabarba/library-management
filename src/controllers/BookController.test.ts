import { Request, Response } from "express";
import { BookController } from "../controllers/BookController";
import { BookService } from "../services/BookService";
import { HttpStatus } from "../enums/HttpStatus";
import { HttpException } from "../exceptions/HttpException";

const mockBookService = {
  getBookWithRatings: jest.fn(),
  getBooks: jest.fn(),
  createBook: jest.fn(),
};

const bookController = new BookController(
  mockBookService as unknown as BookService
);

describe("BookController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {};
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe("getBook", () => {
    it("should return 400 if book ID is invalid", async () => {
      mockRequest = { params: { id: "abc" } };

      await bookController.getBook(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(jsonMock).toHaveBeenCalled();
    });

    it("should return 404 if book not found", async () => {
      mockRequest = { params: { id: "1" } };
      mockBookService.getBookWithRatings.mockRejectedValue(new HttpException(HttpStatus.NOT_FOUND, 'Book not found'));

      await bookController.getBook(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Book not found" });
    });

    it("should return book with 200 status", async () => {
      mockRequest = { params: { id: "1" } };
      const mockBook = { id: 1, name: "Book Title", score: -1};
      mockBookService.getBookWithRatings.mockResolvedValue(mockBook);

      await bookController.getBook(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(mockBook);
    });
  });

  describe("getBooks", () => {
    it("should return books with status 200", async () => {
      const mockBooks = [{ id: 1, name: "Book 1" }, { id: 2, name: "Book 2" }];
      mockBookService.getBooks.mockResolvedValue(mockBooks);

      await bookController.getBooks(mockRequest as Request, mockResponse as Response);

      expect(mockBookService.getBooks).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(mockBooks);
    });

    it("should handle errors properly", async () => {
      mockBookService.getBooks.mockRejectedValue(new Error("Database error"));

      await bookController.getBooks(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("createBook", () => {
    it("should create book and return 201", async () => {
      mockRequest = { body: { name: "New Book" } };
      mockBookService.createBook.mockResolvedValue(1);

      await bookController.createBook(mockRequest as Request, mockResponse as Response);

      expect(mockBookService.createBook).toHaveBeenCalledWith({ name: "New Book" });
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(jsonMock).toHaveBeenCalledWith(1);
    });

    it("should handle errors properly", async () => {
      mockBookService.createBook.mockRejectedValue(new Error("Database error"));

      await bookController.createBook(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Database error" });
    });
  });
});
