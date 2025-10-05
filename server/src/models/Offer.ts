import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IOffer extends Document {
  gig: Types.ObjectId; // Gig
  freelancer: Types.ObjectId; // User
  price: number;
  timelineDays: number;
  status: 'pending' | 'accepted' | 'declined';
}

const OfferSchema = new Schema<IOffer>(
  {
    gig: { type: Schema.Types.ObjectId, ref: 'Gig', required: true, index: true },
    freelancer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    price: { type: Number, required: true },
    timelineDays: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  },
  { timestamps: true }
);

export const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);
