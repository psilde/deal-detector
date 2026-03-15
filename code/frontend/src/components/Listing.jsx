import { Clock3, MapPin, ArrowUpRight, TrendingDown } from 'lucide-react'

function formatCreatedAt(createdAt) {
  if (!createdAt) return 'Recently added'

  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return 'Recently added'
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function Listing({ title, price, location, url, createdAt, imageUrl, marketAverage, discountPercentage, savings }) {
  const isDeal = discountPercentage != null && discountPercentage > 0

  return (
    <article className={`listing-card${isDeal ? ' listing-card--deal' : ''}`}>
      <div className="listing-image-wrap">
        {isDeal && (
          <div className="deal-badge">
            <TrendingDown size={12} strokeWidth={2.5} />
            <span>{discountPercentage}% below market</span>
          </div>
        )}
        {imageUrl ? (
          <div className="listing-image">
            <img src={imageUrl} alt={title} />
          </div>
        ) : (
          <div className="listing-image-placeholder">
            <span className="listing-image-placeholder-text">No image available</span>
          </div>
        )}
      </div>

      <div className="listing-body">
        <h3 className="listing-card-title">{title}</h3>

        <div className="listing-meta-row">
          <span className="listing-meta-item">
            <Clock3 size={14} strokeWidth={2} />
            <span>{formatCreatedAt(createdAt)}</span>
          </span>
        </div>

        <p className="listing-price-row">${Number(price).toLocaleString()}</p>

        {isDeal && (
          <div className="listing-market-info">
            <span className="listing-market-avg">Market avg: ${Number(marketAverage).toLocaleString()}</span>
            <span className="listing-savings">Save ${Number(savings).toLocaleString()}</span>
          </div>
        )}

        <div className="listing-location-row">
          <MapPin size={14} strokeWidth={2} />
          <span>{location || 'Location unavailable'}</span>
        </div>

        <a
          className="listing-link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>View listing</span>
          <ArrowUpRight size={15} strokeWidth={2} />
        </a>
      </div>
    </article>
  )
}

export default Listing
