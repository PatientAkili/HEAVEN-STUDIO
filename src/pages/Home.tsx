import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Home() {
  return (
    <div style={styles.page}>
      <Navbar active="accueil" />

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Capturer vos moments,<br />révéler votre histoire
        </h1>
        <p style={styles.heroSubtitle}>
          Studio photo & vidéo professionnel — portraits, événements, mode et bien plus.
        </p>
        <div style={styles.heroButtons}>
          <Link to="/portfolio" style={styles.primaryButton}>Voir le portfolio</Link>
          <Link to="/contact" style={styles.secondaryButton}>Me contacter</Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 55%, #2E1065 100%)',
    color: '#FFFFFF',
    fontFamily: 'Inter, sans-serif',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logo: {
    fontWeight: 800,
    fontSize: '1.2rem',
    letterSpacing: '0.03em',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#94A3B8',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
  navButton: {
    padding: '0.5rem 1.1rem',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '5rem 1.5rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontWeight: 800,
    lineHeight: 1.2,
    margin: '0 0 1.5rem 0',
  },
  heroSubtitle: {
    color: '#94A3B8',
    fontSize: '1.1rem',
    maxWidth: '520px',
    margin: '0 0 2.5rem 0',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    padding: '0.85rem 1.75rem',
    borderRadius: '10px',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    textDecoration: 'none',
    fontWeight: 700,
  },
  secondaryButton: {
    padding: '0.85rem 1.75rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    color: '#FFFFFF',
    textDecoration: 'none',
    fontWeight: 600,
  },
}

export default Home
