import { useEffect, useState } from "react";
import { getContent, searchContent } from "../services/movieApi";
import { MovieCard } from "../components/MovieCard";
import { Loader } from "../components/Loader";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, X, Hash, Send } from "lucide-react";

export default function HomePage({ categories, type }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [gotoPage, setGotoPage] = useState();

  // URL Params
  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query") || "";
  const year = searchParams.get("year") || "";
  const genre = searchParams.get("genre") || "";

  // Local state for the input field
  const [searchInput, setSearchInput] = useState(query);

  // Sync input field with URL (e.g., when clicking logo or going back)
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // 1. IMPROVED: Handle Filter Changes
  const handleFilterChange = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());

    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }

    // If we are filtering by genre/year, clear the text search to avoid API conflicts
    if (key === "genre" || key === "year") {
      delete params.query;
      setSearchInput("");
    }

    params.page = 1;
    setSearchParams(params);
  };

  const handleJumpPage = (e) => {
    if (e) e.preventDefault();
    const pageNum = Number(gotoPage);
    // Validation: Ensure it's a number and within range
    if (pageNum > 0 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setGotoPage("");
    }
  };

  // 2. FIXED: Fetching Logic
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
        const apiTotalPages = data.total_pages || 1;

        if (type === "movie") {
          setTotalPages(Math.min(apiTotalPages, 500));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, [page, categories, type, query, year, genre]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = Object.fromEntries(searchParams.entries());

    if (searchInput) {
      params.query = searchInput;
      delete params.genre; // Clear genre when searching text
    } else {
      delete params.query;
    }

    params.page = 1;
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams.entries());
    params.page = newPage;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNum = () => {
    const pages = [];
    const delta = window.innerWidth < 640 ? 1 : 1;
    pages.push(1);
    if (page > delta + 2) pages.push("...");
    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - (delta + 1)) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i,
  );

  return (
    <div className="min-h-screen bg-transparent text-white pb-32">
      <Loader loading={loading} />

      {/* HERO / SEARCH */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-8 italic tracking-tighter">
          DISCOVER<span className="text-cyan-500">LAB</span>
        </h1>

        <form
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto flex flex-col sm:flex-row gap-3"
        >
          {/* Input Wrapper */}
          <div className="relative flex-1 flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-cyan-500/50 backdrop-blur-md transition-all">
            <Search className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search movies or TV shows..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent border-none px-4 py-4 focus:outline-none text-white placeholder:text-gray-600 text-base"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearchParams({});
                }}
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* THE SEARCH BUTTON */}
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2"
          >
            <Search size={18} />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 px-4">
        <select
          value={year}
          onChange={(e) => handleFilterChange("year", e.target.value)}
          className="bg-gray-950 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-cyan-500 text-sm cursor-pointer hover:bg-gray-900 transition-colors"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={genre}
          onChange={(e) => handleFilterChange("genre", e.target.value)}
          className="bg-gray-950 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-cyan-500 text-sm cursor-pointer hover:bg-gray-900 transition-colors"
        >
          <option value="">All Genres</option>
          <option value="28">Action</option>
          <option value="35">Comedy</option>
          <option value="18">Drama</option>
          <option value="27">Horror</option>
          <option value="10749">Romance</option>
          <option value="878">Sci-Fi</option>
          <option value="16">Animation</option>
        </select>
      </div>

      {/* GRID / EMPTY STATE */}
      {movies.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Search size={48} className="mb-4 text-gray-600" />
          <p className="text-xl font-medium">No movies found.</p>
          <button
            onClick={() => setSearchParams({})}
            className="mt-2 text-cyan-500 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} type={type} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-2 pointer-events-none md:flex-row flex-col items-center">
          {/* GOTOPAGE */}
          <form
            onSubmit={handleJumpPage}
            className="flex items-center gap-2 bg-gray-950/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl pointer-events-auto transition-all hover:border-cyan-500/50"
          >
            <div className="flex items-center gap-2 pl-3">
              <Hash size={14} className="text-cyan-500" />
              <input
                // type="number"
                placeholder="Jump to..."
                value={gotoPage}
                onChange={(e) => setGotoPage(e.target.value)}
                className="bg-transparent text-sm w-16 focus:outline-none text-white placeholder:text-gray-600"
                min="1"
                max={totalPages}
              />
            </div>
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 p-2 rounded-full text-white transition-all active:scale-90"
            >
              <Send size={14} />
            </button>
          </form>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur border border-white/30 p-1.5 rounded-full shadow-2xl pointer-events-auto">
            {/* PREV BUTTON */}
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-cyan-600 rounded-full text-black/80 hover:text-cyan-400 hover:bg-cyan-900 disabled:opacity-0 transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            {/* NUMBERS */}
            <div className="flex items-center ">
              {getPageNum().map((p, i) => (
                <button
                  key={i}
                  disabled={p === "..."}
                  onClick={() => typeof p === "number" && handlePageChange(p)}
                  className={`
                  relative flex items-center justify-center transition-all duration-300 font-bold
                  ${p === "..." ? "w-4 sm:w-8 cursor-default text-gray-600" : "w-9 h-9 sm:w-11 sm:h-11 rounded-full text-xs sm:text-sm"}
                  ${
                    p === page
                      ? "text-cyan-400 bg-cyan-400/10"
                      : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                  }
                `}
                >
                  {p}
                  {/* Active Glow Dot */}
                  {p === page && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                  )}
                </button>
              ))}
            </div>

            {/* NEXT BUTTON */}
            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-cyan-600 rounded-full text-black/80 hover:text-cyan-400 hover:bg-cyan-900 disabled:opacity-0 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
