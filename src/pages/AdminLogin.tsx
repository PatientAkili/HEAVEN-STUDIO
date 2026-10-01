import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import BackgroundDecor from '../components/BackgroundDecor'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    // 1. Connexion
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error || !data.user) {
      // 400 = identifiants incorrects ; autre code = problème technique
      if (error && error.status && error.status !== 400) {
        setErrorMsg('Erreur de connexion : ' + error.message)
      } else {
        setErrorMsg('Email ou mot de passe incorrect.')
      }
      setLoading(false)
      return
    }

    // 2. Vérification : le compte est-il dans la table des administrateurs ?
    const { data: adminRow, error: adminError } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle()

    if (adminError) {
      setErrorMsg('Erreur de vérification des droits : ' + adminError.message)
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (!adminRow) {
      setErrorMsg("Ce compte n'a pas les droits administrateur.")
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    // 3. Accès accordé
    navigate('/admin')
  }

  return (
    <div style={styles.container}>
      <BackgroundDecor />
      <form onSubmit={handleLogin} style={styles.card}>
        <img src="/logo.png" alt="" style={styles.brandLogo} />
        <h1 style={styles.brand}>Espace Admin</h1>
        <p style={styles.subtitle}>Accès réservé au studio</p>

        <input
          type="email"
          placeholder="Email admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Mot de passe"
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
  brandLogo: {
    display: 'block',
    height: '56px',
    width: 'auto',
    margin: '0 auto 0.5rem',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: '1.6rem',
    fontWeight: 800,
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

export default AdminLogin