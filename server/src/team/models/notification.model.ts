import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  _id: string;
  message: string;
  teamId: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true, trim: true },
    teamId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

notificationSchema.index({ teamId: 1, timestamp: -1 });

export const Notification = model<INotification>(
  'Notification',
  notificationSchema
);
