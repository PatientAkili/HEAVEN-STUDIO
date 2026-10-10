import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getVisitorId } from '../lib/visitor'

interface Post {
  id: string
  content: string | null
  image_paths: string[]
  created_at: string
  like_count: number
  comment_count: number
  share_count: number
  liked_by_me: boolean
}

interface PostComment {
  id: string
  author_name: string
  content: string
  created_at: string
}

const NAME_KEY = 'hrs_commenter_name'
const COOLDOWN_KEY = 'hrs_last_comment_at'
const COOLDOWN_MS = 15000
const PAGE_SIZE = 10

const imageUrl = (path: string) => supabase.storage.from('posts').getPublicUrl(path).data.publicUrl

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? '#F472B6' : 'none'} stroke={filled ? '#F472B6' : 'currentColor'} strokeWidth="2">
      <path d="M12 21s-7-4.6-9.5-9.2C.8 8.5 2.6 4.5 6.4 4.5c2 0 3.5 1.1 4.6 2.7 1.1-1.6 2.6-2.7 4.6-2.7 3.800 0 5.600 4 3.900 7.300C19 16.400 12 21 12 21Z" />
    </svg>
  )
}
function CommentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a8 8 0 0 1-11.8 7L3 21l2-5.500A8 8 0 1 1 21 12Z" />
    </svg>
  )
}
function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.800 4M15.400 6.500l-6.800 4" />
    </svg>
  )
}

interface PostCardProps {
  post: Post
  visitorId: string
  onUpdate: (id: string, fn: (p: Post) => Partial<Post>) => void
  onOpenImage: (src: string) => void
}

function PostCard({ post, visitorId, onUpdate, onOpenImage }: PostCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const likeBusy = useRef(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<PostComment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem(NAME_KEY) ?? ''
    } catch {
      return ''
    }
  })
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')
  const [shareNote, setShareNote] = useState('')

  // Compte une vue quand la publication reste visible 1 seconde (une vue max par visiteur, côté base)
  useEffect(() => {
    const el = cardRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    let timer: ReturnType<typeof setTimeout> | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting
        if (visible && !timer) {
          timer = setTimeout(() => {
            supabase.rpc('register_view', { p_post_id: post.id, p_visitor_id: visitorId }).then(() => {})
            observer.disconnect()
          }, 1000)
        } else if (!visible && timer) {
          clearTimeout(timer)
          timer = undefined
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => {
      if (timer) clearTimeout(timer)
      observer.disconnect()
    }
  }, [post.id, visitorId])

  const toggleLike = async () => {
    if (likeBusy.current) return
    likeBusy.current = true
    const wasLiked = post.liked_by_me
    onUpdate(post.id, (p) => ({ liked_by_me: !wasLiked, like_count: p.like_count + (wasLiked ? -1 : 1) }))
    const { error } = await supabase.rpc('toggle_like', { p_post_id: post.id, p_visitor_id: visitorId })
    if (error) {
      onUpdate(post.id, (p) => ({ liked_by_me: wasLiked, like_count: p.like_count + (wasLiked ? 1 : -1) }))
    }
    likeBusy.current = false
  }

  const toggleComments = async () => {
    if (showComments) {
      setShowComments(false)
      return
    }
    setShowComments(true)
    setLoadingComments(true)
    const { data, error } = await supabase
      .from('post_comments')
      .select('id, author_name, content, created_at')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
      .limit(100)
    setLoadingComments(false)
    if (!error) setComments((data ?? []) as PostComment[])
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotice('')
    const cleanName = name.trim()
    const cleanText = text.trim()
    if (!cleanName || !cleanText) {
      setNotice('Renseigne ton nom et ton commentaire.')
      return
    }

    let last = 0
    try {
      last = Number(localStorage.getItem(COOLDOWN_KEY) ?? 0)
    } catch {
      last = 0
    }
    const wait = COOLDOWN_MS - (Date.now() - last)
    if (wait > 0) {
      setNotice(`Patiente ${Math.ceil(wait / 1000)} s avant de commenter à nouveau.`)
      return
    }

    setSending(true)
    const { data, error } = await supabase
      .from('post_comments')
      .insert({ post_id: post.id, author_name: cleanName, content: cleanText })
      .select('id, author_name, content, created_at')
      .single()
    setSending(false)

    if (error || !data) {
      setNotice("Impossible d'envoyer le commentaire. Réessaie.")
      return
    }

    try {
      localStorage.setItem(NAME_KEY, cleanName)
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()))
    } catch {
      /* stockage indisponible : sans conséquence */
    }
    setComments((prev) => [...prev, data as PostComment])
    onUpdate(post.id, (p) => ({ comment_count: p.comment_count + 1 }))
    setText('')
  }

  const share = async () => {
    const url = `${window.location.origin}/#post-${post.id}`
    let done = false
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({
          title: 'HEAVEN ROYAL STUDIO PROD',
          text: (post.content ?? '').slice(0, 120),
          url,
        })
        done = true
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        setShareNote('Lien copié ✅')
        setTimeout(() => setShareNote(''), 2500)
        done = true
      }
    } catch {
      /* partage annulé par le visiteur : on ne compte rien */
    }
    if (done) {
      onUpdate(post.id, (p) => ({ share_count: p.share_count + 1 }))
      supabase.rpc('register_share', { p_post_id: post.id, p_visitor_id: visitorId }).then(() => {})
    }
  }

  const imgs = post.image_paths
  const single = imgs.length === 1

  return (
    <article id={`post-${post.id}`} ref={cardRef} style={styles.card}>
      <p style={styles.date}>{formatDate(post.created_at)}</p>
      {post.content && <p style={styles.content}>{post.content}</p>}

      {imgs.length > 0 && (
        <div style={single ? styles.imagesSingle : styles.imagesGrid}>
          {imgs.map((path, i) => {
            const src = imageUrl(path)
            const wide = !single && imgs.length % 2 === 1 && i === 0
            return (
              <button
                key={path}
                onClick={() => onOpenImage(src)}
                aria-label="Agrandir la photo"
                style={{ ...styles.imgButton, ...(wide ? { gridColumn: '1 / -1' } : {}) }}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  style={single ? styles.imgSingle : { ...styles.imgGrid, aspectRatio: wide ? '16 / 9' : '1 / 1' }}
                />
              </button>
            )
          })}
        </div>
      )}

      <div style={styles.actions}>
        <button
          onClick={toggleLike}
          aria-pressed={post.liked_by_me}
          aria-label="J'aime"
          style={{ ...styles.actionBtn, ...(post.liked_by_me ? styles.actionBtnLiked : {}) }}
        >
          <HeartIcon filled={post.liked_by_me} />
          <span>{post.like_count}</span>
        </button>
        <button onClick={toggleComments} aria-label="Commentaires" style={styles.actionBtn}>
          <CommentIcon />
          <span>{post.comment_count}</span>
        </button>
        <button onClick={share} aria-label="Partager" style={styles.actionBtn}>
          <ShareIcon />
          <span>{post.share_count}</span>
        </button>
        {shareNote && <span style={styles.shareNote}>{shareNote}</span>}
      </div>

      {showComments && (
        <div style={styles.commentsBox}>
          {loadingComments ? (
            <p style={styles.hint}>Chargement...</p>
          ) : comments.length === 0 ? (
            <p style={styles.hint}>Aucun commentaire pour l'instant. Sois le premier !</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} style={styles.comment}>
                <p style={styles.commentAuthor}>
                  {c.author_name} <span style={styles.commentDate}>· {formatDate(c.created_at)}</span>
                </p>
                <p style={styles.commentText}>{c.content}</p>
              </div>
            ))
          )}

          <form onSubmit={submitComment} style={styles.form}>
            <input
              type="text"
              placeholder="Ton nom"
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="Écris un commentaire..."
              value={text}
              maxLength={1000}
              rows={3}
              onChange={(e) => setText(e.target.value)}
              style={styles.textarea}
            />
            {notice && <p style={styles.notice}>{notice}</p>}
            <button type="submit" disabled={sending} style={styles.sendBtn}>
              {sending ? 'Envoi...' : 'Commenter'}
            </button>
          </form>
        </div>
      )}
    </article>
  )
}

function PostsFeed() {
  const [visitorId] = useState(getVisitorId)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const { data, error } = await supabase.rpc('get_posts_with_stats', { p_visitor_id: visitorId })
      if (cancelled) return
      if (error) {
        console.error('Publications :', error.message)
      } else {
        setPosts(
          ((data ?? []) as Post[]).map((p) => ({
            ...p,
            like_count: Number(p.like_count),
            comment_count: Number(p.comment_count),
            share_count: Number(p.share_count),
          }))
        )
      }
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [visitorId])

  // Lien partagé (#post-xxx) : on amène le visiteur directement sur la publication
  useEffect(() => {
    if (loading) return
    const hash = window.location.hash
    if (hash.startsWith('#post-')) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [loading])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const updatePost = (id: string, fn: (p: Post) => Partial<Post>) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...fn(p) } : p)))

  if (loading || posts.length === 0) return null

  return (
    <section id="actualites" style={styles.section}>
      <h2 style={styles.title}>Actualités</h2>
      <p style={styles.subtitle}>Les dernières publications du studio</p>

      <div style={styles.list}>
        {posts.slice(0, visibleCount).map((post) => (
          <PostCard key={post.id} post={post} visitorId={visitorId} onUpdate={updatePost} onOpenImage={setLightbox} />
        ))}
      </div>

      {visibleCount < posts.length && (
        <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} style={styles.moreBtn}>
          Voir plus de publications
        </button>
      )}

      {lightbox && (
        <div style={styles.lightbox} onClick={() => setLightbox(null)}>
          <button style={styles.lightboxClose} onClick={() => setLightbox(null)} aria-label="Fermer">
            ✕
          </button>
          <img src={lightbox} alt="" style={styles.lightboxImg} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    width: '100%',
    maxWidth: '640px',
    margin: '0 auto',
    padding: '2rem 1.5rem 3rem',
    textAlign: 'center',
  },
  title: { fontSize: 'clamp(1.6rem, 3.500vw, 2.200rem)', fontWeight: 800, margin: '0 0 0.5rem 0' },
  subtitle: { color: '#94A3B8', margin: '0 0 1.5rem 0' },
  list: { display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' },
  card: {
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '16px',
    padding: '1.1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  date: { color: '#94A3B8', fontSize: '0.75rem', margin: 0 },
  content: { margin: 0, fontSize: '0.95rem', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#E2E8F0' },
  imagesSingle: { display: 'block' },
  imagesGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' },
  imgButton: { padding: 0, border: 'none', background: 'none', cursor: 'pointer', display: 'block', width: '100%' },
  imgSingle: {
    width: '100%',
    maxHeight: '520px',
    objectFit: 'contain',
    borderRadius: '10px',
    backgroundColor: 'rgba(0,0,0,0.25)',
    display: 'block',
  },
  imgGrid: { width: '100%', objectFit: 'cover', borderRadius: '10px', display: 'block' },
  actions: { display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.5rem 0.95rem',
    borderRadius: '999px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'transparent',
    color: '#CBD5E1',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  actionBtnLiked: { borderColor: 'rgba(244, 114, 182, 0.5)', color: '#F472B6' },
  shareNote: { color: '#4ADE80', fontSize: '0.8rem' },
  commentsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(148, 163, 184, 0.15)',
  },
  hint: { color: '#94A3B8', fontSize: '0.82rem', margin: 0 },
  comment: { padding: '0.6rem 0.75rem', borderRadius: '10px', backgroundColor: 'rgba(15, 23, 42, 0.5)' },
  commentAuthor: { margin: 0, fontSize: '0.82rem', fontWeight: 700 },
  commentDate: { color: '#94A3B8', fontWeight: 400 },
  commentText: { margin: '0.25rem 0 0 0', fontSize: '0.88rem', color: '#CBD5E1', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' },
  input: {
    padding: '0.65rem 0.85rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#FFFFFF',
    fontSize: '0.9rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.65rem 0.85rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#FFFFFF',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  notice: { color: '#FBBF24', fontSize: '0.8rem', margin: 0 },
  sendBtn: {
    padding: '0.65rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
  },
  moreBtn: {
    marginTop: '1.25rem',
    padding: '0.7rem 1.4rem',
    borderRadius: '999px',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontSize: '0.88rem',
    cursor: 'pointer',
  },
  lightbox: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  lightboxImg: { maxWidth: '94vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: '8px' },
  lightboxClose: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(0, 0, 0, 0.5)',
    color: '#FFFFFF',
    fontSize: '1.1rem',
    cursor: 'pointer',
  },
}

export default PostsFeed
