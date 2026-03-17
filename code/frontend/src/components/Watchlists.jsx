import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon, CrosshairIcon, MagnifyingGlassIcon, TrayIcon } from '@phosphor-icons/react'
import Listing from './Listing'

function Watchlists({ token }) {
  const [watchlists, setWatchlists] = useState([])
  const [selectedWatchlistId, setSelectedWatchlistId] = useState(null)
  const [matches, setMatches] = useState([])
  const [matchPage, setMatchPage] = useState(0)
  const [matchTotalPages, setMatchTotalPages] = useState(0)
  const [totalMatchCount, setTotalMatchCount] = useState(0)
  const [responseAvgPrice, setResponseAvgPrice] = useState(0)
  const [responseCutoffPrice, setResponseCutoffPrice] = useState(0)
  const [responseThreshold, setResponseThreshold] = useState(0)
  const [responseKeyword, setResponseKeyword] = useState('')

  const [keyword, setKeyword] = useState('')
  const [percentageThreshold, setPercentageThreshold] = useState('')

  const [loadingWatchlists, setLoadingWatchlists] = useState(true)
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')


  async function fetchWatchlists() {
    try {
      setLoadingWatchlists(true)
      setError('')

      const response = await fetch('http://localhost:8080/watchlists', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch watchlists')

      const data = await response.json()
      const loadedWatchlists = data.content ?? data

      setWatchlists(loadedWatchlists)

      if (loadedWatchlists.length > 0 && !selectedWatchlistId) {
        setSelectedWatchlistId(loadedWatchlists[0].id)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoadingWatchlists(false)
    }
  }

  async function fetchMatches(watchlistId, page = 0) {
    setError('')
    const loadingTimer = setTimeout(() => setLoadingMatches(true), 150)

    try {
      const response = await fetch(`http://localhost:8080/watchlists/${watchlistId}/matches?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch matches')

      const data = await response.json()
      setMatches(data.matches ?? [])
      setMatchTotalPages(data.totalPages ?? 0)
      setTotalMatchCount(data.totalMatchCount ?? 0)
      setResponseAvgPrice(data.averagePrice ?? 0)
      setResponseCutoffPrice(data.cutoffPrice ?? 0)
      setResponseThreshold(data.percentageThreshold ?? 0)
      setResponseKeyword(data.keyword ?? '')
    } catch (error) {
      setError(error.message)
    } finally {
      clearTimeout(loadingTimer)
      setLoadingMatches(false)
    }
  }

  async function handleCreateWatchlist(e) {
    e.preventDefault()

    try {
      setCreating(true)
      setError('')

      const response = await fetch('http://localhost:8080/watchlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          keyword,
          percentageThreshold: Number(percentageThreshold)
        })
      })

      if (!response.ok) throw new Error('Failed to create watchlist')

      const createdWatchlist = await response.json()

      setWatchlists((prev) => [...prev, createdWatchlist])
      setSelectedWatchlistId(createdWatchlist.id)
      setKeyword('')
      setPercentageThreshold('')
      setShowCreateForm(false)
    } catch (error) {
      setError(error.message)
    } finally {
      setCreating(false)
    }
  }

  async function handleDeleteWatchlist(id) {
    try {
      setError('')

      const response = await fetch(`http://localhost:8080/watchlists/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to delete watchlist')

      const updatedWatchlists = watchlists.filter((w) => w.id !== id)
      setWatchlists(updatedWatchlists)

      if (selectedWatchlistId === id) {
        if (updatedWatchlists.length > 0) {
          setSelectedWatchlistId(updatedWatchlists[0].id)
        } else {
          setSelectedWatchlistId(null)
          setMatches([])
        }
      }
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => { fetchWatchlists() }, [])

  useEffect(() => {
    if (!selectedWatchlistId) return
    setMatchPage(0)
    fetchMatches(selectedWatchlistId, 0)
  }, [selectedWatchlistId])

  useEffect(() => {
    if (!selectedWatchlistId) return
    fetchMatches(selectedWatchlistId, matchPage)
  }, [matchPage])

  return (
    <div className="watchlists-layout page-enter">
      <aside className="watchlists-sidebar">
        <div className="watchlists-sidebar-panel">
          <div className="watchlists-sidebar-header">
            <h2>Watchlists</h2>
            {watchlists.length > 0 && <p>{watchlists.length} tracked {watchlists.length === 1 ? 'keyword' : 'keywords'}</p>}
          </div>

          {error && <p className="watchlist-error">{error}</p>}

          {loadingWatchlists ? (
            <div className="empty-state-card compact-empty-state">
              <TrayIcon size={17} weight="regular" />
              <div>
                <h3>Loading watchlists</h3>
                <p>Please wait a moment.</p>
              </div>
            </div>
          ) : watchlists.length === 0 ? (
            <div className="empty-state-card compact-empty-state">
              <MagnifyingGlassIcon size={17} weight="regular" />
              <div>
                <h3>No watchlists yet</h3>
                <p>Create one to start tracking deals.</p>
              </div>
            </div>
          ) : (
            <div className="watchlist-list">
              {watchlists.map((watchlist) => (
                <div
                  key={watchlist.id}
                  className={`watchlist-card ${selectedWatchlistId === watchlist.id ? 'active-watchlist' : ''}`}
                >
                  <button
                    className="watchlist-select-button"
                    onClick={() => setSelectedWatchlistId(watchlist.id)}
                  >
                    <span className="watchlist-card-keyword">{watchlist.keyword}</span>
                    <span className="watchlist-card-threshold">
                      <CrosshairIcon size={12} weight="regular" />
                      <span>{watchlist.percentageThreshold}% off</span>
                    </span>
                  </button>

                  <button
                    className="watchlist-delete-button"
                    onClick={() => handleDeleteWatchlist(watchlist.id)}
                    aria-label={`Delete ${watchlist.keyword} watchlist`}
                  >
                    <TrashIcon size={14} weight="regular" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="watchlists-create-area">
            {!showCreateForm ? (
              <button
                className="watchlist-create-toggle"
                onClick={() => setShowCreateForm(true)}
              >
                <PlusIcon size={15} weight="bold" />
                <span>New watchlist</span>
              </button>
            ) : (
              <div className="watchlists-create-panel">
                <h3>New watchlist</h3>

                <form className="watchlist-form" onSubmit={handleCreateWatchlist}>
                  <input
                    className="watchlist-input"
                    type="text"
                    placeholder="Keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    required
                  />

                  <input
                    className="watchlist-input"
                    type="number"
                    placeholder="Discount %"
                    value={percentageThreshold}
                    onChange={(e) => setPercentageThreshold(e.target.value)}
                    min="1"
                    max="90"
                    required
                  />

                  <div className="watchlist-form-actions">
                    <button className="watchlist-submit" type="submit" disabled={creating}>
                      {creating ? 'Creating...' : 'Create'}
                    </button>

                    <button
                      className="watchlist-cancel-button"
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false)
                        setKeyword('')
                        setPercentageThreshold('')
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>

      <section className="watchlists-main">
        <div className="watchlists-matches-panel">
          <div className="watchlists-main-header">
            <h2>Matching Deals</h2>
            {responseKeyword
              ? <p>Listings matching <strong style={{ color: 'var(--text-soft)', fontWeight: 500 }}>{responseKeyword}</strong> below the cutoff price</p>
              : selectedWatchlistId !== null && <p>Loading results…</p>
            }
          </div>

          {selectedWatchlistId === null ? (
            <div className="empty-state-card">
              <MagnifyingGlassIcon size={20} weight="regular" />
              <h3>Select a watchlist</h3>
              <p>Choose a watchlist on the left to view matching deals.</p>
            </div>
          ) : (
            <div key={selectedWatchlistId} className="matches-enter">
              {loadingMatches ? (
                <div className="empty-state-card">
                  <TrayIcon size={20} weight="regular" />
                  <h3>Loading matches</h3>
                  <p>Fetching listings for this watchlist.</p>
                </div>
              ) : matches.length === 0 ? (
                <div className="empty-state-card">
                  <CrosshairIcon size={20} weight="regular" />
                  <h3>No matching deals yet</h3>
                  <p>Try another watchlist or lower the discount threshold.</p>
                </div>
              ) : (
                <>
                  {(() => {
                    const avg = responseAvgPrice
                    const pageDiscounts = avg > 0 ? matches.map(m => Math.round((1 - m.price / avg) * 100)) : []
                    const bestDiscount = pageDiscounts.length > 0 ? Math.max(...pageDiscounts) : null
                    const totalPageSavings = avg > 0 ? matches.reduce((sum, m) => sum + Math.max(0, avg - m.price), 0) : 0
                    return (
                      <div className="watchlist-summary">
                        {responseKeyword && (
                          <div className="watchlist-summary-stat">
                            <span className="watchlist-summary-value watchlist-summary-keyword">{responseKeyword}</span>
                            <span className="watchlist-summary-label">keyword</span>
                          </div>
                        )}
                        <div className="watchlist-summary-stat">
                          <span className="watchlist-summary-value">{totalMatchCount}</span>
                          <span className="watchlist-summary-label">total matches</span>
                        </div>
                        {avg > 0 && (
                          <div className="watchlist-summary-stat">
                            <span className="watchlist-summary-value">${Math.round(avg).toLocaleString()}</span>
                            <span className="watchlist-summary-label">market avg</span>
                          </div>
                        )}
                        {responseCutoffPrice > 0 && (
                          <div className="watchlist-summary-stat">
                            <span className="watchlist-summary-value">${Math.round(responseCutoffPrice).toLocaleString()}</span>
                            <span className="watchlist-summary-label">cutoff price</span>
                          </div>
                        )}
                        {responseThreshold > 0 && (
                          <div className="watchlist-summary-stat">
                            <span className="watchlist-summary-value watchlist-summary-deal">-{responseThreshold}%</span>
                            <span className="watchlist-summary-label">threshold</span>
                          </div>
                        )}
                        {bestDiscount !== null && (
                          <div className="watchlist-summary-stat">
                            <span className="watchlist-summary-value watchlist-summary-deal">-{bestDiscount}%</span>
                            <span className="watchlist-summary-label">best on page</span>
                          </div>
                        )}
                        {totalPageSavings > 0 && (
                          <div className="watchlist-summary-stat">
                            <span className="watchlist-summary-value">${Math.round(totalPageSavings).toLocaleString()}</span>
                            <span className="watchlist-summary-label">page savings</span>
                          </div>
                        )}
                      </div>
                    )
                  })()}

                  <div className="listings-grid">
                    {matches.map((listing) => {
                      const avg = responseAvgPrice
                      const discountPct = avg > 0 ? Math.round((1 - listing.price / avg) * 100) : null
                      const savingsAmt = avg > 0 ? Math.round(avg - listing.price) : null
                      return (
                        <Listing
                          key={listing.id}
                          title={listing.title}
                          price={listing.price}
                          currency={listing.currency}
                          location={listing.location || listing.sourceCity}
                          imageUrl={listing.imageUrl}
                          source={listing.source}
                          url={listing.url}
                          lastSeen={listing.lastSeen || listing.scrapedAt}
                          discountPercentage={discountPct}
                          savings={savingsAmt}
                        />
                      )
                    })}
                  </div>

                  {matchTotalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-btn"
                        onClick={() => setMatchPage(p => p - 1)}
                        disabled={matchPage === 0}
                      >
                        Previous
                      </button>
                      <span className="pagination-info">
                        Page {matchPage + 1} of {matchTotalPages}
                      </span>
                      <button
                        className="pagination-btn"
                        onClick={() => setMatchPage(p => p + 1)}
                        disabled={matchPage === matchTotalPages - 1}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Watchlists
