export function SkeletonCard() {
  return (
    <div className="listing-card skeleton-card" aria-hidden="true">
      <div className="listing-card-img skeleton" />
      <div className="listing-card-body">
        <div className="skeleton skeleton-line" style={{ width: '85%', height: 14, marginBottom: 6 }} />
        <div className="skeleton skeleton-line" style={{ width: '60%', height: 14, marginBottom: 12 }} />
        <div className="skeleton skeleton-line" style={{ width: '40%', height: 20, marginBottom: 10 }} />
        <div className="skeleton skeleton-line" style={{ width: '55%', height: 11 }} />
      </div>
    </div>
  )
}

export function SkeletonText({ width = '100%', height = 14 }) {
  return <div className="skeleton" style={{ width, height, borderRadius: 3 }} />
}
