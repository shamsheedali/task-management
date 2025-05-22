import { Schema, model, Document } from 'mongoose';

export interface IInvite {
  code: string;
  email: string;
  expiresAt: Date;
}

export interface ITeam extends Document {
  _id: string;
  name: string;
  creatorId: string;
  members: string[];
  inviteCodes: IInvite[];
  createdAt: Date;
  updatedAt: Date;
}

const inviteSchema = new Schema<IInvite>(
  {
    code: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true },
    expiresAt: { type: Date, required: true },
  },
  { _id: false }
);

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    creatorId: { type: String, required: true },
    members: [{ type: String, required: true }],
    inviteCodes: [inviteSchema],
  },
  { timestamps: true }
);

// Ensure team names are unique per creator
teamSchema.index({ creatorId: 1, name: 1 }, { unique: true });

export const Team = model<ITeam>('Team', teamSchema);
