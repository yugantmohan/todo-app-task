import { useState } from 'react';
import { Todo } from '../services/todoService';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  dragListeners?: any; 
  
  
}

const TodoItem = ({ todo, onEdit, onDelete, onToggleComplete }: TodoItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Map backend status to frontend completed
  const completed = todo.status === 'completed';

  const handleToggleComplete = () => {
    onToggleComplete(todo._id, !completed);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(todo._id);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return null;
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Invalid date format:', error);
      return null;
    }
  };

  const timeAgo = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return '';
      
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return formatDate(dateString) || '';
    } catch {
      return '';
    }
  };
  
  const isOverdue = () => {
    if (!todo.dueDate) return false;
    try {
      const dueDate = parseISO(todo.dueDate);
      return isValid(dueDate) && dueDate < new Date() && !completed;
    } catch {
      return false;
    }
  };

  return (
    <Card className={`w-full transition-all duration-200 hover:shadow-md ${isOverdue() ? 'border-red-300' : completed ? 'bg-gray-50' : ''}`}>
      <CardContent className="pt-6 pb-2">
        <div className="flex items-start gap-2">
          <Checkbox 
            checked={completed} 
            onCheckedChange={() => handleToggleComplete()}
            className="mt-1"
          />
          
          <div className="flex-1">
            <h3 className={`font-medium text-lg ${completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h3>
            <p className={`text-sm mt-1 ${completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
              {todo.dueDate && (
                <div className={`flex items-center gap-1 text-xs ${isOverdue() ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(todo.dueDate)}</span>
                  {isOverdue() && <span className="bg-red-50 text-red-600 px-1 rounded text-[10px] font-medium">OVERDUE</span>}
                </div>
              )}
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Updated {todo.updatedAt ? timeAgo(todo.updatedAt) : 'recently'}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Created: {todo.createdAt ? formatDate(todo.createdAt) : 'Unknown'}</p>
                    <p className="text-xs">Last updated: {todo.updatedAt ? formatDate(todo.updatedAt) : 'Unknown'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(todo)}
          className="h-8 px-2"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Popover open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <p className="text-sm font-medium mb-2">Delete this todo?</p>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-1"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};

export default TodoItem;
