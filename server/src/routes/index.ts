import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as Auth from '../controllers/auth.controller';
import * as User from '../controllers/user.controller';
import * as Gig from '../controllers/gig.controller';
import * as Booking from '../controllers/booking.controller';
import * as Payment from '../controllers/payment.controller';
import * as Admin from '../controllers/admin.controller';
import * as Chat from '../controllers/chat.controller';

const router = Router();

// Auth
router.post('/auth/register', Auth.register);
router.post('/auth/login', Auth.login);
router.post('/auth/refresh', Auth.refreshToken);
router.post('/auth/admin/2fa/enable', authenticate, authorize(['admin']), Auth.enableAdmin2FA);

// Users
router.get('/users/me', authenticate, User.getMe);
router.put('/users/me', authenticate, User.updateProfile);
router.get('/search/tutors', User.searchTutors);

// Gigs & offers
router.post('/gigs', authenticate, authorize(['student']), Gig.createGig);
router.get('/gigs', Gig.listGigs);
router.post('/offers', authenticate, authorize(['tutor', 'freelancer']), Gig.createOffer);
router.post('/offers/:offerId/accept', authenticate, authorize(['student']), Gig.acceptOffer);

// Bookings
router.post('/bookings', authenticate, authorize(['student']), Booking.createBooking);
router.get('/bookings/me', authenticate, Booking.listMyBookings);
router.patch('/bookings/:id/status', authenticate, Booking.updateBookingStatus);

// Payments
router.post('/payments/intent', authenticate, Payment.createPaymentIntent);
router.post('/payments/webhook', Payment.handleWebhook);

// Admin
router.get('/admin/users', authenticate, authorize(['admin']), Admin.listUsers);
router.post('/admin/users/:id/approve', authenticate, authorize(['admin']), Admin.approveTutor);
router.post('/admin/users/:id/block', authenticate, authorize(['admin']), Admin.blockUser);
router.get('/admin/analytics', authenticate, authorize(['admin']), Admin.analytics);

// Chat
router.get('/chats', authenticate, Chat.listMyChats);
router.post('/chats', authenticate, Chat.startChat);
router.get('/chats/:chatId/messages', authenticate, Chat.getChatMessages);

export default router;
