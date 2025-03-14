import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import { AppDataSource } from './data-source';

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);


AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected successfully!");
    app.listen(3000, () => {
      console.log("🚀 Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });