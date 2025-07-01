import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Task, TaskStatus } from '../../types';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  isLoading: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
  onReorder,
  isLoading,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over?.id);
      onReorder(oldIndex, newIndex);
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'COMPLETED');
  const pendingTasks = tasks.filter(task => task.status === 'PENDING' || task.status === 'IN_PROGRESS');
  const overdueTasks = tasks.filter(task => 
    task.status !== 'COMPLETED' && 
    task.dueDate && 
    new Date(task.dueDate) < new Date()
  );

  const stats = [
    { 
      label: 'Completed', 
      value: completedTasks.length, 
      icon: CheckCircle, 
      color: 'text-green-500' 
    },
    { 
      label: 'Pending', 
      value: pendingTasks.length, 
      icon: Clock, 
      color: 'text-blue-500' 
    },
    { 
      label: 'Overdue', 
      value: overdueTasks.length, 
      icon: AlertCircle, 
      color: 'text-red-500' 
    },
  ];

  const userId = localStorage.getItem('userId');

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-strong rounded-xl p-4">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
              </div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
              <div className="flex justify-between">
                <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="glass-strong rounded-2xl p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first task to get started with TaskFlow
          </p>
          <div className="text-sm text-gray-500">
            Click the + button to add a new task
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-xl p-4 text-center"
          >
            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Task List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};