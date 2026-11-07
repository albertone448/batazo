import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link, NavLink } from 'react-router';
import logoUrl from '../assets/brand/batazo-logo-horizontal-inverse.svg';
import symbolUrl from '../assets/brand/batazo-symbol-inverse.svg';
import styles from './Header.module.css';

type HeaderProps = {
  isAuthenticated: boolean;
  isGlobalAdmin: boolean;
  onLogout: () => void;
};

export function Header({
  isAuthenticated,
  isGlobalAdmin,
  onLogout,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navId = useId();

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleNavKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && menuOpen) {
      closeMenu();
      menuButtonRef.current?.focus();
    }
  }

  function handleLogout() {
    closeMenu();
    onLogout();
  }

  const navClasses = [styles.nav, menuOpen && styles.navOpen]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link to="/" className={styles.brand} aria-label="Batazo, inicio">
          <picture>
            <source media="(max-width: 479px)" srcSet={symbolUrl} />
            <img src={logoUrl} alt="" className={styles.logo} />
          </picture>
        </Link>

        {isAuthenticated && (
          <>
            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuButton}
              aria-expanded={menuOpen}
              aria-controls={navId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              Menú
            </button>

            <nav
              id={navId}
              aria-label="Principal"
              className={navClasses}
              onKeyDown={handleNavKeyDown}
            >
              <ul className={styles.links}>
                <li>
                  <NavLink
                    to="/"
                    end
                    className={styles.link}
                    onClick={closeMenu}
                  >
                    Mis quinielas
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/perfil"
                    className={styles.link}
                    onClick={closeMenu}
                  >
                    Perfil
                  </NavLink>
                </li>
                {isGlobalAdmin && (
                  <li>
                    <NavLink
                      to="/administracion"
                      className={styles.link}
                      onClick={closeMenu}
                    >
                      Administración
                    </NavLink>
                  </li>
                )}
              </ul>
              <button
                type="button"
                className={styles.logout}
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
