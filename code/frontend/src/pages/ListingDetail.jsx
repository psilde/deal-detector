import { useLocation, useNavigate } from 'react-router-dom'
import { formatSource, formatCurrency, relativeDate } from '../components/ListingCard'

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-AU', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function ListingDetail() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const listing   = state?.listing

  if (!listing) {
    return (
      <div className="page-container">
        <div className="page-state">
          <p className="page-state-title">Listing not found</p>
          <p className="page-state-body">Navigate from Browse to view a listing.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>Back to Browse</button>
        </div>
      </div>
    )
  }

  const {
    title, price, currency, location, imageUrl,
    source, sourceCity, sourceCategory,
    url, firstSeen,
  } = listing

  const meta = [
    { key: 'Location',   val: location || sourceCity },
    { key: 'City',       val: sourceCity !== location ? sourceCity : null },
    { key: 'Category',   val: sourceCategory },
    { key: 'Source',     val: formatSource(source) },
    { key: 'First seen', val: formatDateTime(firstSeen) },
  ].filter(r => r.val)

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <span>←</span> Browse
      </button>

      <div className="detail-layout">
        {/* Image */}
        <div className="detail-image-col">
          {imageUrl ? (
            <img className="detail-image" src={imageUrl} alt={title} />
          ) : (
            <div className="detail-image-placeholder">
              <span>{formatSource(source)}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info-col">
          <span className="source-badge detail-source-badge">{formatSource(source)}</span>

          <h1 className="detail-title">{title}</h1>

          <p className="detail-price">{formatCurrency(price, currency)}</p>

          <table className="detail-meta-table">
            <tbody>
              {meta.map(row => (
                <tr key={row.key} className="detail-meta-row">
                  <td className="detail-meta-key">{row.key}</td>
                  <td className="detail-meta-val">{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary detail-cta"
            >
              View on {formatSource(source)} →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
