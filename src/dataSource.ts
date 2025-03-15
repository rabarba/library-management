import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/UserEntity";
import { Book } from "./entity/BookEntity";
import { UserBook } from "./entity/UserBookEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  migrationsRun: false,
  logging: true,
  entities: [User, Book, UserBook],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
