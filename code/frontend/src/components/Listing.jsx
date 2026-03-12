function Listing({ title, price, location, url, createdAt }) {
    return (
        <div className="listing">
            <div className="listing-title">
                <h2>{title}</h2>
            </div>
            <div className="listing-content">
                <p className="price">${Number(price).toFixed(2)}</p>
                <p className="location">{location || "N/A"}</p>
            </div>
            <a className="view" href={url} target="_blank" rel="noopener noreferrer">
                View Listing
            </a>
        </div>
    )
}

export default Listing;