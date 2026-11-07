import { createBrowserRouter } from 'react-router';
import { AppLayout } from '../layouts/AppLayout';
import { AdminPage } from '../pages/AdminPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AdminRoute } from './AdminRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { RouteErrorPage } from './RouteErrorPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          {
            element: <ProtectedRoute />,
            children: [
              { path: '/', element: <HomePage /> },
              { path: '/perfil', element: <ProfilePage /> },
              {
                element: <AdminRoute />,
                children: [{ path: '/administracion', element: <AdminPage /> }],
              },
            ],
          },
          { path: '/login', element: <LoginPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
