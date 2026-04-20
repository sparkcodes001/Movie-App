import { useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";

export function MovieCard({ movie, type }) {
  const { favorites, addFavorite, removeFavorite } = useMovies();
  const navigate = useNavigate();

  const isFavorite = favorites.some((m) => m.id === movie.id);

  function handleFavorite() {
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  }

  return (
    <div className="relative overflow-hidden text-white bg-gray-900 border border-gray-700 rounded-lg shadow-md transition-transform hover:scale-105 duration-300">
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "no-image.png"
        }
        alt={movie.name || movie.title}
        className="object-cover w-full h-60 sm:h-72 md:h-80"
      />

      <div className="p-2 sm:p-3">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold">
          <p>{movie.name || movie.title}</p>
        </h2>
        <p className="text-sm text-gray-400 mt-2">⭐ {movie.vote_average}</p>
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavorite}
        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all duration-300 
        ${
          isFavorite
            ? "bg-red-500/80 border-red-400 shadow-md shadow-red-500/40"
            : "bg-white/10 border-white/20 hover:bg-white/20"
        }
      `}
      >
        <span className="text-white text-lg">❤️</span>
      </button>

      <button
        className="text-xs sm:text-sm text-sky-400 px-2 absolute right-2 bottom-2"
        onClick={() => navigate(`/${type}/${movie.id}`)}
      >
        More Info →
      </button>
    </div>
  );
}
