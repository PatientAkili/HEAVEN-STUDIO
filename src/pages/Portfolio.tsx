import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState } from 'react'

const categories = ['Toutes', 'Studio', 'Portraits', 'Événementiel', 'Corporate', 'Mode & Beauté', 'Lifestyle']

function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Toutes')

  return (
    <div style={styles.page}>
      <Navbar active="portfolio" />

      <section style={styles.header}>
        <h1 style={styles.title}>Portfolio</h1>
        <p style={styles.subtitle}>Un aperçu de nos réalisations</p>
      </section>

      <div style={styles.filters}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              ...styles.filterButton,
              ...(activeCategory === cat ? styles.filterButtonActive : {}),
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={styles.gridItem}>
            <span style={styles.gridItemLabel}>Photo à venir</span>
          </div>
        ))}
      </div>
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
    paddingBottom: '4rem',
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
    color: '#FFFFFF',
    textDecoration: 'none',
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
  header: {
    textAlign: 'center',
    padding: '2rem 1.5rem 1rem',
  },
  title: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 800,
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    color: '#94A3B8',
    margin: 0,
  },
  filters: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.6rem',
    flexWrap: 'wrap',
    padding: '1.5rem',
  },
  filterButton: {
    padding: '0.5rem 1.1rem',
    borderRadius: '999px',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    backgroundColor: 'transparent',
    color: '#94A3B8',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  filterButtonActive: {
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    border: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1rem',
    padding: '0 1.5rem 3rem',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  gridItem: {
    aspectRatio: '4 / 5',
    borderRadius: '12px',
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridItemLabel: {
    color: '#64748B',
    fontSize: '0.85rem',
  },
}

export default Portfolio
