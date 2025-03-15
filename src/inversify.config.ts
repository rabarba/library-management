import { Container } from "inversify";
import { UserService } from "./services/UserService";
import { UserController } from "./controllers/UserController";
import { BookService } from "./services/BookService";
import { BookController } from "./controllers/BookController";

const container = new Container();

container.bind<UserService>(UserService).toSelf();
container.bind<UserController>(UserController).toSelf();
container.bind<BookService>(BookService).toSelf();
container.bind<BookController>(BookController).toSelf();

export default container;