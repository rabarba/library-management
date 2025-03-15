import "reflect-metadata";
import { UserService } from "../services/UserService";
import { CacheService } from "../services/CacheService";
import { Repository } from "typeorm";
import { User } from "../entity/UserEntity";
import { HttpException } from "../exceptions/HttpException";
import { HttpStatus } from "../enums/HttpStatus";

jest.mock("../services/CacheService");

const mockUserRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe("UserService", () => {
  let userService: any;
  let cacheService: any;

  beforeEach(() => {
    cacheService = new CacheService();
    userService = new UserService(cacheService);
    userService.userRepository = mockUserRepository as unknown as Repository<User>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUsers should return list of users", async () => {
    const users = [{ id: 1, name: "John" }, { id: 2, name: "Doe" }];
    mockUserRepository.find.mockResolvedValue(users);

    const result = await userService.getUsers();
    expect(result).toEqual(users);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });

  test("getUser should return user if found", async () => {
    const user = { id: 1, name: "John" };
    mockUserRepository.findOneBy.mockResolvedValue(user);

    const result = await userService.getUser(1);
    expect(result).toEqual(user);
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  test("getUser should throw exception if user not found", async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);

    await expect(userService.getUser(1))
      .rejects.toThrow(new HttpException(HttpStatus.NOT_FOUND, "User Not Found"));
  });

  test("getUserWithBooks should return cached data if available", async () => {
    const cachedData = JSON.stringify({ id: 1, name: "John", books: { past: [], present: [] } });
    cacheService.getDataFromCache = jest.fn().mockResolvedValue(cachedData);

    const result = await userService.getUserWithBooks(1);
    expect(result).toEqual(JSON.parse(cachedData));
    expect(cacheService.getDataFromCache).toHaveBeenCalledWith("user", 1);
  });

  test("getUserWithBooks should fetch from DB if cache is empty", async () => {
    const user = {
      id: 1,
      name: "John",
      userBooks: [{ book: { name: "Book1" }, score: 5 }]
    };
    mockUserRepository.findOne.mockResolvedValue(user);
    cacheService.getDataFromCache = jest.fn().mockResolvedValue(null);
    cacheService.setDataToCache = jest.fn();

    const result = await userService.getUserWithBooks(1);

    expect(result).toEqual({
      id: 1,
      name: "John",
      books: {
        past: [{ name: "Book1", userScore: 5 }],
        present: []
      }
    });
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ["userBooks", "userBooks.book"] });
    expect(cacheService.setDataToCache).toHaveBeenCalledWith("user", 1, result);
  });

  test("getUserWithBooks should throw exception if user not found", async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    cacheService.getDataFromCache = jest.fn().mockResolvedValue(null);

    await expect(userService.getUserWithBooks(1))
      .rejects.toThrow(new HttpException(HttpStatus.NOT_FOUND, "User Not Found"));
  });

  test("createUser should create and save a new user", async () => {
    const userData = { name: "John" };
    const savedUser = { id: 1, ...userData };
    mockUserRepository.create.mockReturnValue(userData);
    mockUserRepository.save.mockResolvedValue(savedUser);

    const result = await userService.createUser(userData);
    expect(result).toBe(1);
    expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    expect(mockUserRepository.save).toHaveBeenCalledWith(userData);
  });
});
