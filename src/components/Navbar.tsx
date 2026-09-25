import { useState } from 'react'
import { Link } from 'react-router-dom'

interface NavbarProps {
  active?: 'accueil' | 'portfolio' | 'tarifs' | 'contact'
  mode?: 'public' | 'client'
  onLogout?: () => void
  homeTo?: string
  label?: string
}

function Navbar({ active, mode = 'public', onLogout, homeTo, label }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isActive = (key: string) => active === key
  const close = () => setIsOpen(false)

  return (
    <nav style={styles.nav}>
      <style>{`
        .nav-pill {
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
        }
        .nav-pill:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 20px rgba(147, 51, 234, 0.45);
          filter: brightness(1.1);
        }
        .nav-pill:active {
          transform: translateY(0) scale(0.98);
        }

        .navbar-desktop-links {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .navbar-hamburger {
          display: none;
        }
        .navbar-mobile-menu {
          display: none;
        }

        @media (max-width: 720px) {
          .navbar-desktop-links {
            display: none;
          }
          .navbar-hamburger {
            display: flex;
          }
          .navbar-mobile-menu.open {
            display: flex;
          }
        }
      `}</style>

      <div style={styles.topRow}>
        <Link to={homeTo ?? (mode === 'client' ? '/galerie' : '/')} style={styles.logo} onClick={close}>
          {label ?? 'HEAVEN ROYAL STUDIO PROD'}
        </Link>

        {mode === 'client' ? (
          <button onClick={onLogout} className="nav-pill" style={styles.pillButton}>
            Déconnexion
          </button>
        ) : (
          <>
            <div className="navbar-desktop-links">
              <Link to="/portfolio" className="nav-pill" style={{ ...styles.pill, ...(isActive('portfolio') ? styles.pillActive : {}) }}>
                Portfolio
              </Link>
              <Link to="/tarifs" className="nav-pill" style={{ ...styles.pill, ...(isActive('tarifs') ? styles.pillActive : {}) }}>
                Tarifs
              </Link>
              <Link to="/contact" className="nav-pill" style={{ ...styles.pill, ...(isActive('contact') ? styles.pillActive : {}) }}>
                Contact
              </Link>
              <Link to="/connexion" className="nav-pill" style={styles.pill}>
                Espace Client
              </Link>
            </div>

            <button
              className="navbar-hamburger"
              onClick={() => setIsOpen(!isOpen)}
              style={styles.hamburgerButton}
              aria-label="Menu"
            >
              <span style={{ ...styles.bar, transform: isOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
              <span style={{ ...styles.bar, opacity: isOpen ? 0 : 1 }} />
              <span style={{ ...styles.bar, transform: isOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
            </button>
          </>
        )}
      </div>

      {mode !== 'client' && (
        <div className={`navbar-mobile-menu ${isOpen ? 'open' : ''}`} style={styles.mobileMenu}>
          <Link to="/portfolio" style={{ ...styles.mobileLink, ...(isActive('portfolio') ? styles.mobileLinkActive : {}) }} onClick={close}>
            Portfolio
          </Link>
          <Link to="/tarifs" style={{ ...styles.mobileLink, ...(isActive('tarifs') ? styles.mobileLinkActive : {}) }} onClick={close}>
            Tarifs
          </Link>
          <Link to="/contact" style={{ ...styles.mobileLink, ...(isActive('contact') ? styles.mobileLinkActive : {}) }} onClick={close}>
            Contact
          </Link>
          <Link to="/connexion" className="nav-pill" style={{ ...styles.pill, textAlign: 'center' }} onClick={close}>
            Espace Client
          </Link>
        </div>
      )}
    </nav>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    backgroundColor: '#000000',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    flexShrink: 0,
  },
  topRow: {
    height: '64px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1.5rem',
    gap: '1rem',
  },
  logo: {
    fontWeight: 800,
    fontSize: '1.1rem',
    letterSpacing: '0.03em',
    color: '#FFFFFF',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  pill: {
    padding: '0.45rem 1.1rem',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'inline-block',
  },
  pillActive: {
    boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.5) inset',
  },
  pillButton: {
    padding: '0.45rem 1.1rem',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  hamburgerButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    width: '36px',
    height: '36px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    flexShrink: 0,
  },
  bar: {
    width: '22px',
    height: '2px',
    backgroundColor: '#FFFFFF',
    transition: 'transform 0.25s ease, opacity 0.25s ease',
  },
  mobileMenu: {
    flexDirection: 'column',
    padding: '0.5rem 1.5rem 1.25rem',
    gap: '0.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  mobileLink: {
    color: '#94A3B8',
    textDecoration: 'none',
    fontSize: '0.95rem',
    padding: '0.6rem 0.25rem',
  },
  mobileLinkActive: {
    color: '#FFFFFF',
    fontWeight: 700,
  },
}

export default Navbar
