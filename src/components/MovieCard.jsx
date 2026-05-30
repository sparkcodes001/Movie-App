import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import { Star, Info, Heart } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function MovieCard({ movie, type }) {
  const { favorites, addFavorite, removeFavorite } = useMovies();
  const navigate = useNavigate();
  const container = useRef();
  const isFavorite = favorites.some((m) => m.id === movie.id);

  const { contextSafe } = useGSAP({ scope: container });

  // Elastic Hover Effect
  const onMouseEnter = contextSafe(() => {
    gsap.to(container.current, {
      scale: 1.03,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
      borderColor: "rgba(6, 182, 212, 0.5)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(6, 182, 212, 0.1)",
      overwrite: "auto",
    });
    gsap.to(".movie-img", { scale: 1.1, duration: 0.6, ease: "power2.out" });
    gsap.to(".card-details", { y: 0, opacity: 1, duration: 0.4 });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to(container.current, {
      scale: 1,
      duration: 0.4,
      borderColor: "rgba(255, 255, 255, 0.05)",
      boxShadow: "0 0 0px rgba(0,0,0,0)",
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(".movie-img", { scale: 1, duration: 0.4 });
  });

  return (
    <div
      ref={container}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative bg-zinc-950 rounded-xl overflow-hidden border border-white/5 transition-colors cursor-pointer"
      onClick={() => navigate(`/${type}/${movie.id}`)}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder.png"
          }
          alt={movie.title}
          className="movie-img w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
        />

        {/* Subtle Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90" />

        {/* Favorite Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isFavorite ? removeFavorite(movie.id) : addFavorite(movie);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md z-20 transition-all active:scale-75 ${
            isFavorite
              ? "bg-cyan-500 text-black shadow-[0_0_15px_cyan]"
              : "bg-black/40 text-white/70 hover:bg-black/60"
          }`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 relative">
        <h2 className="font-bold text-sm text-white line-clamp-1 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
          {movie.name || movie.title}
        </h2>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
            <Star size={12} className="text-cyan-500" fill="currentColor" />
            <span className="text-[10px] font-mono font-black text-cyan-500">
              {movie.vote_average?.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            {movie.release_date?.split("-")[0] || "2024"}
          </div>
        </div>
      </div>
    </div>
  );
}
