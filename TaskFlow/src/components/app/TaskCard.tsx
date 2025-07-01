import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Calendar, Flag, Edit2, Trash2, ChevronDown, CheckCircle, Clock, XCircle, Loader } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { useToast } from "../ui/Toast";

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onEdit, onDelete }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  
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

  const statusConfig: Record<TaskStatus, { label: string; icon: React.ElementType; color: string }> = {
    PENDING: { label: 'Pending', icon: Clock, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300' },
    IN_PROGRESS: { label: 'In Progress', icon: Loader, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300' },
    COMPLETED: { label: 'Completed', icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300' },
    CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300' },
  };

  const categoryColors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
  ];

  const categoryColorIndex = Math.abs(task.category.charCodeAt(0)) % categoryColors.length;

  const { addToast } = useToast();

  const StatusIcon = statusConfig[task.status].icon;

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
      className={`glass-strong rounded-xl p-6 hover:shadow-lg transition-all duration-200 min-h-[200px] flex flex-col ${
        isDragging ? 'opacity-50 scale-105' : ''
      } ${task.status === 'COMPLETED' ? 'opacity-60 saturate-[.8] blur-[0.5px]' : ''}`}
    >
      {/* Header with Status and Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <motion.button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
              statusConfig[task.status].color
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <StatusIcon className="w-4 h-4" />
            <span>{statusConfig[task.status].label}</span>
            <ChevronDown className="w-4 h-4" />
          </motion.button>
          
          {showStatusMenu && (
            <motion.div 
              className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-[9999] p-1 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {Object.keys(statusConfig).map((statusKey) => {
                const MenuStatusIcon = statusConfig[statusKey as TaskStatus].icon;
                const statusColor = statusConfig[statusKey as TaskStatus].color;
                const textColor = statusColor.includes('text-') ? statusColor.split(' ').find(cls => cls.startsWith('text-')) : 'text-gray-700 dark:text-gray-300';
                return (
                <button
                  key={statusKey}
                  onClick={() => {
                    onStatusChange(task.id, statusKey as TaskStatus);
                    setShowStatusMenu(false);
                  }}
                  className="w-full flex items-center space-x-1 px-2 py-1 text-xs rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <MenuStatusIcon className={`w-4 h-4 ${textColor}`} />
                  <span className={textColor}>{statusConfig[statusKey as TaskStatus].label}</span>
                </button>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Edit
            </span>
          </motion.button>
          
          <motion.button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Delete
            </span>
          </motion.button>
        </div>
      </div>

      {/* Task Content */}
      <div 
        {...listeners} 
        className="flex-1 cursor-grab active:cursor-grabbing"
      >
        <h3 className={`font-semibold text-lg mb-2 ${
          task.status === 'COMPLETED' ? 'line-through text-gray-500 decoration-wavy' : 'text-gray-900 dark:text-gray-100'
        }`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer with Tags and Date */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[categoryColorIndex]}`}>
              {task.category}
            </span>
            
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
              <Flag className="w-3 h-3" />
              <span className="capitalize">{task.priority}</span>
            </div>
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