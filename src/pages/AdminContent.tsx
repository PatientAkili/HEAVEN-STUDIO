import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackgroundDecor from '../components/BackgroundDecor'

interface Plan {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  popular: boolean
  sort_order: number
}

interface PlanDraft extends Plan {
  featuresText: string
  dirty: boolean
}

interface Work {
  id: string
  title: string
  category: string
  image_path: string | null
  static_src: string | null
  sort_order: number
}

const SUGGESTED_CATEGORIES = ['Studio', 'Événementiel', 'Design', 'Portraits', 'Corporate', 'Mode & Beauté', 'Lifestyle']
const MAX_ORIGINAL_BYTES = 2.5 * 1024 * 1024
const MAX_SIDE = 2400
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

const errorText = (err: unknown) => (err as { message?: string })?.message ?? String(err)

const toDraft = (p: Plan): PlanDraft => ({
  ...p,
  features: p.features ?? [],
  featuresText: (p.features ?? []).join('\n'),
  dirty: false,
})

const workSrc = (w: Work) =>
  w.image_path ? supabase.storage.from('portfolio').getPublicUrl(w.image_path).data.publicUrl : (w.static_src ?? '')

function resizeToWebp(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) resolve(blob)
          else reject(new Error("Échec du traitement de l'image"))
        },
        'image/webp',
        0.92
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image illisible'))
    }
    img.src = url
  })
}

// Une image légère (≤ 2,5 Mo) est envoyée telle quelle, sans aucune retouche.
// Une image plus lourde est réduite à 2400 px max (qualité visuellement identique à l'écran).
async function prepareImage(file: File): Promise<{ blob: Blob; ext: string }> {
  const ext = EXT_BY_TYPE[file.type]
  if (ext && file.size <= MAX_ORIGINAL_BYTES) return { blob: file, ext }
  const blob = await resizeToWebp(file)
  return { blob, ext: 'webp' }
}

function AdminContent() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'tarifs' | 'portfolio'>('tarifs')
  const [message, setMessage] = useState('')

  const [plans, setPlans] = useState<PlanDraft[]>([])
  const [savingId, setSavingId] = useState('')

  const [works, setWorks] = useState<Work[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [category, setCategory] = useState('Design')
  const [title, setTitle] = useState('')
  const [fileKey, setFileKey] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState('')

  const loadPlans = async () => {
    const { data, error } = await supabase.from('tariff_plans').select('*').order('sort_order', { ascending: true })
    if (error) {
      setMessage('Erreur de chargement des offres : ' + error.message)
      return
    }
    setPlans(((data ?? []) as Plan[]).map(toDraft))
  }

  const loadWorks = async () => {
    const { data, error } = await supabase
      .from('portfolio_works')
      .select('*')
      .order('sort_order', { ascending: false })
      .order('created_at', { ascending: false })
    if (error) {
      setMessage('Erreur de chargement du portfolio : ' + error.message)
      return
    }
    setWorks((data ?? []) as Work[])
  }

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      const { data: isAdmin } = data.session ? await supabase.rpc('is_admin') : { data: false }
      if (!data.session || isAdmin !== true) {
        navigate('/admin/connexion')
        return
      }
      await Promise.all([loadPlans(), loadWorks()])
      setLoading(false)
    }
    init()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/connexion')
  }

  // ---------- Tarifs ----------
  const updateDraft = (id: string, patch: Partial<PlanDraft>) =>
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch, dirty: true } : p)))

  const savePlan = async (plan: PlanDraft) => {
    const name = plan.name.trim()
    const price = plan.price.trim()
    if (!name || !price) {
      setMessage('Le nom et le prix sont obligatoires.')
      return
    }
    const description = plan.description.trim()
    const features = plan.featuresText.split('\n').map((l) => l.trim()).filter(Boolean)

    setSavingId(plan.id)
    setMessage('')
    const { data, error } = await supabase
      .from('tariff_plans')
      .update({ name, price, description, features, popular: plan.popular })
      .eq('id', plan.id)
      .select('id')
    setSavingId('')

    if (error || !data || data.length === 0) {
      setMessage('Erreur : ' + (error ? error.message : 'aucune modification enregistrée (droits administrateur ?)'))
      return
    }
    setPlans((prev) =>
      prev.map((p) =>
        p.id === plan.id ? { ...p, name, price, description, features, featuresText: features.join('\n'), dirty: false } : p
      )
    )
    setMessage(`✅ Offre « ${name} » enregistrée.`)
  }

  const addPlan = async () => {
    const nextOrder = plans.reduce((m, p) => Math.max(m, p.sort_order), 0) + 1
    const { data, error } = await supabase
      .from('tariff_plans')
      .insert({ name: 'Nouvelle offre', price: '0 $', description: '', features: [], popular: false, sort_order: nextOrder })
      .select('*')
      .single()
    if (error || !data) {
      setMessage('Erreur : ' + (error ? error.message : "impossible d'ajouter l'offre"))
      return
    }
    setPlans((prev) => [...prev, toDraft(data as Plan)])
    setMessage('Nouvelle offre ajoutée : modifie-la puis clique sur Enregistrer.')
  }

  const deletePlan = async (plan: PlanDraft) => {
    if (!confirm(`Supprimer l'offre « ${plan.name} » ?`)) return
    const { data, error } = await supabase.from('tariff_plans').delete().eq('id', plan.id).select('id')
    if (error || !data || data.length === 0) {
      setMessage('Erreur : ' + (error ? error.message : 'suppression impossible (droits administrateur ?)'))
      return
    }
    setPlans((prev) => prev.filter((p) => p.id !== plan.id))
    setMessage('✅ Offre supprimée.')
  }

  const movePlan = async (index: number, dir: -1 | 1) => {
    const a = plans[index]
    const b = plans[index + dir]
    if (!a || !b) return
    const [r1, r2] = await Promise.all([
      supabase.from('tariff_plans').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('tariff_plans').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
    const failure = r1.error ?? r2.error
    if (failure) {
      setMessage('Erreur : ' + failure.message)
      await loadPlans()
      return
    }
    setPlans((prev) => {
      const next = [...prev]
      next[index] = { ...b, sort_order: a.sort_order }
      next[index + dir] = { ...a, sort_order: b.sort_order }
      return next
    })
  }

  // ---------- Portfolio ----------
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/')))
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const cat = category.trim()
    if (!cat) {
      setMessage('Choisis ou écris une catégorie.')
      return
    }
    if (files.length === 0) {
      setMessage('Ajoute au moins une photo.')
      return
    }

    setUploading(true)
    const base = works.reduce((m, w) => Math.max(m, w.sort_order), 0)
    let ok = 0
    let failure = ''

    for (let i = 0; i < files.length; i++) {
      setMessage(`Envoi ${i + 1}/${files.length}...`)
      let uploadedPath = ''
      try {
        const { blob, ext } = await prepareImage(files[i])
        const path = `${crypto.randomUUID()}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('portfolio')
          .upload(path, blob, { contentType: blob.type || 'image/jpeg' })
        if (upErr) throw upErr
        uploadedPath = path
        const { error: insErr } = await supabase
          .from('portfolio_works')
          .insert({ title: title.trim(), category: cat, image_path: path, sort_order: base + files.length - i })
        if (insErr) throw insErr
        ok++
      } catch (err) {
        if (uploadedPath) await supabase.storage.from('portfolio').remove([uploadedPath])
        failure = `Erreur sur « ${files[i].name} » : ${errorText(err)}`
        break
      }
    }

    setUploading(false)
    setFiles([])
    setTitle('')
    setFileKey((k) => k + 1)
    await loadWorks()
    setMessage(failure ? `${ok}/${files.length} photo(s) ajoutée(s). ${failure}` : `✅ ${ok} photo(s) ajoutée(s) au portfolio.`)
  }

  const updateWork = async (id: string, field: 'category' | 'title', raw: string) => {
    const current = works.find((w) => w.id === id)
    if (!current) return
    const value = raw.trim()
    if (field === 'category' && !value) return
    if (value === current[field]) return

    const payload = field === 'category' ? { category: value } : { title: value }
    const { data, error } = await supabase.from('portfolio_works').update(payload).eq('id', id).select('id')
    if (error || !data || data.length === 0) {
      setMessage('Erreur : ' + (error ? error.message : 'modification impossible (droits administrateur ?)'))
      return
    }
    setWorks((prev) =>
      prev.map((w) => (w.id === id ? (field === 'category' ? { ...w, category: value } : { ...w, title: value }) : w))
    )
  }

  const deleteWork = async (w: Work) => {
    if (!confirm('Supprimer cette photo du portfolio ?')) return
    setDeletingId(w.id)
    if (w.image_path) await supabase.storage.from('portfolio').remove([w.image_path])
    const { data, error } = await supabase.from('portfolio_works').delete().eq('id', w.id).select('id')
    setDeletingId('')
    if (error || !data || data.length === 0) {
      setMessage('Erreur : ' + (error ? error.message : 'suppression impossible (droits administrateur ?)'))
      return
    }
    setWorks((prev) => prev.filter((x) => x.id !== w.id))
    setMessage('✅ Photo supprimée du portfolio.')
  }

  const categoryOptions = Array.from(new Set([...SUGGESTED_CATEGORIES, ...works.map((w) => w.category)]))

  if (loading) {
    return <p style={{ color: '#fff', padding: '2rem' }}>Chargement...</p>
  }

  return (
    <div style={styles.page}>
      <BackgroundDecor />
      <Navbar mode="admin" homeTo="/admin" label="Espace Admin" onLogout={handleLogout} />

      <main style={styles.main}>
        <h1 style={styles.title}>Contenu du site</h1>

        <div style={styles.tabs}>
          <button onClick={() => setTab('tarifs')} style={{ ...styles.tab, ...(tab === 'tarifs' ? styles.tabActive : {}) }}>
            Tarifs
          </button>
          <button onClick={() => setTab('portfolio')} style={{ ...styles.tab, ...(tab === 'portfolio' ? styles.tabActive : {}) }}>
            Portfolio
          </button>
        </div>

        {message && <p style={styles.message}>{message}</p>}

        {tab === 'tarifs' && (
          <section style={styles.list}>
            {plans.length === 0 && <p style={styles.hint}>Aucune offre. Ajoutes-en une ci-dessous.</p>}

            {plans.map((p, i) => (
              <div key={p.id} style={styles.card}>
                <div style={styles.cardHead}>
                  <strong style={styles.cardName}>{p.name || 'Offre sans nom'}</strong>
                  <div style={styles.row}>
                    <button onClick={() => movePlan(i, -1)} disabled={i === 0} style={styles.smallBtn} aria-label="Monter">↑</button>
                    <button onClick={() => movePlan(i, 1)} disabled={i === plans.length - 1} style={styles.smallBtn} aria-label="Descendre">↓</button>
                  </div>
                </div>

                <label style={styles.label}>Nom de l'offre</label>
                <input value={p.name} onChange={(e) => updateDraft(p.id, { name: e.target.value })} style={styles.input} />

                <label style={styles.label}>Prix (texte libre : 150 $, Sur devis...)</label>
                <input value={p.price} onChange={(e) => updateDraft(p.id, { price: e.target.value })} style={styles.input} />

                <label style={styles.label}>Description courte</label>
                <textarea value={p.description} rows={2} onChange={(e) => updateDraft(p.id, { description: e.target.value })} style={styles.textarea} />

                <label style={styles.label}>Éléments inclus (un par ligne)</label>
                <textarea value={p.featuresText} rows={5} onChange={(e) => updateDraft(p.id, { featuresText: e.target.value })} style={styles.textarea} />

                <label style={styles.check}>
                  <input type="checkbox" checked={p.popular} onChange={(e) => updateDraft(p.id, { popular: e.target.checked })} />
                  <span>Mettre en avant (badge « Le plus choisi »)</span>
                </label>

                <div style={styles.row}>
                  <button onClick={() => savePlan(p)} disabled={!p.dirty || savingId === p.id} style={{ ...styles.button, opacity: p.dirty ? 1 : 0.5 }}>
                    {savingId === p.id ? 'Enregistrement...' : p.dirty ? 'Enregistrer' : 'Enregistré'}
                  </button>
                  <button onClick={() => deletePlan(p)} style={styles.deleteButton}>Supprimer</button>
                </div>
              </div>
            ))}

            <button onClick={addPlan} style={styles.addButton}>+ Ajouter une offre</button>
          </section>
        )}

        {tab === 'portfolio' && (
          <section style={styles.list}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Ajouter des photos</h2>
              <form onSubmit={handleUpload} style={styles.formCol}>
                <label style={styles.label}>Catégorie (choisis ou écris-en une nouvelle)</label>
                <input list="work-categories" value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input} />
                <datalist id="work-categories">
                  {categoryOptions.map((c) => <option key={c} value={c} />)}
                </datalist>

                <label style={styles.label}>Titre (facultatif, appliqué à toutes les photos envoyées)</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />

                <input key={fileKey} type="file" accept="image/*" multiple onChange={handleFiles} style={styles.fileInput} />
                <p style={styles.hint}>
                  Les photos de 2,5 Mo ou moins sont envoyées telles quelles, sans aucune retouche. Les plus lourdes sont réduites à 2400 px pour garder le site rapide.
                </p>
                {files.length > 0 && <p style={styles.hint}>{files.length} photo(s) sélectionnée(s)</p>}

                <button type="submit" disabled={uploading} style={styles.button}>
                  {uploading ? 'Envoi en cours...' : 'Ajouter au portfolio'}
                </button>
              </form>
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Photos du portfolio ({works.length})</h2>
              {works.length === 0 ? (
                <p style={styles.hint}>Aucune photo pour l'instant.</p>
              ) : (
                <div style={styles.workGrid}>
                  {works.map((w) => (
                    <div key={w.id} style={styles.workCard}>
                      <img src={workSrc(w)} alt={w.title} loading="lazy" style={styles.workImg} />
                      {!w.image_path && <span style={styles.badge}>Image du site</span>}
                      <input
                        list="work-categories"
                        defaultValue={w.category}
                        onBlur={(e) => updateWork(w.id, 'category', e.target.value)}
                        aria-label="Catégorie"
                        style={styles.miniInput}
                      />
                      <input
                        defaultValue={w.title}
                        placeholder="Titre"
                        onBlur={(e) => updateWork(w.id, 'title', e.target.value)}
                        aria-label="Titre"
                        style={styles.miniInput}
                      />
                      <button onClick={() => deleteWork(w)} disabled={deletingId === w.id} style={styles.deleteButton}>
                        {deletingId === w.id ? '...' : 'Supprimer'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p style={styles.hint}>
                Les images marquées « Image du site » sont des fichiers du projet : les supprimer ici les retire du portfolio sans effacer le fichier.
              </p>
            </div>
          </section>
        )}
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
    gap: '1.25rem',
  },
  title: { fontSize: '1.5rem', fontWeight: 800, margin: 0 },
  tabs: { display: 'flex', gap: '0.5rem' },
  tab: {
    flex: 1,
    padding: '0.7rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'transparent',
    color: '#94A3B8',
    fontWeight: 600,
    cursor: 'pointer',
  },
  tabActive: {
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    border: 'none',
  },
  message: { color: '#CBD5E1', fontSize: '0.88rem', textAlign: 'center', margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: {
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '16px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' },
  cardName: { fontSize: '1rem' },
  cardTitle: { fontSize: '1.05rem', fontWeight: 700, margin: 0 },
  row: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  label: { fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.25rem' },
  hint: { color: '#94A3B8', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 },
  input: {
    padding: '0.7rem 0.9rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#FFFFFF',
    fontSize: '0.92rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.7rem 0.9rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#FFFFFF',
    fontSize: '0.92rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  check: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#CBD5E1', marginTop: '0.25rem' },
  formCol: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  fileInput: { color: '#94A3B8', fontSize: '0.88rem', marginTop: '0.4rem' },
  button: {
    padding: '0.7rem 1.2rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
  },
  addButton: {
    padding: '0.8rem',
    borderRadius: '12px',
    border: '1px dashed rgba(148, 163, 184, 0.4)',
    backgroundColor: 'transparent',
    color: '#CBD5E1',
    fontWeight: 600,
    cursor: 'pointer',
  },
  smallBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.55rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(248, 113, 113, 0.4)',
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    color: '#F87171',
    fontSize: '0.82rem',
    cursor: 'pointer',
  },
  workGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.9rem' },
  workCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    padding: '0.5rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
  },
  workImg: { width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', borderRadius: '8px', display: 'block' },
  badge: {
    position: 'absolute',
    top: '0.9rem',
    left: '0.9rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '999px',
    backgroundColor: 'rgba(0,0,0,0.65)',
    fontSize: '0.65rem',
    color: '#CBD5E1',
  },
  miniInput: {
    padding: '0.45rem 0.6rem',
    borderRadius: '8px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#FFFFFF',
    fontSize: '0.8rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
}

export default AdminContent
