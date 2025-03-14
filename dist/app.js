"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const data_source_1 = require("./data-source");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/users', userRoutes_1.default);
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("✅ Database connected successfully!");
    app.listen(3000, () => {
        console.log("🚀 Server is running on port 3000");
    });
})
    .catch((error) => {
    console.error("❌ Database connection failed:", error);
});
