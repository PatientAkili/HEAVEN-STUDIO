import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackgroundDecor from '../components/BackgroundDecor'

const categories = ['Toutes', 'Studio', 'Événementiel', 'Design']

interface Work {
  src: string
  title: string
  category: string
}

// Pour ajouter une réalisation : copie l'image dans public/team/, puis ajoute une ligne ici.
const works: Work[] = Array.from({ length: 12 }, (_, i) => ({
  src: `/team/${i + 1}image1.png`,
  title: `Design ${i + 1}`,
  category: 'Design',
}))


const FULL_TITLE = "Capturer vos moments, révéler votre histoire"

function TypedHeroTitle() {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let i = 0
    let deleting = false
    let timeoutId: ReturnType<typeof setTimeout>

    const tick = () => {
      if (!deleting) {
        i++
        setDisplayed(FULL_TITLE.slice(0, i))
        if (i >= FULL_TITLE.length) {
          deleting = true
          timeoutId = setTimeout(tick, 2200)
          return
        }
        timeoutId = setTimeout(tick, 45)
      } else {
        i--
        setDisplayed(FULL_TITLE.slice(0, i))
        if (i <= 0) {
          deleting = false
          timeoutId = setTimeout(tick, 500)
          return
        }
        timeoutId = setTimeout(tick, 25)
      }
    }

    timeoutId = setTimeout(tick, 45)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <h1 className="hero-title" style={styles.heroTitle}>
      {displayed}
      <span style={styles.caret}>|</span>
    </h1>
  )
}

const stats = [
  { value: '+50', label: 'Séances réalisées' },
  { value: '+30', label: 'Clients satisfaits' },
  { value: '3', label: "Années d'expérience" },
]

const testimonials = [
  { quote: "Un travail d'une grande qualité, et une équipe très professionnelle du début à la fin.", name: 'Client — Séance Studio' },
  { quote: "Les photos ont dépassé mes attentes, vraiment un excellent accompagnement.", name: 'Client — Événementiel' },
  { quote: "Rapide, soigné, et à l'écoute de nos besoins pour notre projet.", name: 'Client — Design' },
]

function Home() {
  const [activeCategory, setActiveCategory] = useState('Toutes')
  const [selected, setSelected] = useState<Work | null>(null)
  const visibleWorks = works.filter((w) => activeCategory === 'Toutes' || w.category === activeCategory)

  return (
    <div style={styles.page}>
      <BackgroundDecor />
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
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        @media (max-width: 700px) {
          .intro-grid {
            grid-template-columns: 1fr !important;
          }
          .intro-photo {
            max-width: 160px !important;
            margin: 0 auto;
          }
          .hero-title {
            font-size: 1.7rem !important;
          }
        }

        .work-card {
          position: relative;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .work-card img {
          transition: transform 0.5s ease, filter 0.35s ease;
        }
        .work-card .work-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0));
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .work-card .work-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(0.7);
          transition: transform 0.35s ease;
        }
        .work-card:hover,
        .work-card:active {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(147, 51, 234, 0.35);
        }
        .work-card:hover img,
        .work-card:active img {
          transform: scale(1.08);
          filter: brightness(0.85);
        }
        .work-card:hover .work-overlay,
        .work-card:active .work-overlay {
          opacity: 1;
        }
        .work-card:hover .work-icon,
        .work-card:active .work-icon {
          transform: scale(1);
        }
      `}</style>

      <Navbar active="portfolio" />

      <section style={styles.hero}>
        <TypedHeroTitle />
        <p style={styles.heroSubtitle}>
          Studio photo & vidéo professionnel — portraits, événements, mode et bien plus.
        </p>
        <div style={styles.heroButtons}>
          <a href="#realisations" className="nav-pill" style={styles.primaryButton}>Voir le portfolio</a>
          <Link to="/contact" style={styles.secondaryButton}>Me contacter</Link>
        </div>
      </section>

      <section className="intro-grid" style={styles.intro}>
        <div className="intro-photo" style={styles.introPhotoWrap}>
          <img src="/team/gloire-michel.jpg" alt="Gloire Michel" style={styles.introPhoto} />
        </div>

        <div style={styles.introText}>
          <h2 style={styles.introName}>HEAVEN ROYAL STUDIO PROD</h2>
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

      <section id="realisations" style={styles.header}>
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
        {visibleWorks.length === 0 ? (
          <p style={styles.emptyText}>Aucune réalisation dans cette catégorie pour le moment.</p>
        ) : (
          visibleWorks.map((work) => (
            <button key={work.src} className="work-card" style={styles.workCard} onClick={() => setSelected(work)}>
              <img src={work.src} alt={work.title} style={styles.workImg} loading="lazy" />
              <span className="work-overlay">
                <span className="work-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" />
                  </svg>
                </span>
              </span>
            </button>
          ))
        )}
      </div>

      {selected && (
        <div style={styles.lightbox} onClick={() => setSelected(null)}>
          <button style={styles.lightboxClose} onClick={() => setSelected(null)} aria-label="Fermer">✕</button>
          <img
            src={selected.src}
            alt={selected.title}
            style={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <section style={styles.statsSection}>
        {stats.map((s) => (
          <div key={s.label} style={styles.statItem}>
            <p style={styles.statNumber}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </section>

      <section style={styles.testimonialsSection}>
        <h2 style={styles.testimonialsTitle}>Ce que disent nos clients</h2>
        <div style={styles.testimonialsGrid}>
          {testimonials.map((t) => (
            <div key={t.name} style={styles.testimonialCard}>
              <p style={styles.testimonialQuote}>"{t.quote}"</p>
              <p style={styles.testimonialName}>{t.name}</p>
            </div>
          ))}
        </div>
        <p style={styles.testimonialsNote}>* Exemples illustratifs — en attente de vrais témoignages clients</p>
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
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '4rem 1.5rem 2rem',
    maxWidth: '1500px',
    margin: '0 auto',
  },
  heroTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 'clamp(3rem, 5vw, 3.5rem)',
    fontWeight: 800,
    lineHeight: 1.2,
    margin: '0 0 1.5rem 0',
  },
  caret: {
    display: 'inline-block',
    animation: 'blink 0.9s steps(1) infinite',
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
    display: 'inline-block',
  },
  secondaryButton: {
    padding: '0.85rem 1.75rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    color: '#FFFFFF',
    textDecoration: 'none',
    fontWeight: 600,
  },
  statsSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2.5rem',
    flexWrap: 'wrap',
    padding: '2rem 1.5rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 800,
    margin: 0,
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#94A3B8',
    margin: '0.25rem 0 0 0',
  },
  testimonialsSection: {
    padding: '2rem 1.5rem 3rem',
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'center',
  },
  testimonialsTitle: {
    fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
    fontWeight: 800,
    margin: '0 0 1.5rem 0',
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
  },
  testimonialCard: {
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '14px',
    padding: '1.5rem',
    textAlign: 'left',
  },
  testimonialQuote: {
    color: '#CBD5E1',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    margin: '0 0 1rem 0',
    fontStyle: 'italic',
  },
  testimonialName: {
    color: '#A78BFA',
    fontSize: '0.85rem',
    fontWeight: 600,
    margin: 0,
  },
  testimonialsNote: {
    color: '#64748B',
    fontSize: '0.75rem',
    marginTop: '1.5rem',
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
  workCard: {
    padding: 0,
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '12px',
    overflow: 'hidden',
    background: 'rgba(30, 27, 75, 0.5)',
    cursor: 'pointer',
    aspectRatio: '4 / 5',
    position: 'relative',
  },
  workImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  emptyText: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '0.9rem',
  },
  lightbox: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  lightboxImg: {
    maxWidth: '92vw',
    maxHeight: '88vh',
    objectFit: 'contain',
    borderRadius: '8px',
  },
  lightboxClose: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(0, 0, 0, 0.5)',
    color: '#FFFFFF',
    fontSize: '1.1rem',
    cursor: 'pointer',
  },
}

export default Home
