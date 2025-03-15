import { Request, Response } from "express";
import { UserController } from "./UserController";
import { UserService } from "../services/UserService";
import { UserBookService } from "../services/UserBookService";
import { HttpStatus } from "../enums/HttpStatus";
import { HttpException } from "../exceptions/HttpException";

const mockUserService = {
  getUsers: jest.fn(),
  createUser: jest.fn(),
  getUser: jest.fn(),
};

const mockUserBookService = {
  borrowBook: jest.fn(),
};

const userController = new UserController(
  mockUserService as unknown as UserService,
  mockUserBookService as unknown as UserBookService
);

describe("UserController", () => {
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

  describe("getUsers", () => {
    it("should return users with status 200", async () => {
      const mockUsers = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
      mockUserService.getUsers.mockResolvedValue(mockUsers);

      await userController.getUsers(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.getUsers).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(mockUsers);
    });

    it("should handle errors properly", async () => {
      mockUserService.getUsers.mockRejectedValue(new Error("Database error"));

      await userController.getUsers(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("createUser", () => {
    it("should return 400 if validation fails", async () => {
      mockRequest = { body: { name: 3214 } };

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(jsonMock).toHaveBeenCalled();
    });

    it("should create user and return 201", async () => {
      mockRequest = { body: { name: "New User" } };
      mockUserService.createUser.mockResolvedValue(1);

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.createUser).toHaveBeenCalledWith({ name: "New User" });
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(jsonMock).toHaveBeenCalledWith(1);
    });
  });

  describe("getUser", () => {
    it("should return 400 if user ID is invalid", async () => {
      mockRequest = { params: { id: "abc" } };

      await userController.getUser(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(jsonMock).toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      mockRequest = { params: { id: "1" } };
      mockUserService.getUser.mockRejectedValue(new HttpException(HttpStatus.NOT_FOUND, 'User not found'));

      await userController.getUser(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return user with 200 status", async () => {
      mockRequest = { params: { id: "1" } };
      const mockUser = { id: 1, name: "Alice" };
      mockUserService.getUser.mockResolvedValue(mockUser);

      await userController.getUser(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("borrowBook", () => {
    it("should return 201 when book is borrowed", async () => {
      mockRequest = { params: { userId: "1", bookId: "10" } };

      await userController.borrowBook(mockRequest as Request, mockResponse as Response);

      expect(mockUserBookService.borrowBook).toHaveBeenCalledWith(1, 10);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(jsonMock).toHaveBeenCalled();
    });
  });
});
