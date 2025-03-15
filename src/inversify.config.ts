import { Container } from "inversify";
import { UserService } from "./services/UserService";
import { UserController } from "./controllers/UserController";

const container = new Container();
container.bind<UserService>(UserService).toSelf();
container.bind<UserController>(UserController).toSelf();

export default container;