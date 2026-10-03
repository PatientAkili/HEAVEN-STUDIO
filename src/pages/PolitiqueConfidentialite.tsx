import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackgroundDecor from '../components/BackgroundDecor'

function PolitiqueConfidentialite() {
  return (
    <div style={styles.page}>
      <BackgroundDecor />
      <Navbar />
      <main style={styles.main}>
        <h1 style={styles.title}>Politique de confidentialité</h1>

        <section style={styles.section}>
          <h2 style={styles.h2}>Données collectées</h2>
          <p style={styles.p}>
            Lorsque vous utilisez ce site, nous pouvons collecter : les informations que vous
            fournissez volontairement (nom, email, message via le formulaire de contact), et des
            données de navigation anonymes (pages visitées) à des fins statistiques internes.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Utilisation des données</h2>
          <p style={styles.p}>
            Les informations transmises via le formulaire de contact sont utilisées uniquement
            pour répondre à votre demande. Les comptes clients créés pour l'espace privé servent
            exclusivement à vous donner accès à vos photos et vidéos.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Stockage et sécurité</h2>
          <p style={styles.p}>
            Vos données sont hébergées de façon sécurisée via Supabase. Les photos et vidéos de
            votre galerie personnelle sont strictement privées et accessibles uniquement depuis
            votre compte.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Vos droits</h2>
          <p style={styles.p}>
            Vous pouvez à tout moment demander la suppression de votre compte et de vos données en
            nous contactant à heavenroyalstudioprod243@gmail.com.
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

export default PolitiqueConfidentialite
