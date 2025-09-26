// Task interface with all required properties
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  isCompleted: boolean;
  dueDate?: number;
  createdAt: number;
}

export type Priority = 'high' | 'medium' | 'low';

export type TaskFormData = {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
};