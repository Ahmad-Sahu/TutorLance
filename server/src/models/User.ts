import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'student' | 'tutor' | 'freelancer' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  city?: string;
  contact?: string;
  skills?: string[]; // for tutor/freelancer
  subjects?: string[]; // for student interests
  hourlyRate?: number; // tutor/freelancer
  bio?: string;
  avatarUrl?: string;
  isApproved?: boolean; // admin approval for tutor/freelancer
  twoFASecret?: string; // for admin 2FA
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'tutor', 'freelancer', 'admin'], required: true },
    city: String,
    contact: String,
    skills: [String],
    subjects: [String],
    hourlyRate: Number,
    bio: String,
    avatarUrl: String,
    isApproved: { type: Boolean, default: false },
    twoFASecret: { type: String, select: false },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
