import jwt from 'jsonwebtoken';

export type JwtPayload = { userId: string; role: string; twoFA?: boolean };

const accessSecret = process.env.JWT_ACCESS_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

export function signAccessToken(payload: JwtPayload, expiresIn = process.env.JWT_ACCESS_EXPIRES || '15m') {
  return jwt.sign(payload, accessSecret, { expiresIn });
}

export function signRefreshToken(payload: JwtPayload, expiresIn = process.env.JWT_REFRESH_EXPIRES || '7d') {
  return jwt.sign(payload, refreshSecret, { expiresIn });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, accessSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, refreshSecret) as JwtPayload;
}
