
import { RequestHandler } from 'express';
import Todo from '../models/Todo.js';

export const getTodos: RequestHandler = async (req, res) => {
  const userId = (req as any).userId;
  const { search = '', status, page = 1, limit = 5 } = req.query;

  try {
    const query: any = {
      owner: userId,
      ...(status ? { status } : {}),
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    };

    const skip = (Number(page) - 1) * Number(limit);
    const todos = await Todo.find(query)
      .sort({ position: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Todo.countDocuments(query);

    res.json({
      todos,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('[TODO] Get todos error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// CREATE a new todo
export const createTodo: RequestHandler = async (req, res) => {
  const userId = (req as any).userId;
  const { title, description, dueDate } = req.body;

  try {
    const latestTodo = await Todo.find({ owner: userId }).sort({ position: -1 }).limit(1);
    const nextPosition = latestTodo.length > 0 ? latestTodo[0].position + 1 : 0;

    const todo = new Todo({
      title,
      description,
      dueDate,
      status: 'pending',
      owner: userId,
      position: nextPosition,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('[TODO] Create todo error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE a todo
export const updateTodo: RequestHandler = async (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, owner: userId },
      req.body,
      { new: true }
    );

    if (!todo) {
      res.status(404).json({ message: 'Todo not found or unauthorized' });
      return;
    }

    res.json(todo);
  } catch (error) {
    console.error('[TODO] Update todo error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE a todo
export const deleteTodo: RequestHandler = async (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndDelete({ _id: id, owner: userId });

    if (!todo) {
      res.status(404).json({ message: 'Todo not found or unauthorized' });
      return;
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('[TODO] Delete todo error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const reorderTodos: RequestHandler = async (req, res) => {
  const userId = (req as any).userId;
  const { orderedIds }: { orderedIds: string[] } = req.body;

  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await Todo.updateOne(
        { _id: orderedIds[i], owner: userId },
        { position: i }
      );
    }

    res.json({ message: 'Todos reordered successfully' });
  } catch (error) {
    console.error('[TODO] Reorder error:', error);
    res.status(500).json({ message: 'Failed to reorder todos' });
  }
};
