import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import { Star, Heart } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function MovieCard({ movie, type }) {
  const { favorites, addFavorite, removeFavorite } = useMovies();
  const navigate = useNavigate();

  const container = useRef();
  const imgRef = useRef();
  const overlayRef = useRef();

  const isFavorite = favorites.some((m) => m.id === movie.id);
  const { contextSafe } = useGSAP({ scope: container });

  const onMouseEnter = contextSafe(() => {
    gsap.to(container.current, {
      borderColor: "rgba(6, 182, 212, 0.4)",
      boxShadow:
        "0 0 30px rgba(6, 182, 212, 0.08), 0 20px 40px rgba(0,0,0,0.6)",
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(imgRef.current, {
      scale: 1.06,
      filter: "grayscale(0%)",
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.4,
      overwrite: "auto",
    });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to(container.current, {
      borderColor: "rgba(255, 255, 255, 0.05)",
      boxShadow: "none",
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(imgRef.current, {
      scale: 1,
      filter: "grayscale(30%)",
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      overwrite: "auto",
    });
  });

  const title = movie.title || movie.name || "Untitled";
  const year =
    movie.release_date?.split("-")[0] ||
    movie.first_air_date?.split("-")[0] ||
    "—";
  const rating = movie.vote_average?.toFixed(1) ?? "N/A";
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.png";

  return (
    <div
      ref={container}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => navigate(`/${type}/${movie.id}`)}
      className="relative bg-[#0a0a0a] overflow-hidden border border-white/5 cursor-pointer group"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          ref={imgRef}
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover"
          style={{ filter: "grayscale(30%)" }}
        />

        {/* Scanline */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] opacity-60" />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Cyan hover overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-cyan-500/5 pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* Top-left accent line */}
        <div className="absolute top-0 left-0 w-8 h-[2px] bg-cyan-500/60" />
        <div className="absolute top-0 left-0 w-[2px] h-8 bg-cyan-500/60" />

        {/* Rating */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 border border-white/10 px-1.5 py-0.5">
          <Star size={8} className="text-cyan-500" fill="currentColor" />
          <span className="text-[9px] font-mono font-black text-cyan-500">
            {rating}
          </span>
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isFavorite ? removeFavorite(movie.id) : addFavorite(movie);
          }}
          className={`absolute top-2 left-2 p-1.5 transition-all duration-200 active:scale-75 border ${
            isFavorite
              ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.5)]"
              : "bg-black/60 border-white/10 text-white/50 hover:border-white/30 hover:text-white"
          }`}
        >
          <Heart size={12} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h2 className="font-black text-xs text-white line-clamp-1 uppercase tracking-tight font-mono">
          {title}
        </h2>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-700 border border-zinc-800 px-1.5 py-0.5">
            {type === "movie" ? "Film" : "Series"}
          </span>
          <span className="text-[8px] font-mono text-zinc-600 uppercase">
            {year}
          </span>
        </div>
      </div>
    </div>
  );
}
