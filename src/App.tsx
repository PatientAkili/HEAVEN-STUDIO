import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Tarifs from './pages/Tarifs'
import Contact from './pages/Contact'
import Login from './pages/Login'
import ClientGallery from './pages/ClientGallery'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/tarifs" element={<Tarifs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/galerie" element={<ClientGallery />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App