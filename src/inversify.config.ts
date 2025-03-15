import { Container } from "inversify";
import { UserService } from "./services/UserService";
import { UserController } from "./controllers/UserController";
import { BookService } from "./services/BookService";
import { BookController } from "./controllers/BookController";
import { UserBookService } from "./services/UserBookService";
import { CacheService } from "./services/CacheService";

const container = new Container();

container.bind<CacheService>(CacheService).toSelf();

container.bind<UserBookService>(UserBookService).toSelf();

container.bind<UserService>(UserService).toSelf();
container.bind<UserController>(UserController).toSelf();

container.bind<BookService>(BookService).toSelf();
container.bind<BookController>(BookController).toSelf();

export default container;