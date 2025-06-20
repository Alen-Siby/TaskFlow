import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFormData } from '../types';

const STORAGE_KEY = 'taskflow-tasks';

const generateId = () => crypto.randomUUID();

const createTask = (data: TaskFormData): Task => ({
  ...data,
  id: generateId(),
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save tasks to localStorage
  const saveTasks = useCallback((newTasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }, []);

  const addTask = useCallback((data: TaskFormData) => {
    const newTask = createTask(data);
    setTasks(prev => {
      const updated = [...prev, newTask];
      saveTasks(updated);
      return updated;
    });
    return newTask;
  }, [saveTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );
      saveTasks(updated);
      return updated;
    });
  }, [saveTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.filter(task => task.id !== id);
      saveTasks(updated);
      return updated;
    });
  }, [saveTasks]);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.map(task =>
        task.id === id
          ? { 
              ...task, 
              completed: !task.completed,
              updatedAt: new Date().toISOString()
            }
          : task
      );
      saveTasks(updated);
      return updated;
    });
  }, [saveTasks]);

  const reorderTasks = useCallback((startIndex: number, endIndex: number) => {
    setTasks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      saveTasks(result);
      return result;
    });
  }, [saveTasks]);

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTasks,
  };
};