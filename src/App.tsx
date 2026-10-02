import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from './lib/supabaseClient'

function getVisitorId() {
  const key = 'hrs_visitor_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import Tarifs from './pages/Tarifs'
import Contact from './pages/Contact'
import Login from './pages/Login'
import ClientGallery from './pages/ClientGallery'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    supabase.from('site_visits').insert({
      visitor_id: getVisitorId(),
      path: pathname,
    }).then(() => {})
  }, [pathname])

  return null
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/portfolio" element={<Navigate to="/" replace />} />
        <Route path="/tarifs" element={<PageTransition><Tarifs /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/connexion" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/galerie" element={<PageTransition><ClientGallery /></PageTransition>} />
        <Route path="/admin/connexion" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthRecoveryWatcher />
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
