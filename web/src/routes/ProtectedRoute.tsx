import { Navigate, Outlet } from 'react-router';
import { useSessionStatus } from '../auth/useSessionStatus';

export function ProtectedRoute() {
  const status = useSessionStatus();

  if (status === 'checking') {
    return null;
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
