import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { UserService } from "../services/UserService";
import { UserBookService } from "../services/UserBookService";
import { createUserValidation, getUserValidation } from "../validations/userValidation";

@injectable()
export class UserController {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(UserBookService) private userBookService: UserBookService
  ) { }

  getUsers = async (_: Request, res: Response) => {
    try {
      const users = await this.userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const { error } = createUserValidation.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map(detail => detail.message) });
        return;
      }

      const userId = await this.userService.createUser(req.body);
      res.status(201).json(userId);
      
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  borrowBook = async (req: Request, res: Response) => {
    try {
      const { userId, bookId } = req.params;
      await this.userBookService.borrowBook(parseInt(userId), parseInt(bookId));
      res.status(201).json();
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
    }
  }
}