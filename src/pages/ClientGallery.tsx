import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackgroundDecor from '../components/BackgroundDecor'

interface GalleryFile {
  id: string
  file_path: string
  thumbnail_path: string | null
  file_type: 'photo' | 'video'
  url?: string
  thumbUrl?: string
}

interface Gallery {
  id: string
  title: string
  description: string | null
  created_at: string
  files: GalleryFile[]
}

function ClientGallery() {
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        navigate('/connexion')
        return
      }

      // Mot de passe provisoire : le client doit d'abord le changer
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user?.user_metadata?.must_change_password) {
        navigate('/changer-mot-de-passe')
        return
      }

      setUserEmail(sessionData.session.user.email ?? '')

      // 1. Récupérer les galeries du client connecté (RLS filtre déjà automatiquement)
      const { data: galleriesData, error: galleriesError } = await supabase
        .from('galleries')
        .select('id, title, description, created_at')
        .order('created_at', { ascending: false })

      if (galleriesError) {
        setErrorMsg("Erreur lors du chargement des galeries : " + galleriesError.message)
        setLoading(false)
        return
      }

      // 2. Pour chaque galerie, récupérer ses fichiers + générer un lien sécurisé
      const galleriesWithFiles: Gallery[] = []

      for (const gallery of galleriesData ?? []) {
        const { data: filesData } = await supabase
          .from('gallery_files')
          .select('id, file_path, thumbnail_path, file_type')
          .eq('gallery_id', gallery.id)

        const filesWithUrls: GalleryFile[] = []

        for (const file of filesData ?? []) {
          const { data: signedUrlData } = await supabase.storage
            .from('galleries')
            .createSignedUrl(file.file_path, 3600) // lien valide 1h, fichier d'origine (qualité intacte)

          let thumbUrl: string | undefined
          if (file.thumbnail_path) {
            const { data: thumbSigned } = await supabase.storage
              .from('galleries')
              .createSignedUrl(file.thumbnail_path, 3600)
            thumbUrl = thumbSigned?.signedUrl
          }

          filesWithUrls.push({
            ...file,
            url: signedUrlData?.signedUrl,
            thumbUrl,
          })
        }

        galleriesWithFiles.push({ ...gallery, files: filesWithUrls })
      }

      setGalleries(galleriesWithFiles)
      setLoading(false)
    }

    loadData()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/connexion')
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <BackgroundDecor />
        <p style={styles.loadingText}>Chargement de vos galeries...</p>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <Navbar mode="client" onLogout={handleLogout} />

      <main style={styles.main}>
        <div style={styles.welcomeBlock}>
          <h1 style={styles.title}>Bienvenue</h1>
          <p style={styles.email}>{userEmail}</p>
        </div>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        {!errorMsg && galleries.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>Aucune galerie disponible pour le moment</p>
            <p style={styles.emptyText}>
              Vos photos et vidéos apparaîtront ici dès qu'elles seront mises en ligne par le studio.
            </p>
          </div>
        )}

        {galleries.map((gallery) => (
          <section key={gallery.id} style={styles.gallerySection}>
            <h2 style={styles.galleryTitle}>{gallery.title}</h2>
            {gallery.description && <p style={styles.galleryDesc}>{gallery.description}</p>}

            {gallery.files.length === 0 ? (
              <p style={styles.emptyText}>Aucun fichier dans cette galerie pour l'instant.</p>
            ) : (
              <div style={styles.filesGrid}>
                {gallery.files.map((file) => (
                  <div key={file.id} style={styles.fileCard}>
                    {file.file_type === 'photo' && file.url ? (
                      <img src={file.thumbUrl ?? file.url} alt="" style={styles.thumbnail} />
                    ) : (
                      <div style={styles.videoPlaceholder}>🎬 Vidéo</div>
                    )}
                    {file.url && (
                      <a href={file.url} download style={styles.downloadButton}>
                        Télécharger
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </main>

      <Footer />
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 55%, #2E1065 100%)',
    color: '#FFFFFF',
    fontFamily: 'Inter, sans-serif',
  },
  loadingText: {
    margin: 'auto',
    color: '#94A3B8',
  },
  welcomeBlock: {
    marginBottom: '1.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
    borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 800,
    margin: 0,
  },
  email: {
    color: '#94A3B8',
    fontSize: '0.85rem',
    margin: '0.15rem 0 0 0',
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
    flex: 1,
    padding: '2rem 1.5rem',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
  },
  error: {
    color: '#F87171',
    textAlign: 'center',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 1rem',
  },
  emptyTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: '0 0 0.5rem 0',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: '0.9rem',
  },
  gallerySection: {
    marginBottom: '2.5rem',
  },
  galleryTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    margin: '0 0 0.25rem 0',
  },
  galleryDesc: {
    color: '#94A3B8',
    fontSize: '0.9rem',
    margin: '0 0 1rem 0',
  },
  filesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1rem',
  },
  fileCard: {
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: '4 / 3',
    objectFit: 'cover',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: '4 / 3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#94A3B8',
    fontSize: '0.9rem',
  },
  downloadButton: {
    textAlign: 'center',
    padding: '0.6rem',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
}

export default ClientGallery
