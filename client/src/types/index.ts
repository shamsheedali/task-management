export interface ITaskList {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
}

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  taskListId: string;
  userId: string;
  parentTaskId?: string;
  createdAt: string;
  updatedAt: string;
  subtasks?: ITask[];
  starred?: boolean;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}