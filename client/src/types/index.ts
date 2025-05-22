export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  teamIds?: string[]; // Track teams the user is a member of
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
  dueDate?: string; // Changed to string to match frontend usage
  taskListId: string;
  userId: string;
  parentTaskId?: string;
  teamId?: string; // Link to team for group tasks
  assigneeId?: string | null; // Assignee for team tasks, null for team-wide
  creatorId?: string; // Creator of the task
  createdAt?: string; // Changed to string to match ISO format
  updatedAt?: string; // Changed to string to match ISO format
}

export interface Invite {
  code: string; // Unique invite code
  email: string; // Email of invited user
  expiresAt: string; // ISO date string for invite expiry
}

export interface Team {
  id: string;
  name: string;
  creatorId: string; // ID of user who created the team
  members: string[]; // Array of user IDs
  inviteCodes: Invite[]; // Array of pending invites
}

export interface Notification {
  id: string;
  message: string; // Notification message (e.g., "Alice created task")
  teamId: string; // Team associated with the notification
  timestamp: string; // ISO date string
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}