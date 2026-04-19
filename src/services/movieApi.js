const API_KEY = "cdd17f96397234d5f00cf42ee2ebeec4";
const BASE_URL = "https://api.themoviedb.org/3";

// Reusable fetch
async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

// Get content (movies/tv)
export async function getContent({ page = 1, type, category, year, genre }) {
  let url;

  // ✅ USE DISCOVER WHEN FILTERING
  if (year || genre) {
    url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&page=${page}`;

    if (year) {
      url +=
        type === "movie"
          ? `&primary_release_year=${year}`
          : `&first_air_date_year=${year}`;
    }

    if (genre) {
      url += `&with_genres=${genre}`;
    }
  } else {
    // ✅ NORMAL CATEGORY (popular, top_rated, etc.)
    url = `${BASE_URL}/${type}/${category}?api_key=${API_KEY}&page=${page}`;
  }

  return fetchData(url);
}

// Search
export async function searchContent({ query, type, page = 1, year }) {
  let url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${query}&page=${page}`;

  if (year) {
    url +=
      type === "movie"
        ? `&primary_release_year=${year}`
        : `&first_air_date_year=${year}`;
  }

  return fetchData(url);
}

// Details
export async function getMovieDetails(id, type) {
  return fetchData(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
}

// Videos
export async function getMovieVideos(id, type) {
  const data = await fetchData(
    `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`,
  );

  return data.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube",
  );
}

// Watch providers
export async function getWatchProviders(id, type) {
  return fetchData(
    `${BASE_URL}/${type}/${id}/watch/providers?api_key=${API_KEY}`,
  );
}
