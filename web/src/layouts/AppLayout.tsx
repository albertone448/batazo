import { Outlet, useNavigate } from 'react-router';
import { useIsGlobalAdmin } from '../auth/useIsGlobalAdmin';
import { useSessionStatus } from '../auth/useSessionStatus';
import { Header } from '../components/Header';
import styles from './AppLayout.module.css';

const MAIN_ID = 'contenido';

export function AppLayout() {
  const sessionStatus = useSessionStatus();
  const isGlobalAdmin = useIsGlobalAdmin();
  const navigate = useNavigate();

  function handleLogout() {
    // Provisional hasta F1-10: todavía no hay sesión que cerrar en la API.
    navigate('/login');
  }

  return (
    <>
      <a href={`#${MAIN_ID}`} className={styles.skipLink}>
        Saltar al contenido
      </a>
      <Header
        isAuthenticated={sessionStatus === 'authenticated'}
        isGlobalAdmin={isGlobalAdmin}
        onLogout={handleLogout}
      />
      <main id={MAIN_ID} tabIndex={-1} className={styles.content}>
        <Outlet />
      </main>
    </>
  );
}
