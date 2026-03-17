import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, ChevronLeft, ChevronRight, TrendingDown, BarChart2, Tag, Percent } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { watchlists as api } from '../lib/api'
import ListingCard from '../components/ListingCard'
import { SkeletonCard } from '../components/Skeleton'

function formatCurrency(n, currency = 'AUD') {
  if (n == null) return '—'
  const sym = { AUD: 'A$', USD: '$', GBP: '£', EUR: '€' }[currency] || '$'
  return `${sym}${Number(n).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export default function Watchlists() {
  const { token, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [list, setList]         = useState([])
  const [selected, setSelected] = useState(null)
  const [matches, setMatches]   = useState(null)
  const [matchPage, setMatchPage] = useState(0)
  const [listLoading, setListLoading]   = useState(true)
  const [matchLoading, setMatchLoading] = useState(false)
  const [listError, setListError]       = useState(null)
  const [matchError, setMatchError]     = useState(null)

  // Create form
  const [showCreate, setShowCreate] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [newThreshold, setNewThreshold] = useState(15)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    loadWatchlists()
  }, [isLoggedIn])

  useEffect(() => {
    if (!selected) return
    loadMatches(selected.id, 0)
  }, [selected])

  async function loadWatchlists() {
    setListLoading(true)
    setListError(null)
    try {
      const data = await api.list(token)
      setList(data)
      if (data.length > 0 && !selected) setSelected(data[0])
    } catch (e) {
      setListError(e.message)
    } finally {
      setListLoading(false)
    }
  }

  async function loadMatches(id, page) {
    setMatchLoading(true)
    setMatchError(null)
    setMatchPage(page)
    try {
      const data = await api.matches(id, { page, size: 20 }, token)
      setMatches(data)
    } catch (e) {
      setMatchError(e.message)
    } finally {
      setMatchLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newKeyword.trim()) return
    setCreating(true)
    setCreateError('')
    try {
      const wl = await api.create(newKeyword.trim(), Number(newThreshold), token)
      setList(prev => [...prev, wl])
      setNewKeyword('')
      setNewThreshold(15)
      setShowCreate(false)
      setSelected(wl)
    } catch (e) {
      setCreateError(e.message || 'Failed to create watchlist.')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id) {
    await api.delete(id, token)
    const updated = list.filter(w => w.id !== id)
    setList(updated)
    if (selected?.id === id) {
      const next = updated[0] ?? null
      setSelected(next)
      if (!next) setMatches(null)
    }
  }

  const selectedWl = list.find(w => w.id === selected?.id)
  const matchItems = matches?.matches ?? []
  const totalPages = matches?.totalPages ?? 0

  return (
    <div className="watchlists-page">

      {/* ── Sidebar ── */}
      <aside className="wl-sidebar">
        <div className="wl-sidebar-header">
          <h2 className="wl-sidebar-title">Watchlists</h2>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowCreate(v => !v)}
          >
            {showCreate ? <X size={14} strokeWidth={2} /> : <><Plus size={14} strokeWidth={2} /> New</>}
          </button>
        </div>

        {showCreate && (
          <form className="wl-create-form" onSubmit={handleCreate}>
            <input
              className="field-input"
              type="text"
              placeholder="Keyword (e.g. RTX 4080)"
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              required
              autoFocus
            />
            <div className="wl-threshold-row">
              <label className="field-label">Threshold</label>
              <div className="wl-threshold-input-row">
                <input
                  className="field-input wl-threshold-input"
                  type="number"
                  min={1}
                  max={90}
                  value={newThreshold}
                  onChange={e => setNewThreshold(e.target.value)}
                />
                <span className="wl-threshold-pct">%</span>
              </div>
            </div>
            <p className="wl-threshold-hint">
              Match listings priced {newThreshold}% or more below market average.
            </p>
            {createError && <p className="field-error">{createError}</p>}
            <button className="btn btn-primary btn-sm btn-block" type="submit" disabled={creating}>
              {creating ? 'Creating…' : 'Create watchlist'}
            </button>
          </form>
        )}

        <div className="wl-list">
          {listLoading && (
            <p className="wl-loading">Loading…</p>
          )}
          {listError && (
            <p className="field-error">{listError}</p>
          )}
          {!listLoading && list.length === 0 && !listError && (
            <p className="wl-empty">No watchlists yet. Create one above.</p>
          )}
          {list.map(wl => (
            <div
              key={wl.id}
              className={`wl-item${wl.id === selected?.id ? ' wl-item--active' : ''}`}
            >
              <button
                className="wl-item-btn"
                onClick={() => setSelected(wl)}
              >
                <span className="wl-item-keyword">{wl.keyword}</span>
                <span className="wl-item-threshold">below {wl.percentageThreshold}%</span>
              </button>
              <button
                className="wl-item-delete"
                onClick={() => handleDelete(wl.id)}
                title="Delete"
              >
                <X size={13} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="wl-main">
        {!selected ? (
          <div className="page-state">
            <p className="page-state-title">Select a watchlist</p>
            <p className="page-state-body">Create a watchlist to start tracking deals.</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            {matches && (
              <div className="wl-summary">
                <div className="wl-summary-stat">
                  <Tag size={12} strokeWidth={1.75} className="wl-summary-icon" />
                  <span className="wl-summary-val">{matches.keyword}</span>
                  <span className="wl-summary-label">Keyword</span>
                </div>
                <div className="wl-summary-stat">
                  <TrendingDown size={12} strokeWidth={1.75} className="wl-summary-icon wl-summary-icon--deal" />
                  <span className="wl-summary-val">{matches.totalMatchCount.toLocaleString()}</span>
                  <span className="wl-summary-label">Deals found</span>
                </div>
                <div className="wl-summary-stat">
                  <BarChart2 size={12} strokeWidth={1.75} className="wl-summary-icon" />
                  <span className="wl-summary-val">{formatCurrency(matches.averagePrice)}</span>
                  <span className="wl-summary-label">Market average</span>
                </div>
                <div className="wl-summary-stat">
                  <TrendingDown size={12} strokeWidth={1.75} className="wl-summary-icon wl-summary-icon--deal" />
                  <span className="wl-summary-val wl-summary-val--deal">{formatCurrency(matches.cutoffPrice)}</span>
                  <span className="wl-summary-label">Cutoff price</span>
                </div>
                <div className="wl-summary-stat">
                  <Percent size={12} strokeWidth={1.75} className="wl-summary-icon" />
                  <span className="wl-summary-val">{matches.percentageThreshold}%</span>
                  <span className="wl-summary-label">Threshold</span>
                </div>
              </div>
            )}

            {/* Matches grid */}
            {matchLoading && (
              <div className="listings-grid">
                {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {matchError && (
              <div className="page-state">
                <p className="page-state-title">Could not load matches</p>
                <p className="page-state-body">{matchError}</p>
                <button className="btn btn-secondary" onClick={() => loadMatches(selected.id, matchPage)}>Retry</button>
              </div>
            )}

            {!matchLoading && !matchError && matchItems.length === 0 && (
              <div className="page-state">
                <p className="page-state-title">No deals found</p>
                <p className="page-state-body">
                  No listings match "{selectedWl?.keyword}" at {selectedWl?.percentageThreshold}% below market.
                  Try lowering the threshold or waiting for new listings to be ingested.
                </p>
              </div>
            )}

            {!matchLoading && !matchError && matchItems.length > 0 && (
              <>
                <div className="listings-grid">
                  {matchItems.map(l => (
                    <ListingCard
                      key={l.id}
                      listing={l}
                      avgPrice={matches?.averagePrice}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={matchPage === 0}
                      onClick={() => loadMatches(selected.id, matchPage - 1)}
                    >
                      <ChevronLeft size={14} strokeWidth={1.75} /> Prev
                    </button>
                    <span className="pagination-info">{matchPage + 1} / {totalPages}</span>
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={matchPage >= totalPages - 1}
                      onClick={() => loadMatches(selected.id, matchPage + 1)}
                    >
                      Next <ChevronRight size={14} strokeWidth={1.75} />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
