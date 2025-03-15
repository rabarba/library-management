import express from "express";
import container from "../inversify.config";
import { BookController } from "../controllers/BookController";

const router = express.Router();
const bookController = container.get<BookController>(BookController);

router.get("/", bookController.getBooks);
router.post("/", bookController.createBook);

export default router;