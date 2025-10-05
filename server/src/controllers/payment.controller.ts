import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Booking } from '../models/Booking';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount, currency = 'usd', bookingId } = req.body as { amount: number; currency?: string; bookingId: string };
  const paymentIntent = await stripe.paymentIntents.create({ amount, currency, metadata: { bookingId } });
  await Booking.findByIdAndUpdate(bookingId, { paymentIntentId: paymentIntent.id });
  res.json({ clientSecret: paymentIntent.client_secret });
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;
  try {
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const bookingId = paymentIntent.metadata?.bookingId;
    if (bookingId) await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });
  }

  res.json({ received: true });
};
