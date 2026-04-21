import { useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import { Star, Info, Heart } from "lucide-react";

export function MovieCard({ movie, type }) {
  const { favorites, addFavorite, removeFavorite } = useMovies();
  const navigate = useNavigate();
  const isFavorite = favorites.some((m) => m.id === movie.id);

  return (
    <div className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-white/5 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Image Container */}
      <div className="relative aspect-[2/3]">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder.png"
          }
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />

        {/* Top Actions */}
        <button
          onClick={() =>
            isFavorite ? removeFavorite(movie.id) : addFavorite(movie)
          }
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
            isFavorite
              ? "bg-red-600 text-white"
              : "bg-black/40 text-white/70 hover:bg-black/60"
          }`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {movie.name || movie.title}
        </h2>

        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
            <Star size={14} fill="currentColor" />{" "}
            {movie.vote_average?.toFixed(1)}
          </span>

          <button
            onClick={() => navigate(`/${type}/${movie.id}`)}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            Details <Info size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
