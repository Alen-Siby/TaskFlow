import { useState, useCallback } from 'react';
import { Task } from '../types';

export const useTasks = () => {
  const [tasks, setInternalTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const setTasks = useCallback((newTasks: Task[]) => {
    setInternalTasks(newTasks);
    setIsLoading(false);
  }, []);

  const addTask = useCallback((data: Task) => {
    setInternalTasks(prev => [...prev, data]);
    return data;
  }, []);

  const updateTask = useCallback((id: string, updatedTask: Task) => {
    setInternalTasks(prev => prev.map(task => (task.id === id ? updatedTask : task)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setInternalTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const reorderTasks = useCallback((startIndex: number, endIndex: number) => {
    setInternalTasks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    setTasks,
  };
};