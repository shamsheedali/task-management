export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  teamIds?: string[];
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
  dueDate?: string;
  taskListId: string;
  userId: string;
  parentTaskId?: string;
  teamId?: string;
  assigneeId?: string | null;
  creatorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invite {
  code: string;
  email: string;
  expiresAt: string;
}

export interface Team {
  id: string;
  name: string;
  creatorId: string;
  members: string[];
  inviteCodes: Invite[];
}

export interface Notification {
  id: string;
  message: string;
  teamId: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}
