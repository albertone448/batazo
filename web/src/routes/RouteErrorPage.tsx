import { Link, useRouteError } from 'react-router';
import { ErrorState } from '../components/ErrorState';

export function RouteErrorPage() {
  const error = useRouteError();

  return (
    <main>
      <ErrorState error={error} />
      <Link to="/">Volver al inicio</Link>
    </main>
  );
}
