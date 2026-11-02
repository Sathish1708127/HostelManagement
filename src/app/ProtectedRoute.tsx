import type { ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, type AppRole } from './providers';

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: AppRole[];
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return <div className="page-loader" role="status">Preparing your workspace...</div>;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return (
      <main className="page-content">
        <section className="panel">
          <h1>Access not available</h1>
          <p className="muted">This workspace is not available for your account role.</p>
          <button className="quiet-button" onClick={() => navigate('/dashboard')}>Return to overview</button>
        </section>
      </main>
    );
  }
  return <>{children}</>;
}
