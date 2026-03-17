import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useState, useRef } from 'react'
import { Info } from 'lucide-react'

const CURRENCY_SYMBOLS = { AUD: 'A$', USD: '$', GBP: '£', EUR: '€', CAD: 'C$' }

const SOURCE_LABELS = {
  facebook_marketplace: 'Facebook Marketplace',
  gumtree:              'Gumtree',
  ebay:                 'eBay',
  craigslist:           'Craigslist',
}

export function formatSource(source) {
  return SOURCE_LABELS[source] || (source?.replace(/_/g, ' ') ?? 'Marketplace')
}

export function formatCurrency(price, currency) {
  if (price == null) return 'POA'
  const sym = CURRENCY_SYMBOLS[currency] || currency || '$'
  return `${sym}${Number(price).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function relativeDate(dateStr) {
  if (!dateStr) return ''
  const d    = new Date(dateStr)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(diff / 3.6e6)
  const days = Math.floor(diff / 8.64e7)
  if (mins < 2)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hrs  < 24)  return `${hrs}h ago`
  if (days === 1) return 'yesterday'
  if (days < 30)  return `${days}d ago`
  return d.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
}

function SourceInfo({ source }) {
  const [coords, setCoords] = useState(null)
  const ref = useRef()

  function handleEnter() {
    const r = ref.current.getBoundingClientRect()
    setCoords({ x: r.left + r.width / 2, y: r.top })
  }

  return (
    <>
      <span
        ref={ref}
        className="source-info"
        onMouseEnter={handleEnter}
        onMouseLeave={() => setCoords(null)}
      >
        <Info size={13} strokeWidth={1.75} />
      </span>

      {coords && createPortal(
        <div
          className="tooltip-portal"
          style={{ position: 'fixed', left: coords.x, top: coords.y - 8 }}
        >
          {formatSource(source)}
        </div>,
        document.body
      )}
    </>
  )
}

export default function ListingCard({ listing }) {
  const { id, title, price, currency, location, imageUrl, source, sourceCity, lastSeen } = listing
  const displayLoc = sourceCity || location

  return (
    <Link to={`/listings/${id}`} state={{ listing }} className="listing-card">
      <div className="listing-card-img">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="listing-card-img-fallback" style={{ display: imageUrl ? 'none' : 'flex' }}>
          <span className="listing-card-img-initial">{formatSource(source).charAt(0)}</span>
        </div>
      </div>

      <div className="listing-card-body">
        <div className="listing-card-title-row">
          <p className="listing-card-title">{title}</p>
          <span className="listing-card-age">{relativeDate(lastSeen)}</span>
        </div>

        <p className="listing-card-price">{formatCurrency(price, currency)}</p>

        <div className="listing-card-meta">
          {displayLoc
            ? <span className="listing-card-loc">{displayLoc}</span>
            : <span />
          }
          <SourceInfo source={source} />
        </div>
      </div>
    </Link>
  )
}
