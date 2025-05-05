import { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import todoService, { Todo, CreateTodoInput, UpdateTodoInput } from '../services/todoService';

const SortableTodo = ({ todo, onEdit, onDelete, onToggleComplete }: {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move mt-2 ml-1 p-1 text-gray-400 hover:text-gray-600"
        >
          <GripVertical size={16} />
        </div>
        <TodoItem
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'pending' | 'completed' | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTodos = async () => {
    const res = await todoService.getTodos({ search, status, page, limit: 5 });
    setTodos(res.todos);
    setTotalPages(res.totalPages);
  };

  useEffect(() => {
    fetchTodos();
  }, [search, status, page]);

  const handleCreateOrUpdate = async (data: CreateTodoInput | UpdateTodoInput) => {
    if (editingTodo) {
      const updated = await todoService.updateTodo(editingTodo._id, data);
      setTodos(todos.map((t) => (t._id === updated._id ? updated : t)));
    } else {
      const newTodo = await todoService.createTodo(data as CreateTodoInput);
      setTodos([...todos, newTodo]);
    }
    setEditingTodo(null);
  };

  const handleDelete = async (id: string) => {
    await todoService.deleteTodo(id);
    setTodos(todos.filter((t) => t._id !== id));
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const updated = await todoService.updateTodo(id, { completed });
    setTodos(todos.map((t) => (t._id === id ? updated : t)));
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((t) => t._id === active.id);
    const newIndex = todos.findIndex((t) => t._id === over.id);
    const newOrder = arrayMove(todos, oldIndex, newIndex);
    setTodos(newOrder);

    try {
      await todoService.reorderTodos(newOrder.map((todo) => todo._id));
    } catch (err) {
      console.error('Failed to persist new order');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Filter + Search */}
      <div className="flex gap-4 mb-4 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search todos..."
          className="px-3 py-1 border rounded"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as any);
            setPage(1);
          }}
          className="px-3 py-1 border rounded"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button
          onClick={() => setIsFormOpen(true)}
          className="ml-auto bg-black text-white px-4 py-2 rounded"
        >
          + Add Todo
        </button>
      </div>

      {/* Todos List */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {todos.map((todo) => (
              <SortableTodo
                key={todo._id}
                todo={todo}
                onEdit={(t: Todo) => {
                  setEditingTodo(t);
                  setIsFormOpen(true);
                }}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6 items-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Todo Form Dialog */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTodo ?? undefined}
        isEditing={!!editingTodo}
      />
    </div>
  );
};

export default Dashboard;
