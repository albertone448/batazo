type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Cargando…' }: LoadingStateProps) {
  return (
    <div role="status">
      <p>{label}</p>
    </div>
  );
}
