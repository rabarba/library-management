import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { UserService } from "../services/UserService";

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) { }

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
      const userId = await this.userService.createUser(req.body);
      res.status(201).json(userId);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}