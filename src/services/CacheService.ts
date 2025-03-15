import { injectable } from "inversify";
import redis from "../redisClient";

@injectable()
export class CacheService {

  async getDataFromCache(prefix: string, id: number) {
    const cacheKey = `${prefix}:${id}`;
    return await redis.get(cacheKey);
  }

  async setDataToCache<T>(prefix: string, id: number, data: T) {
    const cacheKey = `${prefix}:${id}`
    await redis.set(cacheKey, JSON.stringify(data));
  }

  async deleteDataFromCache(prefix: string, id: number) {
    const cacheKey = `${prefix}:${id}`
    return await redis.del(cacheKey);
  }
}