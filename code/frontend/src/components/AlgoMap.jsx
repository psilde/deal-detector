const MOCK_LISTINGS = [
  { id: 1,  title: 'RTX 4080 SUPER 16GB',      price: '$650',    city: 'New York, US',   deal: true  },
  { id: 2,  title: 'iPhone 15 Pro Max 256GB',   price: '$890',    city: 'London, UK',     deal: false },
  { id: 3,  title: 'Nissan GT-R 2022',          price: '$48,500', city: 'Tokyo, JP',      deal: true  },
  { id: 4,  title: 'MacBook Pro M3 14"',        price: '$1,450',  city: 'Sydney, AU',     deal: true  },
  { id: 5,  title: 'PlayStation 5 Disc',        price: '$380',    city: 'Toronto, CA',    deal: false },
  { id: 6,  title: 'Mercedes C-Class 2021',     price: '$28,900', city: 'Berlin, DE',     deal: true  },
  { id: 7,  title: 'DJI Mavic 3 Pro',           price: '$1,100',  city: 'Singapore, SG',  deal: false },
  { id: 8,  title: 'Rolex Submariner Date',     price: '$9,200',  city: 'Dubai, AE',      deal: true  },
  { id: 9,  title: 'Sony A7 IV Body',           price: '$2,100',  city: 'São Paulo, BR',  deal: false },
  { id: 10, title: 'Tesla Model 3 Long Range',  price: '$31,000', city: 'Amsterdam, NL',  deal: true  },
]

function AlgoMap() {
  return (
    <section className="algo-map-section">
      <div className="algo-map-header">
        <p className="algo-eyebrow">// listing.location</p>
        <h2 className="algo-map-title">Location data</h2>
        <p className="algo-map-desc">
          Location is stored per listing and returned with every deal match.
          The matching algorithm is keyword + price-driven — location provides geographic context only.
        </p>
      </div>

      <div className="location-table">
        <div className="location-table-head">
          <span>Title</span>
          <span>Location</span>
          <span>Price</span>
          <span>Match</span>
        </div>
        {MOCK_LISTINGS.map(listing => (
          <div key={listing.id} className="location-table-row">
            <span className="location-table-title">{listing.title}</span>
            <span className="location-table-city">{listing.city}</span>
            <span className="location-table-price">{listing.price}</span>
            <span className="location-table-match">
              <span className={`location-dot${listing.deal ? ' location-dot--deal' : ''}`} />
              {listing.deal ? 'deal' : '—'}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AlgoMap
