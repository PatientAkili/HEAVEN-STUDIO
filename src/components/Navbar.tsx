import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'

interface NavbarProps {
  active?: 'accueil' | 'portfolio' | 'tarifs' | 'contact'
  mode?: 'public' | 'client'
  onLogout?: () => void
  homeTo?: string
  label?: string
}

function PortfolioIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}
function TarifsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.17H4a1 1 0 0 0-1 1v5.59a2 2 0 0 0 .59 1.41l9.59 9.59a2 2 0 0 0 2.83 0l5-5a2 2 0 0 0 0-2.83Z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
function ContactIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  )
}
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  )
}

function Navbar({ active, mode = 'public', onLogout, homeTo, label }: NavbarProps) {
  const isActive = (key: string) => active === key

  const bottomNavItems = [
    { to: '/', key: 'portfolio', label: 'Portfolio', Icon: PortfolioIcon, color: '#60A5FA' },
    { to: '/tarifs', key: 'tarifs', label: 'Tarifs', Icon: TarifsIcon, color: '#FBBF24' },
    { to: '/contact', key: 'contact', label: 'Contact', Icon: ContactIcon, color: '#34D399' },
    { to: '/connexion', key: 'client', label: 'Espace', Icon: UserIcon, color: '#C084FC' },
  ]

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
        .bottom-glass-nav {
          display: none;
        }

        @media (max-width: 720px) {
          .navbar-desktop-links {
            display: none;
          }
          .bottom-glass-nav {
            display: flex;
          }
        }

        .bottom-glass-item {
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .bottom-glass-item:active {
          transform: scale(0.92);
        }
      `}</style>

      <div style={styles.topRow}>
        <Link to={homeTo ?? (mode === 'client' ? '/galerie' : '/')} style={styles.logo}>
          <img src="/logo.png" alt="" style={styles.logoImg} />
          <span style={styles.logoText}>{label ?? 'HEAVEN ROYAL STUDIO PROD'}</span>
        </Link>

        {mode === 'client' ? (
          <button onClick={onLogout} className="nav-pill" style={styles.pillButton}>
            Déconnexion
          </button>
        ) : (
          <div className="navbar-desktop-links">
            <Link to="/" className="nav-pill" style={{ ...styles.pill, ...(isActive('portfolio') ? styles.pillActive : {}) }}>
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
        )}
      </div>

      {mode !== 'client' &&
        createPortal(
          <div className="bottom-glass-nav" style={styles.bottomGlassNav}>
            {bottomNavItems.map(({ to, key, label: itemLabel, Icon, color }) => (
              <Link
                key={key}
                to={to}
                className="bottom-glass-item"
                style={{
                  ...styles.bottomGlassItem,
                  color: isActive(key) ? color : `${color}99`,
                  backgroundColor: isActive(key) ? `${color}22` : 'transparent',
                }}
              >
                <Icon />
                <span style={styles.bottomGlassLabel}>{itemLabel}</span>
                {isActive(key) && <span style={{ ...styles.bottomGlassDot, backgroundColor: color }} />}
              </Link>
            ))}
          </div>,
          document.body
        )}
    </nav>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(14, 116, 144, 0.18)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    borderBottom: '1px solid rgba(165, 243, 252, 0.15)',
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
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    minWidth: 0,
    color: '#FFFFFF',
    textDecoration: 'none',
  },
  logoImg: {
    height: '40px',
    width: 'auto',
    flexShrink: 0,
  },
  logoText: {
    fontWeight: 800,
    fontSize: '1.1rem',
    letterSpacing: '0.03em',
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
  bottomGlassNav: {
    position: 'fixed',
    bottom: '14px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 150,
    display: 'flex',
    gap: '0.4rem',
    padding: '0.6rem 0.9rem',
    borderRadius: '999px',
    backgroundColor: 'rgba(30, 27, 75, 0.55)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.15)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
  },
  bottomGlassItem: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.15rem',
    textDecoration: 'none',
    padding: '0.35rem 0.7rem',
    borderRadius: '14px',
  },
  bottomGlassLabel: {
    fontSize: '0.6rem',
    fontWeight: 600,
  },
  bottomGlassDot: {
    position: 'absolute',
    bottom: '-6px',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#C4B5FD',
  },
}

export default Navbar
