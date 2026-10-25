import { createBrowserRouter } from 'react-router';
import App from '../App';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RouteErrorPage } from './RouteErrorPage';

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [{ path: '/', element: <HomePage /> }],
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/pings', element: <App /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
