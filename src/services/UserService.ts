import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/UserEntity";
import { HttpException } from "../exceptions/HttpException";
import { HttpStatus } from "../enums/HttpStatus";

@injectable()
export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'User Not Found');
    return user;
  }

  async createUser(userData: Partial<User>): Promise<number> {
    const user = this.userRepository.create(userData);
    return (await this.userRepository.save(user)).id;
  }
}