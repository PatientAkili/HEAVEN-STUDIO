import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Tarifs from './pages/Tarifs'
import Contact from './pages/Contact'
import Login from './pages/Login'
import ClientGallery from './pages/ClientGallery'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function AuthRecoveryWatcher() {
  const navigate = useNavigate()
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password')
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [navigate])
  return null
}
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <AuthRecoveryWatcher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/tarifs" element={<Tarifs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/galerie" element={<ClientGallery />} />
        <Route path="/admin/connexion" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App