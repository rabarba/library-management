import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { UserService } from "../services/UserService";
import { UserBookService } from "../services/UserBookService";
import { createUserValidation, getUserValidation } from "../validations/userValidation";
import { HttpStatus } from "../enums/HttpStatus";

@injectable()
export class UserController {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(UserBookService) private userBookService: UserBookService
  ) { }

  getUsers = async (_: Request, res: Response) => {
    try {
      const users = await this.userService.getUsers();
      res.status(HttpStatus.OK).json(users);
    } catch (error: any) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || 'Internal Server Error' });
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const { error } = createUserValidation.validate(req.body);
      if (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.details.map(detail => detail.message) });
        return;
      }

      const userId = await this.userService.createUser(req.body);
      res.status(HttpStatus.CREATED).json(userId);

    } catch (error: any) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message});
    }
  }

  getUser = async (req: Request, res: Response) => {
    try {
      const { error } = getUserValidation.validate(req.params);
      if (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.details.map(detail => detail.message) });
        return;
      }

      const users = await this.userService.getUser(parseInt(req.params.id));
      res.status(HttpStatus.OK).json(users);
    } catch (error: any) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message});
    }
  };

  borrowBook = async (req: Request, res: Response) => {
    try {
      const { userId, bookId } = req.params;
      await this.userBookService.borrowBook(parseInt(userId), parseInt(bookId));
      res.status(HttpStatus.CREATED).json();
    } catch (error: any) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message});
    }
  }
}