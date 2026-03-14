import { useEffect, useState } from 'react'
import { Plus, Trash2, Target, Search, Inbox } from 'lucide-react'
import Listing from './Listing'

function Watchlists({ token }) {
  const [watchlists, setWatchlists] = useState([])
  const [selectedWatchlistId, setSelectedWatchlistId] = useState(null)
  const [matches, setMatches] = useState([])

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
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch watchlists')
      }

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

  async function fetchMatches(watchlistId) {
    try {
      setLoadingMatches(true)
      setError('')

      const response = await fetch(`http://localhost:8080/watchlists/${watchlistId}/matches`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch matches')
      }

      const data = await response.json()
      setMatches(data.matches ?? [])
    } catch (error) {
      setError(error.message)
    } finally {
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

      if (!response.ok) {
        throw new Error('Failed to create watchlist')
      }

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
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete watchlist')
      }

      const updatedWatchlists = watchlists.filter((watchlist) => watchlist.id !== id)
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

  useEffect(() => {
    fetchWatchlists()
  }, [])

  useEffect(() => {
    if (!selectedWatchlistId) return
    fetchMatches(selectedWatchlistId)
  }, [selectedWatchlistId])

  return (
    <div className="watchlists-layout page-enter">
      <aside className="watchlists-sidebar">
        <div className="watchlists-sidebar-panel">
          <div className="watchlists-sidebar-header">
            <h2>My Watchlists</h2>
            <p>Select one to view matching deals.</p>
          </div>

          {error && <p className="watchlist-error">{error}</p>}

          {loadingWatchlists ? (
            <div className="empty-state-card compact-empty-state">
              <Inbox size={18} strokeWidth={2} />
              <div>
                <h3>Loading watchlists</h3>
                <p>Please wait a moment.</p>
              </div>
            </div>
          ) : watchlists.length === 0 ? (
            <div className="empty-state-card compact-empty-state">
              <Search size={18} strokeWidth={2} />
              <div>
                <h3>No watchlists yet</h3>
                <p>Create your first watchlist to start tracking deals.</p>
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
                      <Target size={13} strokeWidth={2} />
                      <span>{watchlist.percentageThreshold}% off</span>
                    </span>
                  </button>

                  <button
                    className="watchlist-delete-button"
                    onClick={() => handleDeleteWatchlist(watchlist.id)}
                    aria-label={`Delete ${watchlist.keyword} watchlist`}
                  >
                    <Trash2 size={15} strokeWidth={2} />
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
                <Plus size={16} strokeWidth={2.2} />
                <span>Create Watchlist</span>
              </button>
            ) : (
              <div className="watchlists-create-panel">
                <h3>Create Watchlist</h3>

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
            {selectedWatchlistId !== null && (
              <p>Showing listings for your selected watchlist.</p>
            )}
          </div>

          {selectedWatchlistId === null ? (
            <div className="empty-state-card">
              <Search size={22} strokeWidth={2} />
              <h3>Select a watchlist</h3>
              <p>Choose a watchlist on the left to view matching deals.</p>
            </div>
          ) : loadingMatches ? (
            <div className="empty-state-card">
              <Inbox size={22} strokeWidth={2} />
              <h3>Loading matches</h3>
              <p>Fetching listings for this watchlist.</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="empty-state-card">
              <Target size={22} strokeWidth={2} />
              <h3>No matching deals yet</h3>
              <p>Try another watchlist or lower the discount threshold.</p>
            </div>
          ) : (
            <div className="listings-grid">
              {matches.map((listing) => (
                <Listing
                  key={listing.id}
                  title={listing.title}
                  price={listing.price}
                  location={listing.location}
                  url={listing.url}
                  createdAt={listing.createdAt}
                  imageUrl={listing.imageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Watchlists