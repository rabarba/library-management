import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { BookService } from "../services/BookService";
import { HttpStatus } from "../enums/HttpStatus";
import { getBookValidation } from "../validations/bookValidation";

@injectable()
export class BookController {
  constructor(@inject(BookService) private bookService: BookService) { }

  getBook = async (req: Request, res: Response) => {
    try {
      const { error } = getBookValidation.validate(req.params);
      if (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.details.map(detail => detail.message) });
        return;
      }

      const books = await this.bookService.getBookWithRatings(parseInt(req.params.id));
      res.status(HttpStatus.OK).json(books);
    } catch (error: any) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message});
    }
  };

  getBooks = async (_: Request, res: Response) => {
    try {
      const books = await this.bookService.getBooks();
      res.status(HttpStatus.OK).json(books);
    } catch (error: any) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message});
    }
  };

  createBook = async (req: Request, res: Response) => {
    try {
      const bookId = await this.bookService.createBook(req.body);
      res.status(HttpStatus.CREATED).json(bookId);
    } catch (error: any) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message});
    }
  }
}