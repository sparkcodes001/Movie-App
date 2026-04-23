import { MovieCard } from "../components/MovieCard";
import { useMovies } from "../context/MovieContext";
import { Heart, ArrowLeft, Home } from "lucide-react"; // Added Home icon
import { useNavigate } from "react-router-dom";

export default function FavoritePage({ type }) {
  const { favorites } = useMovies();
  const navigate = useNavigate();

  // EMPTY STATE
  if (favorites.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-white/5 p-6 rounded-full mb-6 backdrop-blur-xl border border-white/10">
          <Heart size={48} className="text-gray-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Your Library is Empty
        </h2>
        <p className="text-gray-400 max-w-sm mb-8">
          You haven't added any movies or TV shows to your favorites yet. Start
          exploring!
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-cyan-600/20 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Browse Movies
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* 1. TOP NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-md group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-semibold">Back to Home</span>
        </button>
      </div>

      {/* 2. HEADER */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-8">
        <div className="flex items-end gap-3 mb-2">
          <Heart size={32} className="text-red-500 mb-1" fill="currentColor" />
          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase">
            Your<span className="text-cyan-500">Favorites</span>
          </h1>
        </div>
        <p className="text-gray-400 ml-1 font-medium">
          Showing {favorites.length} saved{" "}
          {favorites.length === 1 ? "title" : "titles"}
        </p>
      </div>

      {/* 3. GRID LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
        {favorites.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            type={movie.media_type || type}
          />
        ))}
      </div>
    </div>
  );
}
