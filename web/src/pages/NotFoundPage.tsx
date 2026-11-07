import { Link } from 'react-router';
import { EmptyState } from '../components/EmptyState';

export function NotFoundPage() {
  return (
    <>
      <h1>Página no encontrada</h1>
      <EmptyState
        title="No encontramos lo que buscas"
        description="Puede que el enlace esté mal o que la página ya no exista."
        action={<Link to="/">Volver al inicio</Link>}
      />
    </>
  );
}
