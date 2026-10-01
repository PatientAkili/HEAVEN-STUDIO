import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { authStyles as styles } from '../lib/authStyles'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setMessage('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) {
      setErrorMsg("Impossible d'envoyer l'email pour le moment. Réessayez dans quelques minutes.")
    } else {
      setMessage("Si cette adresse correspond à un compte, un email avec un lien de réinitialisation vient d'être envoyé.")
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.brand}>Mot de passe oublié</h1>
        <p style={styles.subtitle}>Entrez votre email, nous vous enverrons un lien pour choisir un nouveau mot de passe.</p>

        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        {message && <p style={styles.success}>{message}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Envoi...' : 'Envoyer le lien'}
        </button>

        <Link to="/connexion" style={styles.link}>
          Retour à la connexion
        </Link>
      </form>
    </div>
  )
}

export default ForgotPassword
