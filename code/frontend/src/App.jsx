import { useEffect, useState } from 'react'
import './App.css'
import Listing from './components/Listing'

function App() {
  const [keyword, setKeyword] = useState("")
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState("")
  const[page, setPage] = useState(0)
  const[totalPages, setTotalPages] = useState(0)
  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(`http://localhost:8080/listings?page=${page}&size=20`)
        if (!response.ok){
          throw new Error(`Failed to fetch listings. Status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Fetched listings:", data)
        setListings(data.content)
        setTotalPages(data.totalPages)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [page])

  const filteredListings = listings.filter(listing => listing.title.toLowerCase().includes(keyword.toLowerCase()))

  return (
    <div>
      <h1>Deal Finder</h1>
      <p> Find the best deals online.</p>

      <input
        type="text"
        placeholder="Search listings..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <p>Searching for: {keyword}</p>
      {loading && <p>Loading listings...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (<div className='listings-grid'> {filteredListings.map((listing) => (
        <Listing
          key={listing.id}
          title={listing.title}
          price={listing.price}
          location ={listing.location}
          url={listing.url}
          createdAt={listing.createdAt}
        />
      ))}
      </div>
    )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          Previous
        </button>

        <span style={{ margin: '0 10px' }}>Page {page + 1}</span>

        <button onClick={() => setPage(page + 1)} disabled={page === totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  )
}

export default App
