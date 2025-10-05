import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<{ tokens: { access: string; refresh: string }; user: any }, { email: string; password: string; twoFACode?: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      async onQueryStarted(_, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        localStorage.setItem('accessToken', data.tokens.access);
        localStorage.setItem('refreshToken', data.tokens.refresh);
      },
    }),
    register: builder.mutation<any, any>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),

    // Users
    me: builder.query<any, void>({ query: () => '/users/me' }),
    updateMe: builder.mutation<any, any>({ query: (body) => ({ url: '/users/me', method: 'PUT', body }) }),

    // Search
    searchTutors: builder.query<any[], { subject?: string; name?: string; city?: string; minRate?: number; maxRate?: number }>({
      query: (params) => ({ url: '/search/tutors', params }),
    }),

    // Gigs
    listGigs: builder.query<any[], void>({ query: () => '/gigs' }),
    createGig: builder.mutation<any, any>({ query: (body) => ({ url: '/gigs', method: 'POST', body }) }),
    createOffer: builder.mutation<any, any>({ query: (body) => ({ url: '/offers', method: 'POST', body }) }),
    acceptOffer: builder.mutation<any, { offerId: string }>({
      query: ({ offerId }) => ({ url: `/offers/${offerId}/accept`, method: 'POST' }),
    }),

    // Bookings
    myBookings: builder.query<any[], void>({ query: () => '/bookings/me' }),
    createBooking: builder.mutation<any, any>({ query: (body) => ({ url: '/bookings', method: 'POST', body }) }),
    updateBookingStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/bookings/${id}/status`, method: 'PATCH', body: { status } }),
    }),

    // Payments
    createPaymentIntent: builder.mutation<{ clientSecret: string }, { amount: number; currency?: string; bookingId: string }>({
      query: (body) => ({ url: '/payments/intent', method: 'POST', body }),
    }),

    // Admin
    adminUsers: builder.query<any[], void>({ query: () => '/admin/users' }),
    adminApprove: builder.mutation<any, { id: string }>({ query: ({ id }) => ({ url: `/admin/users/${id}/approve`, method: 'POST' }) }),
    adminBlock: builder.mutation<any, { id: string }>({ query: ({ id }) => ({ url: `/admin/users/${id}/block`, method: 'POST' }) }),
    adminAnalytics: builder.query<any, void>({ query: () => '/admin/analytics' }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useUpdateMeMutation,
  useSearchTutorsQuery,
  useListGigsQuery,
  useCreateGigMutation,
  useCreateOfferMutation,
  useAcceptOfferMutation,
  useMyBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useCreatePaymentIntentMutation,
  useAdminUsersQuery,
  useAdminApproveMutation,
  useAdminBlockMutation,
  useAdminAnalyticsQuery,
} = api;
