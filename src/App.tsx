import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [status, setStatus] = useState('Connexion en cours...')

  useEffect(() => {
    supabase.auth.getSession().then(({ error }) => {
      if (error) {
        setStatus('Erreur : ' + error.message)
      } else {
        setStatus('✅ Connecté à Supabase avec succès !')
      }
    })
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>{status}</h1>
    </div>
  )
}

export default App