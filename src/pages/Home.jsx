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
  Terminal,
  Activity,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const GENRES = [
  { id: "", name: "All_Data" },
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
  const dropdownContainerRef = useRef();
  const gridRef = useRef();

  const type = searchParams.get("type") || "movie";
  const category = searchParams.get("category") || "popular";
  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query") || "";
  const year = searchParams.get("year") || "";
  const genre = searchParams.get("genre") || "";

  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const closeDropdowns = useCallback(() => setActiveDropdown(null), []);

  const updateURL = useCallback(
    (newParams) => {
      const current = Object.fromEntries(searchParams.entries());
      const merged = { ...current, ...newParams };
      if (!Object.prototype.hasOwnProperty.call(newParams, "page")) {
        merged.page = "1";
      }
      Object.keys(merged).forEach((key) => {
        if (!merged[key]) delete merged[key];
      });
      setSearchParams(merged);
      closeDropdowns();
    },
    [searchParams, setSearchParams, closeDropdowns],
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = { type, category, page: "1" };
    if (searchInput.trim()) newParams.query = searchInput.trim();
    setSearchParams(newParams);
    closeDropdowns();
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchParams({ type, category, page: "1" });
  };

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

  useEffect(() => {
    let cancelled = false;
    async function loadMovies() {
      setLoading(true);
      try {
        const data = query
          ? await searchContent({ query, type, page, year })
          : await getContent({ page, type, category, year, genre });
        if (!cancelled) {
          setMovies(data.results || []);
          setTotalPages(Math.min(data.total_pages || 1, 500));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {
        console.error("Archive Retrieval Error:", err);
        if (!cancelled) setMovies([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadMovies();
    return () => {
      cancelled = true;
    };
  }, [page, category, type, query, year, genre]);

  useGSAP(() => {
    gsap.fromTo(
      ".char",
      { opacity: 0, y: 40, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: "power3.out",
      },
    );
  }, []);

  useGSAP(() => {
    if (!loading && movies.length > 0) {
      gsap.fromTo(
        ".movie-anim",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [movies, loading]);

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

  // Dropdown panel — full width of its relative parent
  const dropdownPanelClass =
    "absolute top-[calc(100%+4px)] left-0 w-full bg-[#080808] border border-white/10 z-[70] shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl max-h-72 overflow-y-auto";

  const dropdownItemClass = (active) =>
    `drop-item flex items-center justify-between px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest transition-all border-l-2 w-full ${
      active
        ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
        : "border-transparent text-zinc-500 hover:border-zinc-600 hover:text-white hover:bg-white/5"
    }`;

  return (
    <div className="min-h-screen bg-[#030303] text-white pb-32 selection:bg-cyan-500 selection:text-black">
      <Loader loading={loading} />

      {/* ── Header section — full width with side padding ── */}
      <section className="w-full px-6 md:px-10 lg:px-16 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-cyan-500 mb-4">
            <Activity size={14} className="animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em]">
              Archive_Query_Interface // v4.0
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black italic tracking-tighter uppercase leading-none select-none">
            {"DISCOVER".split("").map((c, i) => (
              <span key={i} className="char inline-block">
                {c}
              </span>
            ))}
            <span className="text-cyan-500">
              {"LAB".split("").map((c, i) => (
                <span key={i + 8} className="char inline-block">
                  {c}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center flex-wrap gap-2 mb-8 font-mono text-[9px] uppercase tracking-widest border-l-2 border-cyan-500/30 pl-4 py-1">
          <span className="text-cyan-500">
            ◆ {type === "movie" ? "Movies" : "TV_Shows"}
          </span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-500">{category.replaceAll("_", " ")}</span>
          {query && (
            <>
              <span className="text-zinc-700">/</span>
              <span className="text-yellow-400">"{query}"</span>
            </>
          )}
          {genre && (
            <>
              <span className="text-zinc-700">/</span>
              <span className="text-purple-400">
                {GENRES.find((g) => g.id === genre)?.name}
              </span>
            </>
          )}
          {year && (
            <>
              <span className="text-zinc-700">/</span>
              <span className="text-green-400">{year}</span>
            </>
          )}
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-600">pg_{page}</span>
        </div>

        {/* ── Controls — full width, genre takes remaining space ── */}
        <div
          ref={dropdownContainerRef}
          className="flex flex-col lg:flex-row items-stretch gap-3 w-full"
        >
          {/* Genre — flex-1 so it grows to fill available space */}
          <div className="relative flex-1 min-w-0">
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === "genre" ? null : "genre")
              }
              className={`w-full flex items-center justify-between bg-[#0a0a0a] border px-4 py-3.5 transition-all group ${
                activeDropdown === "genre"
                  ? "border-cyan-500"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <Filter
                  size={13}
                  className={genre ? "text-cyan-500" : "text-zinc-600"}
                />
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                  {GENRES.find((g) => g.id === genre)?.name || "Genre_Filter"}
                </span>
              </div>
              <ChevronDown
                size={13}
                className={`text-zinc-600 transition-transform duration-300 ${
                  activeDropdown === "genre" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeDropdown === "genre" && (
              <div className={dropdownPanelClass}>
                {GENRES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => updateURL({ genre: g.id })}
                    className={dropdownItemClass(genre === g.id)}
                  >
                    {g.name} {genre === g.id && <Check size={10} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year — fixed comfortable width */}
          <div className="relative w-full lg:w-44 shrink-0">
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === "year" ? null : "year")
              }
              className={`w-full flex items-center justify-between bg-[#0a0a0a] border px-4 py-3.5 transition-all group ${
                activeDropdown === "year"
                  ? "border-cyan-500"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar
                  size={13}
                  className={year ? "text-cyan-500" : "text-zinc-600"}
                />
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                  {year || "Year"}
                </span>
              </div>
              <ChevronDown
                size={13}
                className={`text-zinc-600 transition-transform duration-300 ${
                  activeDropdown === "year" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeDropdown === "year" && (
              <div className={dropdownPanelClass}>
                {YEARS.map((y) => (
                  <button
                    key={y || "all"}
                    onClick={() => updateURL({ year: y })}
                    className={dropdownItemClass(year === y)}
                  >
                    {y || "All_Time"} {year === y && <Check size={10} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search — fixed comfortable width, does not flex-grow */}
          <form
            onSubmit={handleSearch}
            className="flex gap-2 w-full lg:w-96 shrink-0"
          >
            <div className="flex-1 bg-[#0a0a0a] border border-white/10 focus-within:border-cyan-500 transition-all flex items-center px-4 gap-3">
              <Search className="text-zinc-600 shrink-0" size={14} />
              <input
                type="text"
                placeholder="Query_Archive_Database..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent py-3.5 focus:outline-none font-mono text-xs uppercase tracking-widest placeholder:text-zinc-800 text-white"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-zinc-600 hover:text-white shrink-0"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="group relative bg-white text-black px-6 font-black uppercase italic tracking-widest text-[10px] flex items-center gap-2 overflow-hidden whitespace-nowrap active:scale-95 transition-all shrink-0"
            >
              <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Terminal
                size={13}
                className="relative z-10 group-hover:text-white transition-colors"
              />
              <span className="relative z-10 group-hover:text-white transition-colors">
                Execute
              </span>
            </button>
          </form>
        </div>
      </section>

      {/* ── Grid — full width with side padding ── */}
      <main
        ref={gridRef}
        className="w-full px-6 md:px-10 lg:px-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-5 min-h-[400px]"
      >
        {movies.length > 0
          ? movies.map((movie) => (
              <div key={movie.id} className="movie-anim">
                <MovieCard movie={movie} type={type} />
              </div>
            ))
          : !loading && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-zinc-700">
                <div className="font-mono text-[9px] uppercase tracking-[0.4em] flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border border-zinc-800 flex items-center justify-center">
                    <Terminal size={20} className="text-zinc-700" />
                  </div>
                  <p>No_Archive_Entries_Found</p>
                  <p className="text-zinc-800">// Adjust query parameters</p>
                </div>
              </div>
            )}
      </main>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-[#030303]/95 backdrop-blur-2xl border border-white/10 p-1.5 flex items-center gap-1 shadow-2xl pointer-events-auto">
            <button
              disabled={page === 1}
              onClick={() => updateURL({ page: page - 1 })}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-transparent hover:border-white/10"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center font-mono text-[9px] px-1">
              <button
                onClick={() => updateURL({ page: 1 })}
                className={`w-8 h-8 transition-colors ${
                  page === 1
                    ? "text-cyan-500 font-black bg-cyan-500/10"
                    : "text-zinc-600 hover:text-white"
                }`}
              >
                1
              </button>
              {page > 3 && <span className="text-zinc-800 px-1">…</span>}
              {getVisiblePages().map((n) => (
                <button
                  key={n}
                  onClick={() => updateURL({ page: n })}
                  className={`w-8 h-8 transition-colors ${
                    page === n
                      ? "text-cyan-500 font-black bg-cyan-500/10"
                      : "text-zinc-600 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ))}
              {page < totalPages - 2 && (
                <span className="text-zinc-800 px-1">…</span>
              )}
              {totalPages > 1 && (
                <button
                  onClick={() => updateURL({ page: totalPages })}
                  className={`w-8 h-8 transition-colors ${
                    page === totalPages
                      ? "text-cyan-500 font-black bg-cyan-500/10"
                      : "text-zinc-600 hover:text-white"
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => updateURL({ page: page + 1 })}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-transparent hover:border-white/10"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
