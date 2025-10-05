import { Navigate, Route, Routes } from 'react-router-dom';
import { StudentDashboard } from './StudentDashboard';
import { TutorDashboard } from './TutorDashboard';
import { AdminDashboard } from './AdminDashboard';
import { Login } from './auth/Login';
import { Register } from './auth/Register';

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/student" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student/*" element={<StudentDashboard />} />
        <Route path="/tutor/*" element={<TutorDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}
