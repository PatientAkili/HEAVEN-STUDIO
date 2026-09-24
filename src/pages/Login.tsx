import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setErrorMsg('Email ou mot de passe incorrect.')
    } else {
      navigate('/galerie')
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h1 style={styles.brand}>HEAVEN-STUDIO</h1>
        <p style={styles.subtitle}>Connectez-vous pour accéder à vos photos et vidéos</p>

        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 55%, #2E1065 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
    backgroundColor: 'rgba(30, 27, 75, 0.55)',
    backdropFilter: 'blur(10px)',
    padding: '2.5rem 2rem',
    borderRadius: '16px',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: '1.6rem',
    fontWeight: 800,
    letterSpacing: '0.03em',
    margin: 0,
    textAlign: 'center',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: '0.9rem',
    textAlign: 'center',
    margin: '0 0 0.5rem 0',
  },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#FFFFFF',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '0.9rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.25rem',
  },
  error: {
    color: '#F87171',
    fontSize: '0.875rem',
    textAlign: 'center',
    margin: 0,
  },
}

export default Login
