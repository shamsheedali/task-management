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
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
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
