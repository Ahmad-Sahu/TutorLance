import { Link, Route, Routes } from 'react-router-dom';
import { useMeQuery, useSearchTutorsQuery, useListGigsQuery } from '../features/api';

function Home() {
  const { data: me } = useMeQuery();
  const { data: tutors } = useSearchTutorsQuery({});
  const { data: gigs } = useListGigsQuery();
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Welcome {me?.name || 'Student'}</h2>
      <div>
        <h3 className="font-medium mb-2">Top Tutors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tutors?.map((t) => (
            <div key={t._id} className="rounded border p-4">
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-600">{t.skills?.join(', ')}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Open Gigs</h3>
        <div className="space-y-2">
          {gigs?.map((g) => (
            <div key={g._id} className="rounded border p-4">
              <div className="font-semibold">{g.title}</div>
              <div className="text-sm text-gray-600">Budget ${g.budget}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StudentDashboard() {
  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto flex gap-6 p-4">
          <Link to="/student">Home</Link>
          <Link to="/student/gigs">Gigs</Link>
          <Link to="/student/bookings">Bookings</Link>
          <Link to="/student/profile">Profile</Link>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route index element={<Home />} />
          <Route path="gigs" element={<div>Gigs</div>} />
          <Route path="bookings" element={<div>Bookings</div>} />
          <Route path="profile" element={<div>Profile</div>} />
        </Routes>
      </main>
    </div>
  );
}
