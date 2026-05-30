import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getContent, searchContent } from "../services/movieApi";
import { MovieCard } from "../components/MovieCard";
import { Loader } from "../components/Loader";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  Filter,
  Check,
  Calendar,
  X,
  RotateCcw,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const GENRES = [
  { id: "", name: "All Data" },
  { id: "28", name: "Action" },
  { id: "35", name: "Comedy" },
  { id: "18", name: "Drama" },
  { id: "27", name: "Horror" },
  { id: "878", name: "Sci-Fi" },
  { id: "16", name: "Animation" },
  { id: "53", name: "Thriller" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [
  "",
  ...Array.from({ length: 40 }, (_, i) => (CURRENT_YEAR - i).toString()),
];

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || "",
  );

  const dropdownContainerRef = useRef();
  const gridRef = useRef();

  // ALL state lives in the URL - single source of truth
  const type = searchParams.get("type") || "movie";
  const category = searchParams.get("category") || "popular";
  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query") || "";
  const year = searchParams.get("year") || "";
  const genre = searchParams.get("genre") || "";

  // Sync search input if URL query changes externally (e.g. navbar reset)
  useEffect(() => {
    setSearchInput(searchParams.get("query") || "");
  }, [searchParams.get("query")]);

  const closeDropdowns = useCallback(() => setActiveDropdown(null), []);

  const updateURL = useCallback(
    (newParams) => {
      // Build from current params
      const current = Object.fromEntries(searchParams.entries());
      const merged = { ...current, ...newParams };

      // Reset page to 1 unless explicitly changing page
      if (!newParams.hasOwnProperty("page")) {
        merged.page = "1";
      }

      // Remove empty values
      Object.keys(merged).forEach((key) => {
        if (
          merged[key] === "" ||
          merged[key] === null ||
          merged[key] === undefined
        ) {
          delete merged[key];
        }
      });

      setSearchParams(merged);
      closeDropdowns();
    },
    [searchParams, setSearchParams, closeDropdowns],
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // When searching, clear genre and year but keep type/category
    const current = Object.fromEntries(searchParams.entries());
    const newParams = {
      type: current.type || "movie",
      category: current.category || "popular",
      page: "1",
    };
    if (searchInput) newParams.query = searchInput;
    setSearchParams(newParams);
    closeDropdowns();
  };

  // Click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target)
      ) {
        closeDropdowns();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdowns]);

  // Fetch — reacts to ALL url param changes
  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      try {
        let data;
        if (query) {
          data = await searchContent({ query, type, page, year });
        } else {
          data = await getContent({
            page,
            type,
            category,
            year,
            genre,
          });
        }

        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Archive Retrieval Error:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [page, category, type, query, year, genre]);

  // Animations
  useGSAP(() => {
    gsap.from(".char", {
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.03,
      duration: 1,
      ease: "back.out(1.7)",
    });
  }, []);

  useGSAP(() => {
    if (!loading && movies.length > 0) {
      gsap.fromTo(
        ".movie-anim",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
      );
    }
  }, [movies, loading]);

  useGSAP(() => {
    if (activeDropdown) {
      gsap.fromTo(
        ".drop-item",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, stagger: 0.03, duration: 0.3, ease: "power2.out" },
      );
    }
  }, [activeDropdown]);

  const getVisiblePages = () => {
    const delta = window.innerWidth < 640 ? 1 : 2;
    const range = [];
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 selection:bg-cyan-500 selection:text-black">
      <Loader loading={loading} />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-6xl md:text-9xl font-black mb-12 italic tracking-tighter uppercase select-none">
          {"DISCOVER".split("").map((c, i) => (
            <span key={i} className="char inline-block">
              {c}
            </span>
          ))}
          <span className="text-cyan-500 italic">
            {"LAB".split("").map((c, i) => (
              <span key={i + 8} className="char inline-block">
                {c}
              </span>
            ))}
          </span>
        </h1>

        {/* Active filter indicator */}
        <div className="flex items-center justify-center gap-2 mb-6 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          <span className={type === "movie" ? "text-cyan-500" : ""}>
            {type === "movie" ? "◆ Movies" : "◆ TV Shows"}
          </span>
          <span>›</span>
          <span className="text-zinc-400">{category.replaceAll("_", " ")}</span>
          {query && (
            <>
              <span>›</span>
              <span className="text-yellow-500">"{query}"</span>
            </>
          )}
          {genre && (
            <>
              <span>›</span>
              <span className="text-purple-400">
                {GENRES.find((g) => g.id === genre)?.name}
              </span>
            </>
          )}
          {year && (
            <>
              <span>›</span>
              <span className="text-green-400">{year}</span>
            </>
          )}
        </div>

        {/* Filters */}
        <div
          className="flex flex-col lg:flex-row items-center justify-center gap-4 max-w-5xl mx-auto"
          ref={dropdownContainerRef}
        >
          {/* Genre Dropdown */}
          <div className="relative w-full lg:w-56">
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === "genre" ? null : "genre")
              }
              className={`w-full flex items-center justify-between bg-white/5 border px-5 py-4 rounded-xl transition-all group ${
                activeDropdown === "genre"
                  ? "border-cyan-500 ring-4 ring-cyan-500/10"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Filter
                  size={16}
                  className={genre ? "text-cyan-500" : "text-zinc-600"}
                />
                <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                  {GENRES.find((g) => g.id === genre)?.name || "Select Genre"}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`text-zinc-600 transition-transform duration-300 ${
                  activeDropdown === "genre" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeDropdown === "genre" && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-zinc-950 border border-white/10 rounded-xl overflow-hidden z-[70] shadow-2xl backdrop-blur-xl">
                <div className="p-2 flex flex-col">
                  {GENRES.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => updateURL({ genre: g.id })}
                      className={`drop-item flex items-center justify-between px-4 py-3 rounded-lg text-left font-mono text-[10px] uppercase tracking-widest transition-all ${
                        genre === g.id
                          ? "bg-cyan-500 text-black font-black"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {g.name} {genre === g.id && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Year Dropdown */}
          <div className="relative w-full lg:w-44">
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === "year" ? null : "year")
              }
              className={`w-full flex items-center justify-between bg-white/5 border px-5 py-4 rounded-xl transition-all group ${
                activeDropdown === "year"
                  ? "border-cyan-500 ring-4 ring-cyan-500/10"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar
                  size={16}
                  className={year ? "text-cyan-500" : "text-zinc-600"}
                />
                <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                  {year || "Year"}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`text-zinc-600 transition-transform duration-300 ${
                  activeDropdown === "year" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeDropdown === "year" && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-zinc-950 border border-white/10 rounded-xl overflow-hidden z-[70] shadow-2xl backdrop-blur-xl max-h-80 overflow-y-auto">
                <div className="p-2 flex flex-col">
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      onClick={() => updateURL({ year: y })}
                      className={`drop-item flex items-center justify-between px-4 py-3 rounded-lg text-left font-mono text-[10px] uppercase tracking-widest transition-all ${
                        year === y
                          ? "bg-cyan-500 text-black font-black"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {y || "All Time"} {year === y && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative flex-1 flex flex-col sm:flex-row gap-3 w-full"
          >
            <div className="relative flex-1 bg-white/5 border border-white/10 rounded-xl px-4 flex items-center focus-within:border-cyan-500 transition-all">
              <Search className="text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Query node database..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent border-none px-4 py-4 focus:outline-none font-mono text-sm uppercase tracking-widest placeholder:text-zinc-800"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    const current = Object.fromEntries(searchParams.entries());
                    const { query: _q, ...rest } = current;
                    setSearchParams({ ...rest, page: "1" });
                  }}
                  className="text-zinc-600 hover:text-white p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-white text-black font-black uppercase italic tracking-widest text-[11px] px-10 py-4 rounded-xl hover:bg-cyan-500 hover:text-white transition-all shadow-xl active:scale-95"
            >
              Establish_Link
            </button>
          </form>
        </div>
      </section>

      {/* Grid */}
      <main
        ref={gridRef}
        className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 min-h-[400px]"
      >
        {movies.length > 0
          ? movies.map((movie) => (
              <div key={movie.id} className="movie-anim">
                <MovieCard movie={movie} type={type} />
              </div>
            ))
          : !loading && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-700">
                <RotateCcw size={40} className="mb-4 animate-spin-slow" />
                <p className="font-mono text-xs uppercase tracking-[0.3em]">
                  No archive entries match your criteria.
                </p>
              </div>
            )}
      </main>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full px-6 flex justify-center pointer-events-none">
          <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-2 rounded-full flex items-center gap-1 shadow-2xl pointer-events-auto">
            <button
              disabled={page === 1}
              onClick={() => updateURL({ page: page - 1 })}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center font-mono text-[10px] px-2">
              <button
                onClick={() => updateURL({ page: 1 })}
                className={`w-8 h-8 rounded-full ${
                  page === 1 ? "text-cyan-500 font-black" : "text-zinc-600"
                }`}
              >
                1
              </button>
              {page > 3 && <span className="text-zinc-800 px-1">...</span>}
              {getVisiblePages().map((n) => (
                <button
                  key={n}
                  onClick={() => updateURL({ page: n })}
                  className={`w-8 h-8 rounded-full ${
                    page === n ? "text-cyan-500 font-black" : "text-zinc-600"
                  }`}
                >
                  {n}
                </button>
              ))}
              {page < totalPages - 2 && (
                <span className="text-zinc-800 px-1">...</span>
              )}
              {totalPages > 1 && (
                <button
                  onClick={() => updateURL({ page: totalPages })}
                  className={`w-8 h-8 rounded-full ${
                    page === totalPages
                      ? "text-cyan-500 font-black"
                      : "text-zinc-600"
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => updateURL({ page: page + 1 })}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
