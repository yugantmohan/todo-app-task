// src/routes/todoRoutes.ts

import express from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  reorderTodos,
} from '../controllers/todoController.js';

import { authenticateToken } from '../middlewares/authMiddleware.js';
import { RequestHandler } from 'express';

const router = express.Router();


router.get('/', authenticateToken as RequestHandler, getTodos as RequestHandler);
router.post('/', authenticateToken as RequestHandler, createTodo as RequestHandler);
router.put('/:id', authenticateToken as RequestHandler, updateTodo as RequestHandler);
router.delete('/:id', authenticateToken as RequestHandler, deleteTodo as RequestHandler);
router.patch('/reorder', authenticateToken as RequestHandler, reorderTodos as RequestHandler);

export default router;
