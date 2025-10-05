import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMessage extends Document {
  chat: Types.ObjectId; // Chat
  sender: Types.ObjectId; // User
  content: string;
  readBy: Types.ObjectId[];
}

const MessageSchema = new Schema<IMessage>(
  {
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
