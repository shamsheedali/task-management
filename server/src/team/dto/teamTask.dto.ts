export interface TeamTaskDTO {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'done';
  isStarred: boolean;
  dueDate?: Date;
  teamId: string;
  assigneeId?: string;
  creatorId: string;
  createdAt: Date;
}

export const toTeamTaskDTO = (teamTask: {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'done';
  isStarred: boolean;
  dueDate?: Date;
  teamId: string;
  assigneeId?: string;
  creatorId: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}): TeamTaskDTO => ({
  id: teamTask._id,
  title: teamTask.title,
  description: teamTask.description,
  status: teamTask.status,
  isStarred: teamTask.isStarred,
  dueDate: teamTask.dueDate,
  teamId: teamTask.teamId,
  assigneeId: teamTask.assigneeId,
  creatorId: teamTask.creatorId,
  createdAt: teamTask.createdAt,
});
