import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;