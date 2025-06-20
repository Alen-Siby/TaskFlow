import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { FloatingActionButton } from './FloatingActionButton';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTasks } from '../../hooks/useTasks';
import { useToast, ToastContainer } from '../ui/Toast';
import { Task, TaskFormData } from '../../types';

interface TaskAppProps {
  onBack: () => void;
}

export const TaskApp: React.FC<TaskAppProps> = ({ onBack }) => {
  const { tasks, isLoading, addTask, updateTask, deleteTask, toggleTask, reorderTasks, setTasks } = useTasks();
  const { toasts, addToast, removeToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
      console.log('Form data to submit:', JSON.stringify(postData, null, 2));
      const response = await fetch('http://localhost:8081/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error('Failed to save task to backend');
      }
      const savedTask = await response.json();
      addTask(savedTask);
      addToast('success', 'Task created successfully!');
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
        status: 'IN_PROGRESS',
        priority: data.priority.toUpperCase(),
        category: data.category.toUpperCase(),
        dueDate: data.dueDate,
      };
      console.log('Edit data to submit:', JSON.stringify(postData, null, 2));
      const response = await fetch(`http://localhost:8081/todo/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error('Failed to update task in backend');
      }
      const updatedTask = await response.json();
      updateTask(editingTask.id, updatedTask);
      addToast('success', 'Task updated successfully!');
      setEditingTask(null);
    } catch (error) {
      addToast('error', 'Failed to update task');
      console.error(error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8081/todo/${id}`, {
        method: 'DELETE',
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

  const handleToggleTask = (id: string) => {
    try {
      toggleTask(id);
      const task = tasks.find(t => t.id === id);
      if (task) {
        addToast('success', `Task ${task.completed ? 'uncompleted' : 'completed'}!`);
      }
    } catch (error) {
      addToast('error', 'Failed to update task');
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

  useEffect(() => {
    // Fetch todos from backend on mount
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:8081/todo');
        if (!response.ok) {
          throw new Error('Failed to fetch todos from backend');
        }
        const backendTodos = await response.json();
        // Map backend fields to frontend Task type
        const mappedTodos = backendTodos.map((todo: any) => ({
          ...todo,
          title: todo.topic,
          description: todo.discription,
        }));
        // Replace local state with backend todos
        // If you use setTasks directly, otherwise use a method from useTasks
        if (typeof setTasks === 'function') {
          setTasks(mappedTodos);
        } else if (typeof addTask === 'function') {
          (mappedTodos as any[]).forEach((task: any) => addTask(task));
        }
      } catch (error) {
        addToast('error', 'Failed to load tasks from backend');
        console.error(error);
      }
    };
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-white/10 sticky top-0 z-30"
      >
        <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="text-xl font-bold">TaskFlow</span>
            </div>
          </div>
          
          <ThemeToggle />
        </nav>
      </motion.header>

      {/* Main Content */}
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
          onToggle={handleToggleTask}
          onEdit={handleEditClick}
          onDelete={handleDeleteTask}
          onReorder={reorderTasks}
          isLoading={isLoading}
        />
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onNewTask={() => setIsFormOpen(true)} />

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingTask={editingTask}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};