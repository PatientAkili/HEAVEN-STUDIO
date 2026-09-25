import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ADMIN_UID = '1cf86f6f-6561-407f-b5d7-5124846ffdfc'

interface Profile {
  id: string
  email: string
  full_name: string | null
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<Profile[]>([])

  const [selectedClient, setSelectedClient] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [createdGalleryId, setCreatedGalleryId] = useState('')
  const [message, setMessage] = useState('')

  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  useEffect(() => {
    const checkAccess = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session || data.session.user.id !== ADMIN_UID) {
        navigate('/admin/connexion')
        return
      }

      const { data: profilesData } = await supabase.from('profiles').select('id, email, full_name')
      setProfiles(profilesData ?? [])
      setLoading(false)
    }
    checkAccess()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/connexion')
  }

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setCreating(true)

    const { data, error } = await supabase
      .from('galleries')
      .insert({ client_id: selectedClient, title, description })
      .select()
      .single()

    setCreating(false)

    if (error) {
      setMessage("Erreur : " + error.message)
      return
    }

    setCreatedGalleryId(data.id)
    setMessage(` Galerie "${title}" créée. Tu peux maintenant uploader des fichiers ci-dessous.`)
  }

  const handleUpload = async () => {
    if (!files || files.length === 0 || !createdGalleryId || !selectedClient) return

    setUploading(true)
    let successCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`Envoi de ${i + 1}/${files.length} : ${file.name}`)

      const fileType = file.type.startsWith('video') ? 'video' : 'photo'
      const filePath = `${selectedClient}/${createdGalleryId}/${Date.now()}_${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('galleries')
        .upload(filePath, file)

      if (uploadError) {
        setMessage(`Erreur upload ${file.name} : ${uploadError.message}`)
        continue
      }

      const { error: dbError } = await supabase.from('gallery_files').insert({
        gallery_id: createdGalleryId,
        file_path: filePath,
        file_type: fileType,
      })

      if (!dbError) successCount++
    }

    setUploading(false)
    setUploadProgress('')
    setMessage(` ${successCount}/${files.length} Fichier(s) envoyé(s) avec succès.`)
    setFiles(null)
  }

  if (loading) {
    return <p style={{ color: '#fff', padding: '2rem' }}>Chargement...</p>
  }

  return (
    <div style={styles.page}>
      <Navbar mode="client" homeTo="/admin" label="Espace Admin" onLogout={handleLogout} />

      <main style={styles.main}>
        <h1 style={styles.title}>Tableau de bord Admin</h1>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>1. Créer une galerie</h2>
          <form onSubmit={handleCreateGallery} style={styles.form}>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">-- Choisir un client --</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>{p.email}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Titre de la galerie (ex: Mariage Jean & Marie)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
            />
            <textarea
              placeholder="Description (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={styles.textarea}
            />
            <button type="submit" disabled={creating} style={styles.button}>
              {creating ? 'Création...' : 'Créer la galerie'}
            </button>
          </form>
        </section>

        {createdGalleryId && (
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>2. Uploader des fichiers</h2>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => setFiles(e.target.files)}
              style={styles.fileInput}
            />
            <button
              onClick={handleUpload}
              disabled={uploading || !files}
              style={styles.button}
            >
              {uploading ? uploadProgress || 'Envoi...' : 'Envoyer les fichiers'}
            </button>
          </section>
        )}

        {message && <p style={styles.message}>{message}</p>}
      </main>

      <Footer />
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 55%, #2E1065 100%)',
    color: '#FFFFFF',
    fontFamily: 'Inter, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 800,
    margin: 0,
  },
  logoutButton: {
    padding: '0.5rem 1.1rem',
    borderRadius: '8px',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '16px',
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: '0 0 1rem 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  fileInput: {
    color: '#94A3B8',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.75rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  message: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '0.9rem',
  },
}

export default AdminDashboard
