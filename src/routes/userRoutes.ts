import express from "express";
import container from "../inversify.config";
import { UserController } from "../controllers/UserController";

const router = express.Router();
const userController = container.get<UserController>(UserController);

router.get("/:id", (req, res) => { userController.getUser(req, res) });
router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.post("/:userId/borrow/:bookId", (req, res) => { userController.borrowBook(req, res); });
router.post("/:userId/return/:bookId", (req, res) => { userController.returnBook(req, res); });

export default router;