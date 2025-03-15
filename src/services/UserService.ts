import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/UserEntity";

@injectable()
export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUser(userId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: userId });
  }

  async createUser(userData: Partial<User>): Promise<number> {
    const user = this.userRepository.create(userData);
    return (await this.userRepository.save(user)).id;
  }
}