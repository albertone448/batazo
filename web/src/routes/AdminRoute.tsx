import { Navigate, Outlet } from 'react-router';
import { useIsGlobalAdmin } from '../auth/useIsGlobalAdmin';

export function AdminRoute() {
  const isGlobalAdmin = useIsGlobalAdmin();

  if (!isGlobalAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
