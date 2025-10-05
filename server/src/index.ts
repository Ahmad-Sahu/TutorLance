import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { StatusCodes } from 'http-status-codes';
import apiRouter from './routes';
import { registerSocketHandlers } from './routes/socket';

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || '';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const app: Application = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true,
  },
});

// Basic Socket.IO hookup (namespaced later)
io.on('connection', (socket) => {
  socket.on('disconnect', () => {});
});
registerSocketHandlers(io);

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
// JSON parser with Stripe webhook raw body support
app.use(
  express.json({
    limit: '1mb',
    verify: (req: any, _res, buf) => {
      if (req.originalUrl?.startsWith('/api/payments/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);
app.use(cookieParser());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', limiter);

// Health
app.get('/health', (_req, res) => {
  res.status(StatusCodes.OK).json({ ok: true, service: 'TutorLance API' });
});

// API routes
app.use('/api', apiRouter);

async function start() {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI missing');
    await mongoose.connect(MONGO_URI);
    server.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

export { io };