import { useState } from 'react';

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
      const response = await fetch('/api/pings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        setError(`El servidor respondió ${response.status}.`);
        return;
      }

      const created: Ping = await response.json();
      setPing(created);
      setMessage('');
    } catch {
      setError('No se pudo conectar con el servidor.');
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
