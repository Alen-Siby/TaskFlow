import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { FloatingActionButton } from './FloatingActionButton';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTasks } from '../../hooks/useTasks';
import { Task, TaskFormData, TaskStatus } from '../../types';
import { API_BASE_URL } from '../../config';

interface TaskAppProps {
  onLogout: () => void;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const TaskApp: React.FC<TaskAppProps> = ({ onLogout, addToast }) => {
  const { tasks, isLoading, addTask, updateTask, deleteTask, reorderTasks, setTasks } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const getAuthHeaders = (includeContentType = true) => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
    };
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  const mapBackendTodoToTask = (todo: any): Task => ({
    id: todo.tid,
    title: todo.topic,
    description: todo.discription,
    status: todo.status || 'PENDING',
    priority: todo.priority ? todo.priority.toLowerCase() : 'low',
    dueDate: todo.dueDate,
    category: todo.category ? todo.category.toLowerCase() : 'personal',
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
  });

  const handleAddTask = async (data: TaskFormData) => {
    try {
      const postData = {
        topic: data.title,
        discription: data.description,
        status: 'IN_PROGRESS',
        priority: data.priority.toUpperCase(),
        category: data.category.toUpperCase(),
        dueDate: data.dueDate,
      };
      const response = await fetch(`${API_BASE_URL}/todo`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error('Failed to save task to backend');
      }
      const savedTask = await response.json();
      addTask(mapBackendTodoToTask(savedTask));
      addToast('success', 'Task created successfully!');
      handleFormClose();
    } catch (error) {
      addToast('error', 'Failed to create task');
      console.error(error);
    }
  };

  const handleEditTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      const postData = {
        topic: data.title,
        discription: data.description,
        status: editingTask.status,
        priority: data.priority.toUpperCase(),
        category: data.category.toUpperCase(),
        dueDate: data.dueDate,
      };
      const response = await fetch(`${API_BASE_URL}/todo/${editingTask.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error('Failed to update task in backend');
      }
      const updatedTaskFromBackend = await response.json();
      updateTask(editingTask.id, mapBackendTodoToTask(updatedTaskFromBackend));
      addToast('success', 'Task updated successfully!');
      handleFormClose();
    } catch (error) {
      addToast('error', 'Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todo/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(false),
      });
      if (!response.ok) {
        throw new Error('Failed to delete task in backend');
      }
      deleteTask(id);
      addToast('success', 'Task deleted successfully!');
    } catch (error) {
      addToast('error', 'Failed to delete task');
      console.error(error);
    }
  };
  
  const handleStatusChange = async (id: string, status: TaskStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const originalStatus = task.status;
    updateTask(id, { ...task, status });
    
    try {
      const postData = {
        topic: task.title,
        discription: task.description,
        status: status,
        priority: task.priority.toUpperCase(),
        category: task.category.toUpperCase(),
        dueDate: task.dueDate,
      };

      const response = await fetch(`${API_BASE_URL}/todo/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update task in backend: ${response.status} ${errorText}`);
      }
      
      const updatedTaskFromBackend = await response.json();
      updateTask(id, mapBackendTodoToTask(updatedTaskFromBackend));
      addToast('success', `Task status updated to ${status}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      updateTask(id, { ...task, status: originalStatus }); // Rollback
      addToast('error', 'Failed to update task status');
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleFormSubmit = (data: TaskFormData) => {
    if (editingTask) {
      handleEditTask(data);
    } else {
      handleAddTask(data);
    }
  };

  const fetchTodos = useCallback(async () => {
      try {
      const token = localStorage.getItem('token');
      if (!token) {
        addToast('info', 'Please log in to view your tasks.');
        if (setTasks) setTasks([]);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/todo`, {
        headers: getAuthHeaders(false),
      });
        if (!response.ok) {
        if (response.status === 403) {
          addToast('error', 'Session expired. Please log in again.');
          onLogout();
        }
          throw new Error('Failed to fetch todos from backend');
        }
        const backendTodos = await response.json();
        const mappedTodos = backendTodos.map(mapBackendTodoToTask);
        if (setTasks) {
          setTasks(mappedTodos);
        }
      } catch (error) {
        addToast('error', 'Failed to load tasks from backend');
        console.error(error);
      }
  }, [addToast, onLogout, setTasks]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-white/10 sticky top-0 z-30"
      >
        <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="text-xl font-bold">TaskFlow</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <motion.button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Your Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your tasks with style and efficiency
          </p>
        </motion.div>

        <TaskList
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onEdit={handleEditClick}
          onDelete={handleDeleteTask}
          onReorder={reorderTasks}
          isLoading={isLoading}
        />
      </main>

      <FloatingActionButton onNewTask={() => setIsFormOpen(true)} />

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        task={editingTask}
        addToast={addToast}
      />
    </div>
  );
};