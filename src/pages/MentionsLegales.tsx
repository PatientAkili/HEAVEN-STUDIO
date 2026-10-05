import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackgroundDecor from '../components/BackgroundDecor'

function MentionsLegales() {
  return (
    <div style={styles.page}>
      <BackgroundDecor />
      <Navbar />
      <main style={styles.main}>
        <h1 style={styles.title}>Mentions légales</h1>

        <section style={styles.section}>
          <h2 style={styles.h2}>Éditeur du site</h2>
          <p style={styles.p}>
            Le site HEAVEN ROYAL STUDIO PROD est édité par Gloire Michel, exerçant en tant
            qu'entreprise individuelle / indépendant, spécialisé dans la photographie et la
            production audiovisuelle.
          </p>
          <p style={styles.p}>
            Basé à Bukavu, Sud-Kivu, République Démocratique du Congo.<br />
            Email : heavenroyalstudioprod243@gmail.com<br />
            Téléphone / WhatsApp : +243 971 862 571
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Hébergement</h2>
          <p style={styles.p}>
            Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Propriété intellectuelle</h2>
          <p style={styles.p}>
            L'ensemble des contenus présents sur ce site (photographies, textes, logo, identité
            visuelle) sont la propriété exclusive de HEAVEN ROYAL STUDIO PROD, sauf mention
            contraire. Toute reproduction, totale ou partielle, sans autorisation préalable est interdite.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Responsabilité</h2>
          <p style={styles.p}>
            HEAVEN ROYAL STUDIO PROD s'efforce d'assurer l'exactitude des informations diffusées
            sur ce site, sans garantir l'exhaustivité ou l'absence d'erreur. L'utilisation du site
            se fait sous la responsabilité de l'utilisateur.
          </p>
        </section>

        <section style={styles.devSection}>
          <h2 style={styles.h2}>Développement du site</h2>
          <div className="dev-card" style={styles.devCard}>
            <img src="/team/patient-akili.jpg" alt="Akili Cirhonde Patient" className="dev-photo" style={styles.devPhoto} />
            <div style={styles.devInfo}>
            <p style={styles.devName}>AKILI CIRHONDE PATIENT</p>
            <p style={styles.devRole}>
              Ingénieur en Génie et Gestion des Télécommunications<br />
              Spécialisation Systèmes et Sécurité Réseaux
            </p>
            <p style={styles.devPassion}>Passionné par le développement web</p>
            <div style={styles.devContacts}>
              <a href="https://wa.me/243979209489" target="_blank" rel="noopener noreferrer" style={styles.devLink}>
                WhatsApp (RDC) +243 979 209 489
              </a>
              <a href="https://wa.me/25762321978" target="_blank" rel="noopener noreferrer" style={styles.devLink}>
                WhatsApp (Burundi) +257 62 321 978
              </a>
              <a href="mailto:patientakili78@icloud.com" style={styles.devLink}>
                patientakili78@icloud.com
              </a>
            </div>
          </div>
        </div>
        </section>
      </main>
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
  main: {
    flex: 1,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    width: '100%',
  },
  title: {
    fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
    fontWeight: 800,
    margin: '0 0 2rem 0',
  },
  section: {
    marginBottom: '2rem',
  },
  h2: {
    fontSize: '1.1rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
    color: '#A78BFA',
  },
  devSection: {
    marginBottom: '2rem',
  },
  devCard: {
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    border: '1px solid rgba(167, 139, 250, 0.3)',
    borderRadius: '14px',
    padding: '1.5rem',
  },
  devName: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#FFFFFF',
    margin: '0 0 0.4rem 0',
    letterSpacing: '0.02em',
  },
  devRole: {
    color: '#C4B5FD',
    fontSize: '0.88rem',
    lineHeight: 1.6,
    margin: '0 0 0.5rem 0',
  },
  devPassion: {
    color: '#94A3B8',
    fontSize: '0.85rem',
    fontStyle: 'italic',
    margin: '0 0 1rem 0',
  },
  devContacts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  devLink: {
    color: '#93C5FD',
    fontSize: '0.85rem',
    textDecoration: 'none',
  },
  p: {
    color: '#CBD5E1',
    fontSize: '0.9rem',
    lineHeight: 1.7,
    margin: '0 0 0.75rem 0',
  },
}

export default MentionsLegales
