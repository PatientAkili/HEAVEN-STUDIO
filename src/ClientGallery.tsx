import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'

function ClientGallery() {
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        navigate('/connexion')
      } else {
        setUserEmail(data.session.user.email ?? '')
        setLoading(false)
      }
    }
    checkSession()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/connexion')
  }

  if (loading) {
    return <p style={{ color: '#fff', padding: '2rem' }}>Chargement...</p>
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0D', color: '#fff', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Bienvenue, {userEmail}</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: '1px solid #C9A24B',
            color: '#C9A24B',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Déconnexion
        </button>
      </div>
      <p>Vos galeries apparaîtront ici prochainement.</p>
    </div>
  )
}

export default ClientGallery