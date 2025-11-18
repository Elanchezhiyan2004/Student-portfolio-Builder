import { useAuth } from '../contexts/AuthContext';
import { Navigate } from './Navigate';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'student' | 'recruiter';
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" />;
  }

  if (requireRole && profile.role !== requireRole) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}
