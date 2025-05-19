export interface User {
  id: string;
  username: string;
  email: string;
}
export interface ITaskList {
  id: string;
  title: string;
  userId: string;
  tasks?: ITask[];
}

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "done";
  isStarred: boolean;
  dueDate?: Date;
  taskListId: string;
  userId: string;
  parentTaskId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}
