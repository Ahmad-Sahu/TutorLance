# TutorLance (MERN)

TutorLance is an online tutor and freelancer hiring platform with Student, Tutor/Freelancer, and Admin panels.

## Tech
- Client: React + Vite + TypeScript + Tailwind + Redux Toolkit (RTK Query)
- Server: Node + Express + TypeScript + MongoDB (Mongoose) + JWT + Socket.IO + Stripe

## Getting Started

1. Clone and install
```bash
npm install -D concurrently cross-env
npm --prefix server install
npm --prefix client install
```

2. Configure environment
- Copy `server/.env.example` to `server/.env` and fill values:
  - `MONGO_URI` (MongoDB Atlas)
  - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
  - `CLIENT_ORIGIN=http://localhost:5173`
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

3. Run locally
```bash
npm run dev
```
- API at `http://localhost:4000`
- Client at `http://localhost:5173`

## Deployment
- Client: Vercel or Netlify (build: `npm --prefix client run build`)
- Server: Render/Railway (build: `npm --prefix server run build`, start: `npm --prefix server run start`)
- DB: MongoDB Atlas
- Set env vars same as local

## Basic API Routes
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`
- Users: `GET/PUT /api/users/me`, `GET /api/search/tutors`
- Gigs: `POST /api/gigs`, `GET /api/gigs`, `POST /api/offers`, `POST /api/offers/:offerId/accept`
- Bookings: `POST /api/bookings`, `GET /api/bookings/me`, `PATCH /api/bookings/:id/status`
- Payments: `POST /api/payments/intent`, `POST /api/payments/webhook`
- Admin: `GET /api/admin/users`, `POST /api/admin/users/:id/approve`, `POST /api/admin/users/:id/block`, `GET /api/admin/analytics`

## Notes
- This scaffold implements core flows and wiring. Map components to your Figma design in `client/src/pages` and `client/src/components`.
- Add protected routes and role guards for production.
- For Stripe webhooks when running locally, use `stripe listen --forward-to localhost:4000/api/payments/webhook`.
