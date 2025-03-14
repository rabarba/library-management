import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/userEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "library_management",
  synchronize: false,
  migrationsRun: true,
  logging: true,
  entities: [User],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
