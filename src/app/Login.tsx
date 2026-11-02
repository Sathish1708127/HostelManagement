import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './providers';

type LocationState = { from?: string };

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('warden@haven.test');
  const [password, setPassword] = useState('demo-password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error.message);
        return;
      }
      const destination = (location.state as LocationState | null)?.from ?? '/dashboard';
      navigate(destination, { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  }

  function fillDemoCredentials(role: 'warden' | 'student') {
    setEmail(role === 'student' ? 'student@haven.test' : 'warden@haven.test');
    setPassword('demo-password');
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <div className="brand"><span>HP</span>Hostel Pulse</div>
        <div>
          <p className="eyebrow">One calm operating system</p>
          <h1>Hostel life, without the scattered paperwork.</h1>
          <p>Rooms, residents, service requests, meals and safety signals stay connected in one accountable workspace.</p>
        </div>
        <div className="auth-proof">
          <strong>84</strong>
          <span>Hostel Pulse today<br />Healthy operations</span>
        </div>
      </section>
      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p className="muted">Use your registered hostel account to continue.</p>
          <label>Email address
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </label>
          <label>Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" minLength={6} required />
          </label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <div className="demo-login">
            <span>Local demo</span>
            <button type="button" onClick={() => fillDemoCredentials('warden')}>Warden</button>
            <button type="button" onClick={() => fillDemoCredentials('student')}>Student</button>
          </div>
        </form>
      </section>
    </main>
  );
}
