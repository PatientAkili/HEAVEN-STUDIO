import { Link } from 'react-router-dom'

interface NavbarProps {
  active?: 'accueil' | 'portfolio' | 'tarifs' | 'contact'
  mode?: 'public' | 'client'
  onLogout?: () => void
  homeTo?: string
  label?: string
}

function Navbar({ active, mode = 'public', onLogout, homeTo, label }: NavbarProps) {
  const isActive = (key: string) => active === key

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
      `}</style>

      <Link to={homeTo ?? (mode === 'client' ? '/galerie' : '/')} style={styles.logo}>
        {label ?? 'HEAVEN ROYAL STUDIO PROD'}
      </Link>

      {mode === 'client' ? (
        <button onClick={onLogout} className="nav-pill" style={styles.pillButton}>
          Déconnexion
        </button>
      ) : (
        <div style={styles.navLinks}>
          <Link
            to="/portfolio"
            className="nav-pill"
            style={{ ...styles.pill, ...(isActive('portfolio') ? styles.pillActive : {}) }}
          >
            Portfolio
          </Link>
          <Link
            to="/tarifs"
            className="nav-pill"
            style={{ ...styles.pill, ...(isActive('tarifs') ? styles.pillActive : {}) }}
          >
            Tarifs
          </Link>
          <Link
            to="/contact"
            className="nav-pill"
            style={{ ...styles.pill, ...(isActive('contact') ? styles.pillActive : {}) }}
          >
            Contact
          </Link>
          <Link to="/connexion" className="nav-pill" style={styles.pill}>
            Espace Client
          </Link>
        </div>
      )}
    </nav>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    height: '64px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
    flexShrink: 0,
    backgroundColor: '#000000',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  logo: {
    fontWeight: 800,
    fontSize: '1.15rem',
    letterSpacing: '0.03em',
    color: '#FFFFFF',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
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
}

export default Navbar
