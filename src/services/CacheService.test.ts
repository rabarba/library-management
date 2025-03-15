import "reflect-metadata";
import { CacheService } from "../services/CacheService";
import redis from "../redisClient";

jest.mock("../redisClient", () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn()
}));

describe("CacheService", () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
    jest.clearAllMocks();
  });

  test("should get data from cache", async () => {
    const mockData = JSON.stringify({ name: "test" });
    (redis.get as jest.Mock).mockResolvedValue(mockData);

    const result = await cacheService.getDataFromCache("user", 1);

    expect(redis.get).toHaveBeenCalledWith("user:1");
    expect(result).toBe(mockData);
  });

  test("should set data to cache", async () => {
    const mockData = { name: "test" };

    await cacheService.setDataToCache("user", 1, mockData);

    expect(redis.set).toHaveBeenCalledWith("user:1", JSON.stringify(mockData));
  });

  test("should delete data from cache", async () => {
    (redis.del as jest.Mock).mockResolvedValue(1);

    const result = await cacheService.deleteDataFromCache("user", 1);

    expect(redis.del).toHaveBeenCalledWith("user:1");
    expect(result).toBe(1);
  });
});