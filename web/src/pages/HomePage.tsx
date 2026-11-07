import { EmptyState } from '../components/EmptyState';

export function HomePage() {
  return (
    <>
      <h1>Mis quinielas</h1>
      <EmptyState
        title="Todavía no estás en ninguna quiniela"
        description="Cuando crees una o te unas con un código de invitación, va a aparecer aquí."
      />
    </>
  );
}
