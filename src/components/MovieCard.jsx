import { useRef } from "react"; // Added useRef
import { useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import { Star, Info, Heart } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap"; // Import gsap core

export function MovieCard({ movie, type }) {
  const { favorites, addFavorite, removeFavorite } = useMovies();
  const navigate = useNavigate();
  const container = useRef(); // Ref for the card container
  const isFavorite = favorites.some((m) => m.id === movie.id);

  // 1. Entrance & Hover Animations
  const { contextSafe } = useGSAP(
    () => {
      // Entrance Animation: Cards fade in and slide up
      gsap.from(container.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: Math.random() * 0.3, // Slight random stagger
      });
    },
    { scope: container },
  );

  // 2. ContextSafe Hover Effects (The "Elastic" feel)
  const onMouseEnter = contextSafe(() => {
    gsap.to(container.current, {
      scale: 1.03,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)", // Using the ease you mentioned
      overwrite: "auto",
    });
    // Zoom the image slightly
    gsap.to(".movie-img", {
      scale: 1.1,
      duration: 0.6,
      ease: "power2.out",
    });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to(container.current, {
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(".movie-img", {
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  });

  return (
    <div
      ref={container}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-white/5 shadow-lg"
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder.png"
          }
          alt={movie.title}
          className="movie-img w-full h-full object-cover" // Added movie-img class
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />

        {/* Top Actions */}
        <button
          onClick={() =>
            isFavorite ? removeFavorite(movie.id) : addFavorite(movie)
          }
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? "bg-red-600 text-white"
              : "bg-black/40 text-white/70 hover:bg-black/60"
          }`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h2 className="font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {movie.name || movie.title}
        </h2>

        <div className="flex items-center gap-1 justify-between mt-3">
          <span className="flex items-center gap-[2px] text-yellow-500 text-sm font-bold">
            <Star size={14} fill="currentColor" />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </span>

          <button
            onClick={() => navigate(`/${type}/${movie.id}`)}
            className="flex items-center gap-1 text-[0.8rem] font-bold uppercase tracking-wider text-cyan-500 hover:text-cyan-400"
          >
            Details <Info size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
