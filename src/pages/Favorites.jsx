import { MovieCard } from "../components/MovieCard";
import { useMovies } from "../context/MovieContext";
import { Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RiTerminalBoxLine } from "react-icons/ri";

export default function FavoritePage() {
  const { favorites } = useMovies();
  const navigate = useNavigate();
  const containerRef = useRef();

  useGSAP(() => {
    gsap.fromTo(
      ".fav-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: "power2.out" },
    );
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center px-6 text-center">
        {/* Scanlines */}
        <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] opacity-30" />

        <div className="relative z-10 space-y-8 font-mono">
          <div className="flex items-center justify-center gap-3 text-cyan-500">
            <RiTerminalBoxLine size={16} className="animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.4em]">
              Favorites_Vault // Empty
            </span>
          </div>

          <div className="w-16 h-16 border border-white/10 flex items-center justify-center mx-auto">
            <Heart size={24} className="text-zinc-700" />
          </div>

          <div>
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
              Vault_Empty
            </h2>
            <p className="text-zinc-600 text-xs mt-3 tracking-widest uppercase">
              No units saved to favorites archive
            </p>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase italic tracking-widest text-[10px] overflow-hidden active:scale-95 transition-all"
          >
            <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <ArrowLeft
              size={13}
              className="relative z-10 group-hover:text-white transition-colors"
            />
            <span className="relative z-10 group-hover:text-white transition-colors">
              Browse_Archive
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030303] pb-20">
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] opacity-30 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600 hover:text-cyan-400 transition-colors mb-10"
        >
          <ArrowLeft
            size={13}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Return_to_Archive
        </button>

        {/* Header */}
        <div className="mb-10 border-b border-white/5 pb-8">
          <div className="flex items-center gap-3 text-cyan-500 mb-4">
            <RiTerminalBoxLine size={14} className="animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em]">
              Favorites_Vault // {favorites.length} Units Saved
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            Your
            <span className="text-cyan-500">_Vault</span>
          </h1>

          <div className="flex items-center gap-3 mt-4 font-mono text-[8px] uppercase tracking-widest text-zinc-600">
            <Heart size={10} className="text-red-500 fill-red-500" />
            <span>
              {favorites.length} saved{" "}
              {favorites.length === 1 ? "title" : "titles"} in archive
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
          {favorites.map((movie) => (
            <div key={movie.id} className="fav-card">
              <MovieCard
                movie={movie}
                type={movie.media_type || (movie.title ? "movie" : "tv")}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
