import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { authStyles as styles } from '../lib/authStyles'

function ChangePassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate('/connexion')
      } else {
        setChecking(false)
      }
    })
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (password.length < 8) {
      setErrorMsg('Le mot de passe doit faire au moins 8 caractères.')
      return
    }
    if (password !== confirm) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      password,
      data: { must_change_password: false },
    })
    setLoading(false)

    if (error) {
      if (error.message.toLowerCase().includes('different')) {
        setErrorMsg('Choisissez un mot de passe différent de celui que vous avez reçu.')
      } else {
        setErrorMsg('Erreur : ' + error.message)
      }
      return
    }

    navigate('/galerie')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/connexion')
  }

  if (checking) return null

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.brand}>Choisissez votre mot de passe</h1>
        <p style={styles.subtitle}>
          Pour votre sécurité, remplacez le mot de passe provisoire par le vôtre (8 caractères minimum).
        </p>

        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={styles.input}
        />

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Enregistrement...' : 'Enregistrer et accéder à mes photos'}
        </button>

        <button type="button" onClick={handleLogout} style={styles.link}>
          Se déconnecter
        </button>
      </form>
    </div>
  )
}

export default ChangePassword
