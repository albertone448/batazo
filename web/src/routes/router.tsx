import { createBrowserRouter } from 'react-router';
import App from '../App';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [{ path: '/', element: <HomePage /> }],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/pings', element: <App /> },
  { path: '*', element: <NotFoundPage /> },
]);
