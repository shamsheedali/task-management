import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'done';
  isStarred: boolean;
  dueDate?: Date;
  taskListId: string;
  userId: string;
  parentTaskId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
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
    taskListId: { type: String, required: true },
    userId: { type: String, required: true },
    parentTaskId: { type: String },
  },
  { timestamps: true }
);

taskSchema.index({ taskListId: 1, userId: 1, title: 1 }, { unique: true });

export const Task = model<ITask>('Task', taskSchema);
