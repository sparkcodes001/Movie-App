const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

export async function getContent({ page = 1, type, category, year, genre }) {
  let url;

  // Only use /discover/ when filtering by year or genre
  if (year || genre) {
    url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc`;

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
    // Use the proper category endpoint: /movie/popular, /tv/top_rated, etc.
    url = `${BASE_URL}/${type}/${category}?api_key=${API_KEY}&page=${page}`;
  }

  return fetchData(url);
}

export async function searchContent({ query, type, page = 1, year }) {
  let url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;

  if (year) {
    url +=
      type === "movie"
        ? `&primary_release_year=${year}`
        : `&first_air_date_year=${year}`;
  }

  return fetchData(url);
}

export async function getMovieDetails(id, type) {
  return fetchData(
    `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=credits`,
  );
}

export async function getMovieVideos(id, type) {
  const data = await fetchData(
    `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`,
  );
  return data.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube",
  );
}

export async function getWatchProviders(id, type) {
  return fetchData(
    `${BASE_URL}/${type}/${id}/watch/providers?api_key=${API_KEY}`,
  );
}
