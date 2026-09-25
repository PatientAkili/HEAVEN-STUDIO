import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import Footer from '../components/Footer'

const offres = [
  {
    nom: 'Essentiel',
    prix: '150 $',
    description: 'Idéal pour un portrait individuel ou une petite séance.',
    inclus: ['1h de séance', '15 photos retouchées', 'Livraison sous 5 jours', 'Accès galerie en ligne'],
  },
  {
    nom: 'Signature',
    prix: '350 $',
    description: "Pour un événement ou une séance approfondie.",
    inclus: ['3h de séance', '50 photos retouchées', 'Livraison sous 3 jours', 'Accès galerie en ligne', '1 courte vidéo highlights'],
    populaire: true,
  },
  {
    nom: 'Royal',
    prix: 'Sur devis',
    description: 'Mariages, événements complets, projets sur mesure.',
    inclus: ['Journée complète', 'Toutes les photos retouchées', 'Livraison prioritaire', 'Accès galerie en ligne', 'Vidéo complète'],
  },
]

function Tarifs() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="tarifs-page" style={styles.page}>
      <style>{`
        .tarifs-page {
          height: 100vh;
          overflow: hidden;
        }
        @media (max-height: 700px) {
          .tarifs-page {
            height: auto;
            min-height: 100vh;
            overflow-y: auto;
          }
        }
      `}</style>

      <Navbar active="tarifs" />

      <section style={styles.header}>
        <h1 style={styles.title}>Nos Tarifs</h1>
        <p style={styles.subtitle}>Des formules adaptées à chaque besoin</p>
      </section>

      <div style={styles.grid}>
        {offres.map((offre, index) => {
          const isHovered = hoveredIndex === index
          const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index

          return (
            <div
              key={offre.nom}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                ...styles.card,
                ...(offre.populaire ? styles.cardPopulaire : {}),
                transform: isHovered ? 'scale(1.06) translateY(-6px)' : 'scale(1)',
                filter: isOtherHovered ? 'blur(3px) brightness(0.6)' : 'none',
                zIndex: isHovered ? 10 : 1,
                opacity: isOtherHovered ? 0.7 : 1,
              }}
            >
              {offre.populaire && <span style={styles.badge}>Le plus choisi</span>}
              <h2 style={styles.cardTitle}>{offre.nom}</h2>
              <p style={styles.cardPrix}>{offre.prix}</p>
              <p style={styles.cardDesc}>{offre.description}</p>
              <ul style={styles.list}>
                {offre.inclus.map((item) => (
                  <li key={item} style={styles.listItem}>✓ {item}</li>
                ))}
              </ul>
              <Link to="/contact" style={styles.cardButton}>Réserver</Link>
            </div>
          )
        })}
      </div>

      <Footer />
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 55%, #2E1065 100%)',
    color: '#FFFFFF',
    fontFamily: 'Inter, sans-serif',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
    flexShrink: 0,
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
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#94A3B8',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  navButton: {
    padding: '0.45rem 1.1rem',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  header: {
    textAlign: 'center',
    padding: '0.5rem 1.5rem 2rem',
    flexShrink: 0,
  },
  title: {
    fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
    fontWeight: 800,
    margin: '0 0 0.4rem 0',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: '0.9rem',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
    padding: '0 1.5rem 1.5rem',
    maxWidth: '1000px',
    margin: '0 auto',
    flex: 1,
    minHeight: 0,
    alignContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '16px',
    padding: '1.4rem 1.3rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform 0.35s ease, filter 0.35s ease, opacity 0.35s ease',
    cursor: 'pointer',
  },
  cardPopulaire: {
    border: '1px solid rgba(147, 51, 234, 0.6)',
    boxShadow: '0 0 40px rgba(147, 51, 234, 0.25)',
  },
  badge: {
    position: 'absolute',
    top: '-11px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    padding: '0.2rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.7rem',
    fontWeight: 700,
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    margin: '0.4rem 0 0.2rem 0',
    textAlign: 'center',
  },
  cardPrix: {
    fontSize: '1.7rem',
    fontWeight: 800,
    textAlign: 'center',
    margin: '0 0 0.5rem 0',
  },
  cardDesc: {
    color: '#94A3B8',
    fontSize: '0.85rem',
    textAlign: 'center',
    margin: '0 0 1rem 0',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 1rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    flexGrow: 1,
  },
  listItem: {
    fontSize: '0.85rem',
    color: '#E2E8F0',
  },
  cardButton: {
    textAlign: 'center',
    padding: '0.6rem',
    borderRadius: '10px',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
}

export default Tarifs