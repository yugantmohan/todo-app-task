import apiClient from './apiClient';
import { toast } from 'sonner';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'completed';
}

export interface CreateTodoInput {
  title: string;
  description: string;
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  status?: 'pending' | 'completed';
}

export interface GetTodosParams {
  search?: string;
  status?: '' | 'pending' | 'completed'; // Allow empty string for "All"
  page?: number;
  limit?: number;
}

const todoService = {
  async getTodos(params?: GetTodosParams): Promise<{
    todos: Todo[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const res = await apiClient.get('/todos', { params });
      return res.data;
    } catch (err) {
      toast.error('Failed to fetch todos');
      throw err;
    }
  },

  async getTodo(id: string): Promise<Todo> {
    try {
      const res = await apiClient.get(`/todos/${id}`);
      return res.data;
    } catch (err) {
      toast.error('Failed to fetch todo');
      throw err;
    }
  },

  async createTodo(data: CreateTodoInput): Promise<Todo> {
    try {
      const res = await apiClient.post('/todos', data);
      toast.success('Todo created');
      return res.data;
    } catch (err) {
      toast.error('Failed to create todo');
      throw err;
    }
  },

  async updateTodo(id: string, data: UpdateTodoInput): Promise<Todo> {
    try {
      if (data.completed !== undefined) {
        data.status = data.completed ? 'completed' : 'pending';
        delete data.completed;
      }

      const res = await apiClient.put(`/todos/${id}`, data);
      toast.success('Todo updated');
      return res.data;
    } catch (err) {
      toast.error('Failed to update todo');
      throw err;
    }
  },

  async deleteTodo(id: string): Promise<void> {
    try {
      await apiClient.delete(`/todos/${id}`);
      toast.success('Todo deleted');
    } catch (err) {
      toast.error('Failed to delete todo');
      throw err;
    }
  },

  async reorderTodos(orderedIds: string[]): Promise<void> {
    try {
      await apiClient.patch('/todos/reorder', { orderedIds });
    } catch (err) {
      toast.error('Failed to reorder todos');
      throw err;
    }
  }
};

export default todoService;
