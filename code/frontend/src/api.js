const API_BASE = "http://localhost:8080";

export async function fetchListings(page, keyword) {
  const response = await fetch(
    `${API_BASE}/listings?page=${page}&size=20&keyword=${encodeURIComponent(keyword)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }

  return response.json();
}