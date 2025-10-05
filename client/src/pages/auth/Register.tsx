import { useState } from 'react';
import { useRegisterMutation } from '../../features/api';
import { useNavigate } from 'react-router-dom';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'tutor' | 'freelancer' | 'admin'>('student');
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({ name, email, password, role });
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value as any)}>
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
          <option value="freelancer">Freelancer</option>
        </select>
        <button className="btn" disabled={isLoading}>{isLoading ? 'Creating...' : 'Register'}</button>
      </form>
    </div>
  );
}
