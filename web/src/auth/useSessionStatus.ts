export type SessionStatus = 'checking' | 'authenticated' | 'anonymous';

// Provisional hasta F1-12: la API todavía no tiene sesión.
export function useSessionStatus(): SessionStatus {
  return 'anonymous';
}
