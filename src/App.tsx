import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ClientGallery from './pages/ClientGallery'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/connexion" />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/galerie" element={<ClientGallery />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App