import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import engineerRoutes from './routes/engineers';
import projectRoutes from './routes/projects';
import assignmentRoutes from './routes/assignments';

import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/engineers', authMiddleware, engineerRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/assignments', authMiddleware, assignmentRoutes);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err);
  });