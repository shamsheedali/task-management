import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  teamIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    teamIds: [{ type: String, default: [] }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
