function Page({page, totalPages, onPrevious, onNext}) {
    return(
      <div style={{ marginTop: '20px' }}>
        <button onClick={onPrevious} disabled={page === 0}>
          Previous
        </button>

        <span style={{ margin: '0 10px' }}>Page {page + 1}</span>

        <button onClick={onNext} disabled={page === totalPages - 1}>
          Next
        </button>
      </div>
    );
}

export default Page;