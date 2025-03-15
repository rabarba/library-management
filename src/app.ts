import express from 'express';
import userRoutes from './routes/userRoutes';
import { AppDataSource } from './data-source';
import bookRoutes from './routes/bookRoutes';

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/books', bookRoutes);


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