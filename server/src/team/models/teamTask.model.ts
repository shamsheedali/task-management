import { Schema, model, Document } from 'mongoose';

export interface ITeamTask extends Document {
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
  updatedAt: Date;
}

const teamTaskSchema = new Schema<ITeamTask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['todo', 'done'],
      default: 'todo',
    },
    isStarred: { type: Boolean, default: false },
    dueDate: { type: Date },
    teamId: { type: String, required: true },
    assigneeId: { type: String },
    creatorId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

// Tasks are unique per teamId and title for a user
teamTaskSchema.index({ teamId: 1, userId: 1, title: 1 }, { unique: true });

export const TeamTask = model<ITeamTask>('TeamTask', teamTaskSchema);
