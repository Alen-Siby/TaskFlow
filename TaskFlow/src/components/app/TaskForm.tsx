import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Flag, ListTodo, Calendar, Folder, ChevronDown, ChevronUp, Briefcase, BookOpen, Heart, Sun, User } from 'lucide-react';
import { Task, TaskFormData } from '../../types';
import { Button } from '../ui/Button';
import { API_BASE_URL } from '../../config';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  editingTask?: Task | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingTask 
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'low',
    dueDate: '',
    category: '',
  });

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  // Category options with icons
  const categoryOptions = [
    { value: 'WORK', label: 'Work', icon: <Briefcase className="w-4 h-4 mr-2 text-blue-500" /> },
    { value: 'PERSONAL', label: 'Personal', icon: <User className="w-4 h-4 mr-2 text-pink-500" /> },
    { value: 'BUSINESS', label: 'Business', icon: <Folder className="w-4 h-4 mr-2 text-purple-500" /> },
    { value: 'STUDY', label: 'Study', icon: <BookOpen className="w-4 h-4 mr-2 text-green-500" /> },
    { value: 'HEALTH', label: 'Health', icon: <Heart className="w-4 h-4 mr-2 text-red-500" /> },
    { value: 'DAYTODAY', label: 'Day to Day', icon: <Sun className="w-4 h-4 mr-2 text-yellow-500" /> },
  ];
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
        category: editingTask.category,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: '',
      });
    }
    setErrors({});
  }, [editingTask, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    if (!formData.description.trim() || formData.description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleAddTask = async (data: TaskFormData) => {
    try {
      // Prepare the data for the backend
      const { title, ...rest } = data;
      const postData = { ...rest, topic: title };

      // Send to Spring Boot backend
      const response = await fetch(`${API_BASE_URL}/todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to save task to backend');
      }

      // Optionally, get the saved task from the backend response
      const savedTask = await response.json();

      // Add to local state (if you want to use the backend's returned object, use savedTask)
      onSubmit(data);

      // Add to local state (if you want to use the backend's returned object, use savedTask)
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {editingTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-blue-400" /> Title *
            </label>
            <motion.input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border transition-colors shadow-sm focus:shadow-lg focus:scale-[1.02] duration-200 ${
                errors.title 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-opacity-50`}
              placeholder="Enter task title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            />
            {errors.title && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.title}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-gray-400" /> Description
            </label>
            <motion.textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors resize-none shadow-sm focus:shadow-lg focus:scale-[1.02] duration-200"
              rows={3}
              placeholder="Add a description (optional)"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Flag className="w-4 h-4 text-yellow-400" /> Priority
              </label>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-colors shadow-sm focus:shadow-lg focus:scale-[1.02] duration-200 appearance-none pr-10"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" /> Due Date
              </label>
              <motion.input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 transition-colors shadow-sm focus:shadow-lg focus:scale-[1.02] duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Folder className="w-4 h-4 text-indigo-400" /> Category *
            </label>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="relative">
                <button
                  type="button"
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors shadow-sm focus:shadow-lg focus:scale-[1.02] duration-200 ${
                    errors.category 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                  } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-opacity-50`}
                  onClick={() => setShowCategoryDropdown((v) => !v)}
                >
                  <span className="flex items-center">
                    {categoryOptions.find(opt => opt.value === formData.category)?.icon}
                    {categoryOptions.find(opt => opt.value === formData.category)?.label || 'Select Category'}
                  </span>
                  {showCategoryDropdown ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {showCategoryDropdown && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                  >
                    {categoryOptions.map(option => (
                      <li
                        key={option.value}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors ${formData.category === option.value ? 'bg-indigo-100 dark:bg-indigo-900/40 font-semibold' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, category: option.value });
                          setShowCategoryDropdown(false);
                        }}
                      >
                        {option.icon}
                        {option.label}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>
              {errors.category && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.category}
                </motion.p>
              )}
            </motion.div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};