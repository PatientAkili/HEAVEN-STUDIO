import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackgroundDecor from '../components/BackgroundDecor'
interface Profile {
  id: string
  email: string
  full_name: string | null
}
interface ExistingGallery {
  id: string
  title: string
  client_id: string
  created_at: string
}

const CREATE_USER_URL =
  'https://ehsdunyyzbhcnpifxyhm.supabase.co/functions/v1/create-client-user'

const generateThumbnail = (file: File, maxSize = 600, quality = 0.75): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      let { width, height } = img

      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width)
        width = maxSize
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height)
        height = maxSize
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) resolve(blob)
          else reject(new Error('Échec de la génération de la miniature'))
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = reject
    img.src = url
  })
}

function AdminDashboard() {
  const navigate = useNavigate()

  
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [existingGalleries, setExistingGalleries] = useState<ExistingGallery[]>([])

  
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientPassword, setNewClientPassword] = useState('')
  const [newClientIsAdmin, setNewClientIsAdmin] = useState(false)
  const [creatingClient, setCreatingClient] = useState(false)

  
  const [selectedClient, setSelectedClient] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [createdGalleryId, setCreatedGalleryId] = useState('')

  
  const [deletingId, setDeletingId] = useState('')

  
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  
  const [message, setMessage] = useState('')

  

  const loadProfiles = async () => {
    const { data } = await supabase.from('profiles').select('id, email, full_name')
    setProfiles(data ?? [])
  }

  const loadGalleries = async () => {
    const { data } = await supabase
      .from('galleries')
      .select('id, title, client_id, created_at')
      .order('created_at', { ascending: false })
    setExistingGalleries(data ?? [])
  }

  
  useEffect(() => {
    const checkAccess = async () => {
      // 1. L'utilisateur est-il connecté ?
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        navigate('/admin/connexion')
        return
      }

      // 2. Est-il dans la table des administrateurs ?
      const { data: adminRow } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', data.session.user.id)
        .maybeSingle()

      if (!adminRow) {
        navigate('/admin/connexion')
        return
      }

      // 3. Accès accordé : charger les données
      await Promise.all([loadProfiles(), loadGalleries()])
      setLoading(false)
    }

    checkAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/connexion')
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setCreatingClient(true)

    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData.session?.access_token

    try {
      const response = await fetch(CREATE_USER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: newClientEmail,
          password: newClientPassword,
          isAdmin: newClientIsAdmin,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage('Erreur : ' + (result.error ?? 'Échec de la création'))
      } else {
        const type = newClientIsAdmin ? 'Administrateur' : 'Client'
        setMessage(`${type} ${newClientEmail} créé avec succès.`)
        setNewClientEmail('')
        setNewClientPassword('')
        setNewClientIsAdmin(false)
        await loadProfiles()
      }
    } catch (err) {
      setMessage('Erreur réseau : ' + String(err))
    } finally {
      setCreatingClient(false)
    }
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
      setMessage('Erreur : ' + error.message)
      return
    }

    setCreatedGalleryId(data.id)
    setMessage(`Galerie "${title}" créée. Tu peux maintenant uploader des fichiers ci-dessous.`)
    loadGalleries()
  }

  const handleDeleteGallery = async (galleryId: string) => {
    if (!confirm('Supprimer définitivement cette galerie et tous ses fichiers ?')) return

    setDeletingId(galleryId)

    // 1. Supprimer les fichiers du stockage
    const { data: filesData } = await supabase
      .from('gallery_files')
      .select('file_path')
      .eq('gallery_id', galleryId)

    if (filesData && filesData.length > 0) {
      const paths = filesData.map((f) => f.file_path)
      await supabase.storage.from('galleries').remove(paths)
    }

    // 2. Supprimer les entrées gallery_files
    await supabase.from('gallery_files').delete().eq('gallery_id', galleryId)

    // 3. Supprimer la galerie
    const { error } = await supabase.from('galleries').delete().eq('id', galleryId)

    setDeletingId('')

    if (error) {
      setMessage('Erreur lors de la suppression : ' + error.message)
      return
    }

    setMessage('Galerie supprimée.')
    loadGalleries()
  }

  const handleUpload = async () => {
    if (!files || files.length === 0 || !createdGalleryId || !selectedClient) return

    setUploading(true)
    let successCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`Envoi de ${i + 1}/${files.length} : ${file.name}`)

      const fileType = file.type.startsWith('video') ? 'video' : 'photo'
      const timestamp = Date.now()
      const filePath = `${selectedClient}/${createdGalleryId}/${timestamp}_${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('galleries')
        .upload(filePath, file)

      if (uploadError) {
        setMessage(`Erreur upload ${file.name} : ${uploadError.message}`)
        continue
      }

      // Miniature (photos uniquement)
      let thumbnailPath: string | null = null
      if (fileType === 'photo') {
        try {
          const thumbBlob = await generateThumbnail(file)
          const candidatePath = `${selectedClient}/${createdGalleryId}/thumb_${timestamp}_${file.name}`
          const { error: thumbError } = await supabase.storage
            .from('galleries')
            .upload(candidatePath, thumbBlob, { contentType: 'image/jpeg' })
          if (!thumbError) thumbnailPath = candidatePath
        } catch {
          thumbnailPath = null
        }
      }

      const { error: dbError } = await supabase.from('gallery_files').insert({
        gallery_id: createdGalleryId,
        file_path: filePath,
        thumbnail_path: thumbnailPath,
        file_type: fileType,
      })

      if (!dbError) successCount++
    }

    setUploading(false)
    setUploadProgress('')
    setMessage(`${successCount}/${files.length} fichier(s) envoyé(s) avec succès.`)
    setFiles(null)
  }


  if (loading) {
    return <p style={{ color: '#fff', padding: '2rem' }}>Chargement...</p>
  }

  return (
    <div style={styles.page}>
      <BackgroundDecor />
      <Navbar mode="client" homeTo="/admin" label="Espace Admin" onLogout={handleLogout} />

      <main style={styles.main}>
        <h1 style={styles.title}>Tableau de bord Admin</h1>

        {/* 1. Créer un compte */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>1. Créer un compte</h2>
          <form onSubmit={handleCreateClient} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={newClientEmail}
              onChange={(e) => setNewClientEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Mot de passe temporaire"
              value={newClientPassword}
              onChange={(e) => setNewClientPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={newClientIsAdmin}
                onChange={(e) => setNewClientIsAdmin(e.target.checked)}
              />
              Compte administrateur
            </label>
            <button type="submit" disabled={creatingClient} style={styles.button}>
              {creatingClient ? 'Création...' : 'Créer le compte'}
            </button>
          </form>
        </section>

        {/* 2. Créer une galerie */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>2. Créer une galerie</h2>
          <form onSubmit={handleCreateGallery} style={styles.form}>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">-- Choisir un client --</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.email}
                </option>
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

        {/* 3. Uploader des fichiers */}
        {createdGalleryId && (
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>3. Uploader des fichiers</h2>
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

        {/* Galeries existantes */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Galeries existantes</h2>
          {existingGalleries.length === 0 ? (
            <p style={styles.emptyText}>Aucune galerie créée pour l'instant.</p>
          ) : (
            <div style={styles.galleryList}>
              {existingGalleries.map((g) => {
                const client = profiles.find((p) => p.id === g.client_id)
                return (
                  <div key={g.id} style={styles.galleryRow}>
                    <div>
                      <p style={styles.galleryRowTitle}>{g.title}</p>
                      <p style={styles.galleryRowClient}>{client?.email ?? 'Client inconnu'}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteGallery(g.id)}
                      disabled={deletingId === g.id}
                      style={styles.deleteButton}
                    >
                      {deletingId === g.id ? '...' : 'Supprimer'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

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
  main: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 800,
    margin: 0,
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
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#94A3B8',
    fontSize: '0.9rem',
    cursor: 'pointer',
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
  emptyText: {
    color: '#94A3B8',
    fontSize: '0.85rem',
  },
  galleryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  galleryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: '10px',
    gap: '1rem',
  },
  galleryRowTitle: {
    margin: 0,
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  galleryRowClient: {
    margin: '0.15rem 0 0 0',
    color: '#94A3B8',
    fontSize: '0.8rem',
  },
  deleteButton: {
    padding: '0.4rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid rgba(248, 113, 113, 0.4)',
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    color: '#F87171',
    fontSize: '0.8rem',
    cursor: 'pointer',
    flexShrink: 0,
  },
  message: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '0.9rem',
  },
}

export default AdminDashboard