import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import { listings } from '../lib/api'
import ListingCard from '../components/ListingCard'
import { SkeletonCard } from '../components/Skeleton'

const SORT_OPTIONS = [
  { value: 'lastSeen,desc',   label: 'Recently seen' },
  { value: 'price,asc',       label: 'Price: low to high' },
  { value: 'price,desc',      label: 'Price: high to low' },
  { value: 'firstSeen,desc',  label: 'Newest' },
]

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()

  const keyword = searchParams.get('q') || ''
  const page    = parseInt(searchParams.get('page') || '0', 10)
  const sort    = searchParams.get('sort') || 'lastSeen,desc'

  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [input, setInput]     = useState(keyword)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await listings.search({ keyword, page, sort })
      setData(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [keyword, page, sort])

  useEffect(() => { load() }, [load])
  useEffect(() => { setInput(keyword) }, [keyword])

  function setParams(overrides) {
    const next = {}
    if (keyword)              next.q    = keyword
    if (sort !== 'lastSeen,desc') next.sort = sort
    if (page > 0)             next.page = page
    Object.assign(next, overrides)
    if (!next.q)   delete next.q
    if (!next.sort || next.sort === 'lastSeen,desc') delete next.sort
    if (!next.page || next.page === 0) delete next.page
    setSearchParams(next)
  }

  function handleSearch(e) {
    e.preventDefault()
    setSearchParams(input.trim() ? { q: input.trim() } : {})
  }

  function handleSort(newSort) {
    setParams({ sort: newSort, page: undefined })
  }

  function handlePage(newPage) {
    setParams({ page: newPage || undefined })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const items      = data?.content ?? []
  const total      = data?.totalElements
  const totalPages = data?.totalPages ?? 0

  return (
    <div className="browse-page">

      {/* search */}
      <div className="browse-search">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrap">
            <Search className="search-icon" size={15} strokeWidth={1.75} />
            <input
              className="search-input"
              type="search"
              placeholder="Search listings — RTX 4080, iPhone 15, surfboard…"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
      </div>

      {/* controls */}
      <div className="browse-controls">
        <div className="browse-count">
          {!loading && !error && total != null && (
            <span>
              {total.toLocaleString()} {total === 1 ? 'listing' : 'listings'}
              {keyword && <> for <strong>"{keyword}"</strong></>}
            </span>
          )}
          {!loading && !error && keyword && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchParams({})}
            >
              Clear
            </button>
          )}
        </div>

        <label className="sort-row">
          <ArrowUpDown size={13} strokeWidth={1.75} style={{ color: 'var(--text-3)' }} />
          <select
            className="sort-select"
            value={sort}
            onChange={e => handleSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* error */}
      {error && (
        <div className="page-state">
          <p className="page-state-title">Couldn't load listings</p>
          <p className="page-state-body">{error}</p>
          <button className="btn btn-secondary" onClick={load}>Retry</button>
        </div>
      )}

      {/* grid */}
      {!error && (
        <div className="listings-grid">
          {loading
            ? Array.from({ length: 12 }, (_, i) => <SkeletonCard key={i} />)
            : items.map(l => <ListingCard key={l.id} listing={l} />)
          }
        </div>
      )}

      {/* empty state */}
      {!loading && !error && items.length === 0 && (
        <div className="page-state">
          <p className="page-state-title">No listings found</p>
          <p className="page-state-body">
            {keyword
              ? `No results for "${keyword}". Try a broader search term.`
              : 'No listings are available yet.'}
          </p>
          {keyword && (
            <button className="btn btn-secondary" onClick={() => setSearchParams({})}>
              Clear search
            </button>
          )}
        </div>
      )}

      {/* pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-ghost btn-sm"
            disabled={page === 0}
            onClick={() => handlePage(page - 1)}
          >
            <ChevronLeft size={15} strokeWidth={1.75} /> Prev
          </button>
          <span className="pagination-info">
            {page + 1} / {totalPages}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            disabled={page >= totalPages - 1}
            onClick={() => handlePage(page + 1)}
          >
            Next <ChevronRight size={15} strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  )
}
