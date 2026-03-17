import { MapPinIcon, ArrowUpRightIcon, TrendDownIcon, StorefrontIcon } from '@phosphor-icons/react'

const CURRENCY_SYMBOLS = { GBP: '£', USD: '$', EUR: '€', AUD: 'A$', CAD: 'C$' }

function formatPrice(price, currency) {
  const symbol = CURRENCY_SYMBOLS[currency] || currency || '£'
  return `${symbol}${Number(price).toLocaleString()}`
}

function formatSource(source) {
  if (!source) return null
  return source.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null
  const diffDays = Math.floor((Date.now() - date) / 86400000)
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

function Listing({ title, price, currency, location, imageUrl, source, url, lastSeen, discountPercentage, savings }) {
  const isDeal = discountPercentage != null && discountPercentage > 0
  const displayDate = formatDate(lastSeen)
  const displaySource = formatSource(source)

  return (
    <article className={`listing-card${isDeal ? ' listing-card--deal' : ''}`}>
      {imageUrl && (
        <div className="listing-image">
          <img src={imageUrl} alt={title} loading="lazy" />
        </div>
      )}

      <div className="listing-body">
        <h3 className="listing-card-title">{title}</h3>

        <div className="listing-meta-row">
          {(location || displaySource) && (
            <span className="listing-meta-item">
              <MapPinIcon size={11} weight="regular" />
              <span>{location || displaySource}</span>
            </span>
          )}
          {displaySource && (
            <span className="listing-meta-item listing-source">
              <StorefrontIcon size={11} weight="regular" />
              <span>{displaySource}</span>
            </span>
          )}
          {displayDate && (
            <span className="listing-meta-item listing-freshness">
              {displayDate}
            </span>
          )}
        </div>

        <a className="listing-link" href={url} target="_blank" rel="noopener noreferrer">
          View listing
          <ArrowUpRightIcon size={11} weight="regular" />
        </a>
      </div>

      <div className="listing-price-block">
        <div className="listing-price-row">
          <span className="listing-price-value">{formatPrice(price, currency)}</span>
          {isDeal && (
            <span className="deal-badge">
              <TrendDownIcon size={10} weight="bold" />
              -{discountPercentage}%
            </span>
          )}
        </div>
        {isDeal && savings != null && (
          <span className="listing-market-ref">save {formatPrice(savings, currency)}</span>
        )}
      </div>
    </article>
  )
}

export default Listing
