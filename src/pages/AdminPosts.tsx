import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackgroundDecor from '../components/BackgroundDecor'

const ADMIN_UID = 'cc4500b3-159f-4871-b478-6884e50e1ccc'
const MAX_IMAGES = 10

interface Post {
  id: string
  content: string | null
  image_paths: string[]
  created_at: string
  like_count: number
  comment_count: number
  view_count: number
  share_count: number
}

interface PostComment {
  id: string
  author_name: string
  content: string
  created_at: string
}

// Redimensionne à 2000 px max (qualité visuellement identique, mais bien plus léger à charger)
const resizeImage = (file: File, maxSize = 2000, quality = 0.9): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const width = Math.round(img.width * scale)
      const height = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')?.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) resolve(blob)
          else reject(new Error("Échec du traitement de l'image"))
        },
        'image/webp',
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image illisible'))
    }
    img.src = url
  })

const publicUrl = (path: string) => supabase.storage.from('posts').getPublicUrl(path).data.publicUrl

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const errorText = (err: unknown) => (err as { message?: string })?.message ?? String(err)

function AdminPosts() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [inputKey, setInputKey] = useState(0)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')
  const [openCommentsId, setOpenCommentsId] = useState('')
  const [comments, setComments] = useState<PostComment[]>([])
  const [deletingId, setDeletingId] = useState('')

  const loadPosts = async () => {
    const { data, error } = await supabase.rpc('get_posts_with_stats', { p_visitor_id: null })
    if (error) {
      setMessage('Erreur de chargement : ' + error.message)
      return
    }
    setPosts((data ?? []) as Post[])
  }

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session || data.session.user.id !== ADMIN_UID) {
        navigate('/admin/connexion')
        return
      }
      await loadPosts()
      setLoading(false)
    }
    init()
  }, [navigate])

  useEffect(() => {
    return () => {
      previews.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [previews])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/connexion')
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).slice(0, MAX_IMAGES)
    setFiles(selected)
    setPreviews(selected.map((f) => URL.createObjectURL(f)))
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!content.trim() && files.length === 0) {
      setMessage('Écris un texte ou ajoute au moins une photo.')
      return
    }

    setPublishing(true)
    const postId = crypto.randomUUID()
    const uploaded: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        setMessage(`Envoi de la photo ${i + 1}/${files.length}...`)
        const blob = await resizeImage(files[i])
        const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg'
        const path = `${postId}/${Date.now()}_${i}.${ext}`
        const { error } = await supabase.storage.from('posts').upload(path, blob, { contentType: blob.type })
        if (error) throw error
        uploaded.push(path)
      }

      const { error: insertError } = await supabase
        .from('posts')
        .insert({ id: postId, content: content.trim() || null, image_paths: uploaded })
      if (insertError) throw insertError

      setContent('')
      setFiles([])
      setPreviews([])
      setInputKey((k) => k + 1)
      setMessage('✅ Publication créée.')
      await loadPosts()
    } catch (err) {
      if (uploaded.length > 0) await supabase.storage.from('posts').remove(uploaded)
      setMessage('Erreur : ' + errorText(err))
    } finally {
      setPublishing(false)
    }
  }

  const handleDeletePost = async (post: Post) => {
    if (!confirm('Supprimer définitivement cette publication, ses photos, ses j\'aime et ses commentaires ?')) return
    setDeletingId(post.id)
    if (post.image_paths.length > 0) {
      await supabase.storage.from('posts').remove(post.image_paths)
    }
    const { error } = await supabase.from('posts').delete().eq('id', post.id)
    setDeletingId('')
    if (error) {
      setMessage('Erreur : ' + error.message)
      return
    }
    setMessage('✅ Publication supprimée.')
    await loadPosts()
  }

  const toggleComments = async (postId: string) => {
    if (openCommentsId === postId) {
      setOpenCommentsId('')
      return
    }
    const { data, error } = await supabase
      .from('post_comments')
      .select('id, author_name, content, created_at')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
    if (error) {
      setMessage('Erreur : ' + error.message)
      return
    }
    setComments((data ?? []) as PostComment[])
    setOpenCommentsId(postId)
  }

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return
    const { error } = await supabase.from('post_comments').delete().eq('id', commentId)
    if (error) {
      setMessage('Erreur : ' + error.message)
      return
    }
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comment_count: Math.max(0, p.comment_count - 1) } : p))
    )
  }

  const totals = posts.reduce(
    (acc, p) => ({
      views: acc.views + p.view_count,
      likes: acc.likes + p.like_count,
      comments: acc.comments + p.comment_count,
      shares: acc.shares + p.share_count,
    }),
    { views: 0, likes: 0, comments: 0, shares: 0 }
  )

  if (loading) {
    return <p style={{ color: '#fff', padding: '2rem' }}>Chargement...</p>
  }

  return (
    <div style={styles.page}>
      <BackgroundDecor />
      <Navbar mode="admin" homeTo="/admin" label="Espace Admin" onLogout={handleLogout} />

      <main style={styles.main}>
        <h1 style={styles.title}>Publications</h1>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Statistiques globales</h2>
          <div style={styles.statsRow}>
            <div style={styles.statBox}><p style={styles.statNumber}>{posts.length}</p><p style={styles.statLabel}>Publications</p></div>
            <div style={styles.statBox}><p style={styles.statNumber}>{totals.views}</p><p style={styles.statLabel}>Vues</p></div>
            <div style={styles.statBox}><p style={styles.statNumber}>{totals.likes}</p><p style={styles.statLabel}>J'aime</p></div>
            <div style={styles.statBox}><p style={styles.statNumber}>{totals.comments}</p><p style={styles.statLabel}>Commentaires</p></div>
            <div style={styles.statBox}><p style={styles.statNumber}>{totals.shares}</p><p style={styles.statLabel}>Partages</p></div>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Nouvelle publication</h2>
          <form onSubmit={handlePublish} style={styles.form}>
            <textarea
              placeholder="Écris ta publication (texte, paroles, annonce...)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              style={styles.textarea}
            />
            <input
              key={inputKey}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              style={styles.fileInput}
            />
            <p style={styles.hint}>Jusqu'à {MAX_IMAGES} photos par publication.</p>

            {previews.length > 0 && (
              <div style={styles.previewGrid}>
                {previews.map((src) => (
                  <img key={src} src={src} alt="" style={styles.previewImg} />
                ))}
              </div>
            )}

            <button type="submit" disabled={publishing} style={styles.button}>
              {publishing ? 'Publication...' : 'Publier'}
            </button>
          </form>
          {message && <p style={styles.message}>{message}</p>}
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Publications existantes</h2>
          {posts.length === 0 ? (
            <p style={styles.hint}>Aucune publication pour l'instant.</p>
          ) : (
            <div style={styles.postList}>
              {posts.map((post) => (
                <article key={post.id} style={styles.postCard}>
                  <p style={styles.postDate}>{formatDate(post.created_at)}</p>
                  {post.content && <p style={styles.postContent}>{post.content}</p>}

                  {post.image_paths.length > 0 && (
                    <div style={styles.postImages}>
                      {post.image_paths.map((path) => (
                        <img key={path} src={publicUrl(path)} alt="" style={styles.postImg} loading="lazy" />
                      ))}
                    </div>
                  )}

                  <div style={styles.statsRow}>
                    <div style={styles.miniStat}><strong>{post.view_count}</strong> vues</div>
                    <div style={styles.miniStat}><strong>{post.like_count}</strong> j'aime</div>
                    <div style={styles.miniStat}><strong>{post.comment_count}</strong> commentaires</div>
                    <div style={styles.miniStat}><strong>{post.share_count}</strong> partages</div>
                  </div>

                  <div style={styles.actions}>
                    <button onClick={() => toggleComments(post.id)} style={styles.secondaryButton}>
                      {openCommentsId === post.id ? 'Masquer les commentaires' : 'Voir les commentaires'}
                    </button>
                    <button
                      onClick={() => handleDeletePost(post)}
                      disabled={deletingId === post.id}
                      style={styles.deleteButton}
                    >
                      {deletingId === post.id ? '...' : 'Supprimer'}
                    </button>
                  </div>

                  {openCommentsId === post.id && (
                    <div style={styles.commentsBox}>
                      {comments.length === 0 ? (
                        <p style={styles.hint}>Aucun commentaire.</p>
                      ) : (
                        comments.map((c) => (
                          <div key={c.id} style={styles.commentRow}>
                            <div style={{ minWidth: 0 }}>
                              <p style={styles.commentAuthor}>{c.author_name} · <span style={styles.commentDate}>{formatDate(c.created_at)}</span></p>
                              <p style={styles.commentText}>{c.content}</p>
                            </div>
                            <button onClick={() => handleDeleteComment(c.id, post.id)} style={styles.deleteButton}>
                              Supprimer
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
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
  main: {
    flex: 1,
    width: '100%',
    maxWidth: '760px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  title: { fontSize: '1.5rem', fontWeight: 800, margin: 0 },
  card: {
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '16px',
    padding: '1.5rem',
  },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
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
  fileInput: { color: '#94A3B8', fontSize: '0.9rem' },
  hint: { color: '#94A3B8', fontSize: '0.8rem', margin: 0 },
  previewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem' },
  previewImg: { width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '8px' },
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
  message: { color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' },
  statsRow: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap' },
  statBox: {
    flex: '1 1 110px',
    textAlign: 'center',
    padding: '0.9rem 0.5rem',
    borderRadius: '10px',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  statNumber: { fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.2rem 0' },
  statLabel: { fontSize: '0.75rem', color: '#94A3B8', margin: 0 },
  postList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  postCard: {
    padding: '1rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  postDate: { color: '#94A3B8', fontSize: '0.75rem', margin: 0 },
  postContent: { margin: 0, fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#E2E8F0' },
  postImages: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.5rem' },
  postImg: { width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '8px' },
  miniStat: {
    padding: '0.4rem 0.7rem',
    borderRadius: '999px',
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    fontSize: '0.78rem',
    color: '#CBD5E1',
  },
  actions: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap' },
  secondaryButton: {
    padding: '0.45rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.45rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid rgba(248, 113, 113, 0.4)',
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    color: '#F87171',
    fontSize: '0.8rem',
    cursor: 'pointer',
    flexShrink: 0,
  },
  commentsBox: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  commentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
  },
  commentAuthor: { margin: 0, fontSize: '0.82rem', fontWeight: 700 },
  commentDate: { color: '#94A3B8', fontWeight: 400 },
  commentText: { margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#CBD5E1', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
}

export default AdminPosts
