import { injectable } from "inversify";
import redis from "../redisClient";

@injectable()
export class CacheService {

  /**
   * Retrieves data from the cache using a specified prefix and ID.
   *
   * @param prefix - The prefix to use for the cache key.
   * @param id - The ID to use for the cache key.
   * @returns A promise that resolves to the cached data, or null if no data is found.
   */
  async getDataFromCache(prefix: string, id: number) {
    const cacheKey = `${prefix}:${id}`;
    return await redis.get(cacheKey);
  }

  /**
   * Stores data in the cache with a specified prefix and id.
   *
   * @template T - The type of the data to be cached.
   * @param {string} prefix - The prefix to be used in the cache key.
   * @param {number} id - The unique identifier to be used in the cache key.
   * @param {T} data - The data to be cached.
   * @returns {Promise<void>} A promise that resolves when the data is successfully cached.
   */
  async setDataToCache<T>(prefix: string, id: number, data: T) {
    const cacheKey = `${prefix}:${id}`
    await redis.set(cacheKey, JSON.stringify(data));
  }

  /**
   * Deletes data from the cache based on the provided prefix and id.
   *
   * @param {string} prefix - The prefix used to identify the cache key.
   * @param {number} id - The unique identifier used to complete the cache key.
   * @returns {Promise<number>} - A promise that resolves to the number of keys that were removed.
   */
  async deleteDataFromCache(prefix: string, id: number) {
    const cacheKey = `${prefix}:${id}`
    return await redis.del(cacheKey);
  }
}