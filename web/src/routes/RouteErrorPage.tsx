import { Link, useRouteError } from 'react-router';
import { ErrorState } from '../components/ErrorState';

export function RouteErrorPage() {
  const error = useRouteError();

  return (
    <>
      <ErrorState error={error} />
      <p>
        <Link to="/">Volver al inicio</Link>
      </p>
    </>
  );
}
