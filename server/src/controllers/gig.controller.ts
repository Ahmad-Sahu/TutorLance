import { Request, Response } from 'express';
import { Gig } from '../models/Gig';
import { Offer } from '../models/Offer';

export const createGig = async (req: Request & { user?: { userId: string } }, res: Response) => {
  const { title, description, budget, deadline } = req.body;
  const gig = await Gig.create({ student: req.user!.userId, title, description, budget, deadline });
  res.status(201).json(gig);
};

export const listGigs = async (_req: Request, res: Response) => {
  const gigs = await Gig.find({ status: { $in: ['open', 'negotiation'] } }).populate('student', 'name');
  res.json(gigs);
};

export const createOffer = async (req: Request & { user?: { userId: string } }, res: Response) => {
  const { gigId, price, timelineDays } = req.body;
  const offer = await Offer.create({ gig: gigId, freelancer: req.user!.userId, price, timelineDays });
  res.status(201).json(offer);
};

export const acceptOffer = async (req: Request & { user?: { userId: string } }, res: Response) => {
  const { offerId } = req.params as { offerId: string };
  const offer = await Offer.findById(offerId).populate('gig');
  if (!offer) return res.status(404).json({ message: 'Offer not found' });
  // Only the gig owner can accept
  if ((offer.gig as any).student.toString() !== req.user!.userId) return res.status(403).json({ message: 'Forbidden' });
  offer.status = 'accepted';
  await offer.save();
  await Gig.findByIdAndUpdate(offer.gig, { status: 'accepted' });
  res.json(offer);
};
