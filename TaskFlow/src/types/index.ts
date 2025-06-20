export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
}

export interface AppState {
  tasks: Task[];
  currentView: 'landing' | 'app';
  theme: Theme;
  isLoading: boolean;
}