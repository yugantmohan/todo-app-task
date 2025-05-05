import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import { authenticateToken } from './middlewares/authMiddleware.js';
import { RequestHandler } from 'express';

dotenv.config();
const PORT = process.env.PORT || 3000
const app = express()
app.use(cors({origin: true, credentials:true}))
app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
  res.status(200).json({message:"healthy"})
})

// Routes
app.use('/api/auth', authRoutes); // Public
app.use('/api/todos', authenticateToken as RequestHandler, todoRoutes); // Protected

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
