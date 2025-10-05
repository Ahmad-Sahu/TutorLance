import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IGig extends Document {
  student: Types.ObjectId; // User
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  status: 'open' | 'negotiation' | 'accepted' | 'completed' | 'cancelled';
}

const GigSchema = new Schema<IGig>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['open', 'negotiation', 'accepted', 'completed', 'cancelled'], default: 'open' },
  },
  { timestamps: true }
);

export const Gig: Model<IGig> = mongoose.models.Gig || mongoose.model<IGig>('Gig', GigSchema);
