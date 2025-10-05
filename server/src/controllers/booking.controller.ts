import { Request, Response } from 'express';
import { Booking } from '../models/Booking';

export const createBooking = async (req: Request & { user?: { userId: string } }, res: Response) => {
  const { tutorId, subject, startTime, endTime, rate } = req.body;
  const booking = await Booking.create({ student: req.user!.userId, tutor: tutorId, subject, startTime, endTime, rate });
  res.status(201).json(booking);
};

export const listMyBookings = async (req: Request & { user?: { userId: string } }, res: Response) => {
  const role = (req as any).user.role;
  const query = role === 'student' ? { student: req.user!.userId } : { tutor: req.user!.userId };
  const bookings = await Booking.find(query).sort({ startTime: -1 });
  res.json(bookings);
};

export const updateBookingStatus = async (req: Request & { user?: { userId: string } }, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: 'pending' | 'confirmed' | 'completed' | 'cancelled' };
  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
  res.json(booking);
};
