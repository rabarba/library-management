import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { BookService } from "../services/BookService";

@injectable()
export class BookController {
  constructor(@inject(BookService) private bookService: BookService) { }

  getBooks = async (_: Request, res: Response) => {
    try {
      const users = await this.bookService.getBooks();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  createBook = async (req: Request, res: Response) => {
    try {
      const userId = await this.bookService.createBook(req.body);
      res.status(201).json(userId);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}