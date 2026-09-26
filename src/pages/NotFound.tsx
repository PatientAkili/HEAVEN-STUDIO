import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function NotFound() {
  return (
    <div style={styles.page}>
      <Navbar />
      <section style={styles.content}>
        <p style={styles.code}>404</p>
        <h1 style={styles.title}>Page introuvable</h1>
        <p style={styles.text}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="nav-pill" style={styles.button}>
          Retour à l'accueil
        </Link>
      </section>
      <Footer />
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 55%, #2E1065 100%)',
    color: '#FFFFFF',
    fontFamily: 'Inter, sans-serif',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem 1.5rem',
  },
  code: {
    fontSize: 'clamp(3rem, 10vw, 5rem)',
    fontWeight: 800,
    margin: 0,
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  title: {
    fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
    fontWeight: 700,
    margin: '0.5rem 0 1rem 0',
  },
  text: {
    color: '#94A3B8',
    fontSize: '0.95rem',
    margin: '0 0 2rem 0',
    maxWidth: '400px',
  },
  button: {
    padding: '0.75rem 1.75rem',
    borderRadius: '10px',
  },
}

export default NotFound
