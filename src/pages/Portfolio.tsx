import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const categories = ['Toutes', 'Studio', 'Événementiel', 'Design']

function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Toutes')

  return (
    <div style={styles.page}>
      <style>{`
        @media (max-width: 600px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 700px) {
          .intro-grid {
            grid-template-columns: 1fr !important;
          }
          .intro-photo {
            max-width: 280px !important;
            margin: 0 auto;
          }
        }
      `}</style>

      <Navbar active="portfolio" />

      <section className="intro-grid" style={styles.intro}>
        <div className="intro-photo" style={styles.introPhotoWrap}>
          <img src="/team/gloire-michel.jpg" alt="Gloire Michel" style={styles.introPhoto} />
        </div>

        <div style={styles.introText}>
          <h1 style={styles.introName}>HEAVEN ROYAL STUDIO PROD</h1>
          <p style={styles.introRole}>Photographie · Designer</p>

          <p style={styles.introParagraph}>
            BIENVENUE SUR LA PLATEFORME OFFICIELLE D'HEAVEN ROYAL STUDIO PROD.
          </p>

          <p style={styles.introHighlight}>
            La <strong>SIMPLICITÉ</strong> au service de <strong>L'EFFICACITÉ</strong>.
          </p>

          <p style={styles.introParagraph}>
            Basé à Bukavu, au cœur du Sud Kivu en RDC, HEAVEN ROYAL STUDIO PROD. est un
            studio d'excellence, spécialisé dans la production audiovisuelle et la
            photographie professionnelle. Nous transformons vos moments forts et vos
            visions artistiques en œuvres visuelles inoubliables. Nous accompagnons des
            artistes, particuliers et entreprises dans la création de contenus visuels de
            haute qualité.
          </p>

          <p style={styles.introEmphasis}>VOUS NE SEREZ JAMAIS DÉÇU PAR NOUS !!!</p>

          <p style={styles.introParagraph}>
            Contactez-nous ou écrivez-nous un email pour réserver votre séance ou
            concrétiser votre projet visuel.
          </p>
        </div>
      </section>

      <section style={styles.header}>
        <h2 style={styles.title}>Nos réalisations</h2>
        <p style={styles.subtitle}>Un aperçu de notre travail</p>
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

      <div className="portfolio-grid" style={styles.grid}>
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
  },
  intro: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '320px 1fr',
    gap: '2.5rem',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    alignItems: 'center',
  },
  introPhotoWrap: {
    width: '100%',
  },
  introPhoto: {
    width: '100%',
    borderRadius: '16px',
    objectFit: 'cover',
    boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
  },
  introText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  introName: {
    fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
    fontWeight: 800,
    margin: 0,
    letterSpacing: '0.02em',
  },
  introRole: {
    color: '#A78BFA',
    fontSize: '0.95rem',
    fontWeight: 600,
    margin: '0 0 0.75rem 0',
  },
  introParagraph: {
    color: '#CBD5E1',
    fontSize: '0.9rem',
    lineHeight: 1.7,
    margin: 0,
  },
  introHighlight: {
    fontSize: '1rem',
    color: '#FFFFFF',
    margin: '0.25rem 0',
  },
  introEmphasis: {
    color: '#FFFFFF',
    fontWeight: 800,
    fontSize: '1rem',
    margin: '0.5rem 0',
  },
  header: {
    textAlign: 'center',
    padding: '1rem 1.5rem 0.5rem',
  },
  title: {
    fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
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
    width: '100%',
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
