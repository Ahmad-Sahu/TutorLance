import { Request, Response } from 'express';
import { User } from '../models/User';
import { Gig } from '../models/Gig';
import { Booking } from '../models/Booking';

export const listUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select('-password -twoFASecret');
  res.json(users);
};

export const approveTutor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  res.json(user);
};

export const blockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { isApproved: false }, { new: true });
  res.json(user);
};

export const analytics = async (_req: Request, res: Response) => {
  const totalUsers = await User.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const activeGigs = await Gig.countDocuments({ status: { $in: ['open', 'negotiation', 'accepted'] } });
  res.json({ totalUsers, totalBookings, activeGigs });
};
