// Même clé que celle utilisée pour les statistiques de visite
export function getVisitorId(): string {
  const key = 'hrs_visitor_id'
  try {
    let id = localStorage.getItem(key)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(key, id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}
