import { useEffect, useState } from "react";
import { getContent, searchContent } from "../services/movieApi";
import { MovieCard } from "../components/MovieCard";
import { Loader } from "../components/Loader";
import { useSearchParams } from "react-router-dom";

export default function HomePage({ categories, type }) {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");

  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query") || "";
  const year = searchParams.get("year") || ""; // ❌ removed 2026 default
  const genre = searchParams.get("genre") || "";

  // LOAD MOVIES
  useEffect(() => {
    async function loadMovies() {
      setLoading(true);

      try {
        const data = query
          ? await searchContent({ query, type, page, year })
          : await getContent({
              page,
              type,
              category: categories,
              year,
              genre,
            });

        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [page, categories, type, query, year, genre]);

  // PAGINATION
  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...params,
      page: newPage,
    });
  };

  // SEARCH
  const handleSearch = (e) => {
    e.preventDefault();

    const params = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...params,
      query: searchInput,
      page: 1,
    });
  };

  if (!loading && movies.length === 0) {
    return <p className="text-center text-gray-400 mt-10">No results</p>;
  }

  return (
    <div className="p-4">
      <Loader loading={loading} />

      {/* SEARCH */}
      <form onSubmit={handleSearch} className="flex justify-center mb-6 gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-black text-white px-3 py-2 rounded"
        />
        <button className="bg-red-600 px-3 py-1 rounded">🔍</button>
      </form>

      {/* FILTERS */}
      <div className="flex justify-center gap-3 mb-6">
        <select
          value={year}
          onChange={(e) => {
            const params = Object.fromEntries(searchParams.entries());
            setSearchParams({
              ...params,
              year: e.target.value,
              page: 1,
            });
          }}
        >
          <option value="">All Years</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>

        <select
          value={genre}
          onChange={(e) => {
            const params = Object.fromEntries(searchParams.entries());
            setSearchParams({
              ...params,
              genre: e.target.value,
              page: 1,
            });
          }}
        >
          <option value="">All Genres</option>
          <option value="28">Action</option>
          <option value="35">Comedy</option>
          <option value="18">Drama</option>
        </select>
      </div>

      {/* MOVIES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} type={type} />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-3">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Prev
        </button>

        <span>{page}</span>

        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
