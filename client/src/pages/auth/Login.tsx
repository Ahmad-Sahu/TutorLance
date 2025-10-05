import { useState } from 'react';
import { useLoginMutation } from '../../features/api';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFA, setTwoFA] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = (await login({ email, password, twoFACode: twoFA })) as any;
      const role = data?.user?.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'tutor' || role === 'freelancer') navigate('/tutor');
      else navigate('/student');
    } catch {}
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign in to TutorLance</h1>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="input" placeholder="2FA (admins only)" value={twoFA} onChange={(e) => setTwoFA(e.target.value)} />
        <button className="btn" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
        {error && <p className="text-red-600 text-sm">Login failed</p>}
      </form>
    </div>
  );
}
