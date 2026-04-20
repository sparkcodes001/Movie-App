import { useEffect, useState } from "react";
import { getContent, searchContent } from "../services/movieApi";
import { MovieCard } from "../components/MovieCard";
import { Loader } from "../components/Loader";
import { useSearchParams } from "react-router-dom";

export default function HomePage({ categories, type }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [loadMore, setLoadMore] = useState(false);

  // SERACH STATES
  const [searchInput, setSearchInput] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query") || "";
  const year = searchParams.get("year") || "";
  const genre = searchParams.get("genre") || "";

  // LOAD MOVIES
  useEffect(() => {
    async function loadMovies() {
      setLoading(true);

      try {
        const data =
          query && !genre
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

  const getPageNum = () => {
    const pages = [];

    if (page > 2) {
      pages.push(1, "...");
    }

    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages) {
      pages.push("...", totalPages);
    }

    return pages;
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

  const currentYear = new Date().getFullYear();
  const startYear = 2000;

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i,
  );

  return (
    <div className="p-4">
      <Loader loading={loading} />

      {/* SEARCH */}
      <form onSubmit={handleSearch} className="flex justify-center mb-6 mt-3 gap-2">
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
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {/* YEAR */}
        <div className="relative">
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
            className="appearance-none bg-black/80 text-white border border-gray-700 px-4 py-2 pr-10 rounded-xl backdrop-blur-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-gray-500 transition-all"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Custom Arrow */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            ▼
          </span>
        </div>

        {/* GENRE */}
        <div className="relative">
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
            className="appearance-none bg-black/80 text-white border border-gray-700 px-4 py-2 pr-10 rounded-xl backdrop-blur-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-gray-500 transition-all"
          >
            <option value="">All Genres</option>
            <option value="28">Action</option>
            <option value="35">Comedy</option>
            <option value="18">Drama</option>
          </select>

          {/* Custom Arrow */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            ▼
          </span>
        </div>
      </div>

      {/* MOVIES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} type={type} />
        ))}
      </div>

      {/* PAGINATION */}

      <div className="sticky bottom-2 flex justify-center mt-2 md:bottom-3">
        <div className="flex items-center gap-3 backdrop-blur-lg shadow shadow-black/50 border border-gray-800 md:px-4 md:py-2 py-1 px-1 rounded-xl bg-black/40">
          <button
            disabled={page === 1}
            className="bg-gradient-to-tl from-gray-700 via-gray-950 to-gray-700 md:p-2 p-1 rounded-md active:scale-x-90 transition-all"
            onClick={() => handlePageChange(page - 1)}
          >
            ⬅ Prev
          </button>

          <div className="flex gap-1">
            {getPageNum().map((p, i) =>
              p === "..." ? (
                <span key={i}>...</span>
              ) : (
                <button
                  className={`md:px-2 px-1 md:py-1 rounded ${
                    p === page ? "bg-red-600 text-white" : "bg-gray-800"
                  }`}
                  key={i}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              ),
            )}
          </div>

          <button
            disabled={page === totalPages}
            className="bg-gradient-to-tl from-gray-700 via-gray-950 to-gray-700 md:p-2 p-1 rounded-md active:scale-x-90 transition-all"
            onClick={() => handlePageChange(page + 1)}
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
}
