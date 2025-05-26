export const SocketEvent = {
  TEAM_USER_JOINED: "team:user:joined",
  TASK_CREATED: "task:created",
  TASK_UPDATED: "task:updated",
  TASK_DELETED: "task:deleted",
} as const;

export type SocketEvent = (typeof SocketEvent)[keyof typeof SocketEvent];

export interface TeamUserJoinedPayload {
  teamId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

export interface TaskEventPayload {
  teamId: string;
  task: any; // Use your ITask type if possible
}
