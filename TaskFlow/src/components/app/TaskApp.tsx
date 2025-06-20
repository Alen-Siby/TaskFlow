import React, { useState } from 'react';
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
  const { tasks, isLoading, addTask, updateTask, deleteTask, toggleTask, reorderTasks } = useTasks();
  const { toasts, addToast, removeToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (data: TaskFormData) => {
    try {
      const newTask = addTask(data);
      addToast('success', 'Task created successfully!');
      // Send to localhost:8081 as JSON, with 'title' as 'topic'
      const { title, ...rest } = newTask;
      const postData = { ...rest, topic: title };
      fetch('http://localhost:8081', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      }).catch((err) => {
        // Optionally show a toast or log error
        console.error('Failed to send task to server:', err);
      });
    } catch (error) {
      addToast('error', 'Failed to create task');
    }
  };

  const handleEditTask = (data: TaskFormData) => {
    if (!editingTask) return;
    
    try {
      updateTask(editingTask.id, data);
      addToast('success', 'Task updated successfully!');
      setEditingTask(null);
    } catch (error) {
      addToast('error', 'Failed to update task');
    }
  };

  const handleDeleteTask = (id: string) => {
    try {
      deleteTask(id);
      addToast('success', 'Task deleted successfully!');
    } catch (error) {
      addToast('error', 'Failed to delete task');
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