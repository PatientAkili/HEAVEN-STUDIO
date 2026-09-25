import { useState } from 'react'
import emailjs from '@emailjs/browser'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [envoye, setEnvoye] = useState(false)
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [erreur, setErreur] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErreur('')
    setEnvoiEnCours(true)

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          title: 'Nouveau message depuis le site',
          message: form.message,
        },
        PUBLIC_KEY
      )
      setEnvoye(true)
    } catch (err) {
      setErreur("Une erreur s'est produite. Merci de réessayer ou de nous contacter directement.")
    } finally {
      setEnvoiEnCours(false)
    }
  }

  return (
    <div style={styles.page}>
      <Navbar active="contact" />

      <section style={styles.content}>
        <div style={styles.left}>
          <h1 style={styles.title}>Parlons de votre projet</h1>
          <p style={styles.subtitle}>
            Une question, une envie de séance, un événement à couvrir ?
            Écrivez-moi, je réponds rapidement.
          </p>

          <div style={styles.infoBlock}>
            <p style={styles.infoLabel}>Email</p>
            <p style={styles.infoValue}>heavenroyalstudioprod243@gmail.com</p>
          </div>
          <div style={styles.infoBlock}>
            <p style={styles.infoLabel}>Téléphone / WhatsApp</p>
            <p style={styles.infoValue}>+243 971 862 571</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {envoye ? (
            <p style={styles.successMsg}> Message envoyé ! Je vous répondrai très vite.</p>
          ) : (
            <>
              <input
                type="text"
                name="name"
                placeholder="Votre nom"
                value={form.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="email"
                name="email"
                placeholder="Votre email"
                value={form.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <textarea
                name="message"
                placeholder="Votre message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                style={styles.textarea}
              />
              {erreur && <p style={styles.errorMsg}>{erreur}</p>}
              <button type="submit" disabled={envoiEnCours} className="nav-pill" style={styles.submitButton}>
                {envoiEnCours ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </>
          )}
        </form>
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
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2.5rem',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    alignItems: 'center',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: {
    fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
    fontWeight: 800,
    margin: 0,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    margin: '0 0 1rem 0',
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
  },
  infoLabel: {
    color: '#64748B',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: 600,
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '16px',
    padding: '2rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitButton: {
    padding: '0.85rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginTop: '0.25rem',
  },
  successMsg: {
    textAlign: 'center',
    color: '#4ADE80',
    fontSize: '1.05rem',
    fontWeight: 600,
    padding: '1.5rem 0',
  },
  errorMsg: {
    textAlign: 'center',
    color: '#F87171',
    fontSize: '0.85rem',
    margin: 0,
  },
}

export default Contact
