function Page({ page, totalPages, onPrevious, onNext }) {
  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={onPrevious}
        disabled={page === 0}
      >
        Previous
      </button>

      <span className="pagination-info">Page {page + 1} of {totalPages || 1}</span>

      <button
        className="pagination-btn"
        onClick={onNext}
        disabled={page === totalPages - 1}
      >
        Next
      </button>
    </div>
  )
}

export default Page
