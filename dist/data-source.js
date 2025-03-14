"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const userEntity_1 = require("./entity/userEntity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "postgres",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "library_management",
    synchronize: false,
    migrationsRun: true,
    logging: true,
    entities: [userEntity_1.User],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});
