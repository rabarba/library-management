import express from "express";
import container from "../inversify.config";
import { UserController } from "../controllers/UserController";

const router = express.Router();
const userController = container.get<UserController>(UserController);

router.get("/", userController.getUsers);
router.post("/", userController.createUser);

export default router;