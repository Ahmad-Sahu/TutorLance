import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import speakeasy from 'speakeasy';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as { name: string; email: string; password: string; role: string };
  if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role, isApproved: role === 'admin' ? true : role === 'student' ? true : false });
  const access = signAccessToken({ userId: user.id, role: user.role });
  const refresh = signRefreshToken({ userId: user.id, role: user.role });
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, tokens: { access, refresh } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password, twoFACode } = req.body as { email: string; password: string; twoFACode?: string };
  const user = await User.findOne({ email }).select('+password +twoFASecret');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  if (user.role === 'admin' && user.twoFASecret) {
    if (!twoFACode) return res.status(401).json({ message: '2FA required' });
    const verified = speakeasy.totp.verify({ secret: user.twoFASecret, encoding: 'base32', token: twoFACode });
    if (!verified) return res.status(401).json({ message: 'Invalid 2FA' });
  }

  const access = signAccessToken({ userId: user.id, role: user.role, twoFA: user.role === 'admin' });
  const refresh = signRefreshToken({ userId: user.id, role: user.role });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, tokens: { access, refresh } });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body as { token: string };
  if (!token) return res.status(400).json({ message: 'Missing token' });
  try {
    const payload = verifyRefreshToken(token);
    const access = signAccessToken({ userId: payload.userId, role: payload.role });
    res.json({ access });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const enableAdmin2FA = async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const user = await User.findById(userId);
  if (!user || user.role !== 'admin') return res.status(404).json({ message: 'Admin not found' });
  const secret = speakeasy.generateSecret({ name: process.env.TWO_FA_APP_NAME || 'TutorLance' });
  user.twoFASecret = secret.base32;
  await user.save();
  res.json({ otpauth_url: secret.otpauth_url, base32: secret.base32 });
};
