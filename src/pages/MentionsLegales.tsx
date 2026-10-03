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
  p: {
    color: '#CBD5E1',
    fontSize: '0.9rem',
    lineHeight: 1.7,
    margin: '0 0 0.75rem 0',
  },
}

export default MentionsLegales
