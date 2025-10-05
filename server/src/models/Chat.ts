import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IChat extends Document {
  users: Types.ObjectId[]; // two users for now
  lastMessageAt?: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessageAt: Date,
  },
  { timestamps: true }
);

export const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
