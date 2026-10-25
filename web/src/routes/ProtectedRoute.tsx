import { Navigate, Outlet } from 'react-router';
import { useSessionStatus } from '../auth/useSessionStatus';
import { LoadingState } from '../components/LoadingState';

export function ProtectedRoute() {
  const status = useSessionStatus();

  if (status === 'checking') {
    return <LoadingState label="Comprobando tu sesión…" />;
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
