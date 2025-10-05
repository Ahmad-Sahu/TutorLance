import { Link, Route, Routes } from 'react-router-dom';
import { useAdminAnalyticsQuery, useAdminUsersQuery } from '../features/api';

function Overview() {
  const { data } = useAdminAnalyticsQuery();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded border p-4">Users: {data?.totalUsers ?? 0}</div>
      <div className="rounded border p-4">Bookings: {data?.totalBookings ?? 0}</div>
      <div className="rounded border p-4">Active Gigs: {data?.activeGigs ?? 0}</div>
    </div>
  );
}

function Users() {
  const { data } = useAdminUsersQuery();
  return (
    <div className="space-y-2">
      {data?.map((u: any) => (
        <div key={u._id} className="rounded border p-3 flex justify-between">
          <div>
            <div className="font-semibold">{u.name}</div>
            <div className="text-sm text-gray-600">{u.email} • {u.role}</div>
          </div>
          <div className="text-sm">{u.isApproved ? 'Approved' : 'Pending'}</div>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboard() {
  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto flex gap-6 p-4">
          <Link to="/admin">Overview</Link>
          <Link to="/admin/users">Users</Link>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </main>
    </div>
  );
}
