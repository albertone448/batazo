import { useState } from 'react';
import { apiFetch, ApiError } from './api/client';

type Ping = {
  id: number;
  message: string;
  createdAt: string;
};

function App() {
  const [message, setMessage] = useState('');
  const [ping, setPing] = useState<Ping | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function createPing() {
    setIsSending(true);
    setError(null);

    try {
      const created = await apiFetch<Ping>('/api/pings', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      setPing(created);
      setMessage('');
    } catch (error) {
      if (error instanceof ApiError) {
        const firstFieldError = Object.values(
          error.problem?.errors ?? {},
        ).flat()[0];
        setError(firstFieldError ?? `El servidor respondió ${error.status}.`);
      } else {
        setError('No se pudo conectar con el servidor.');
      }
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main>
      <h1>Batazo</h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void createPing();
        }}
      >
        <label htmlFor="message">Mensaje</label>
        <input
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={200}
          required
        />
        <button type="submit" disabled={isSending}>
          {isSending ? 'Enviando...' : 'Enviar ping'}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {ping && (
        <p>
          Ping #{ping.id}: "{ping.message}", creado el{' '}
          {new Date(ping.createdAt).toLocaleString()}
        </p>
      )}
    </main>
  );
}

export default App;
