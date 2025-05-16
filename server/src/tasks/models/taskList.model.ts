import { Schema, model, Document } from 'mongoose';

export interface ITaskList extends Document {
  _id: string;
  title: string;
  userId: string;
}

const taskListSchema = new Schema<ITaskList>(
  {
    title: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const TaskList = model<ITaskList>('TaskList', taskListSchema);
