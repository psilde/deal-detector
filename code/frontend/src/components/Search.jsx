function Search({ keyword, onKeywordChange }) {
    return (
    <input
        type="text"
        placeholder="Search listings..."
        value={keyword}
        onChange={(e) => {
          onKeywordChange(e.target.value)
          setPage(0)}}
     />
    )
}

export default Search;