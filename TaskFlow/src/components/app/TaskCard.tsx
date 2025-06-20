import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Calendar, Flag, Edit2, Trash2 } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    medium: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    high: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  };

  const categoryColors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
  ];

  const categoryColorIndex = Math.abs(task.category.charCodeAt(0)) % categoryColors.length;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ 
        opacity: 0, 
        scale: 0.8, 
        transition: { duration: 0.2 } 
      }}
      className={`glass-strong rounded-xl p-4 hover:shadow-lg transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-105' : ''
      } ${task.completed ? 'opacity-75' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <motion.button
            onClick={() => onToggle(task.id)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {task.completed && (
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
                className="w-3 h-3 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path d="M20 6L9 17l-5-5" />
              </motion.svg>
            )}
          </motion.button>
          
          <div 
            {...listeners} 
            className="flex-1 cursor-grab active:cursor-grabbing"
          >
            <h3 className={`font-medium text-lg ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showActions ? 1 : 0 }}
          className="relative"
        >
          <button
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-8 glass-strong rounded-lg shadow-lg p-1 z-10 min-w-[120px]"
            >
              <button
                onClick={() => onEdit(task)}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[categoryColorIndex]}`}>
            {task.category}
          </span>
          
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
            <Flag className="w-3 h-3" />
            <span className="capitalize">{task.priority}</span>
          </div>
        </div>

        {task.dueDate && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};