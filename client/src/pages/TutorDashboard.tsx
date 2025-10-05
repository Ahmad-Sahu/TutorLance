import { Link, Route, Routes } from 'react-router-dom';

export function TutorDashboard() {
  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto flex gap-6 p-4">
          <Link to="/tutor">Home</Link>
          <Link to="/tutor/classes">Classes</Link>
          <Link to="/tutor/gigs">Gigs</Link>
          <Link to="/tutor/profile">Profile</Link>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route index element={<div>Welcome Tutor</div>} />
          <Route path="classes" element={<div>Classes</div>} />
          <Route path="gigs" element={<div>Gigs</div>} />
          <Route path="profile" element={<div>Profile</div>} />
        </Routes>
      </main>
    </div>
  );
}
