import { Request, Response } from 'express';
import { User } from '../models/User';

export const getMe = async (req: Request & { user?: { userId: string } }, res: Response) => {
  const user = await User.findById(req.user?.userId);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
};

export const updateProfile = async (req: Request & { user?: { userId: string } }, res: Response) => {
  const updates = req.body;
  delete updates.role;
  delete updates.email;
  const user = await User.findByIdAndUpdate(req.user?.userId, updates, { new: true });
  res.json(user);
};

export const searchTutors = async (req: Request, res: Response) => {
  const { subject, name, city, minRate, maxRate } = req.query as Record<string, string>;
  const query: any = { $or: [{ role: 'tutor' }, { role: 'freelancer' }], isApproved: true };
  if (subject) query.skills = { $regex: subject, $options: 'i' };
  if (name) query.name = { $regex: name, $options: 'i' };
  if (city) query.city = { $regex: city, $options: 'i' };
  if (minRate || maxRate) query.hourlyRate = { $gte: Number(minRate) || 0, $lte: Number(maxRate) || 100000 };
  const tutors = await User.find(query).select('-password -twoFASecret');
  res.json(tutors);
};
