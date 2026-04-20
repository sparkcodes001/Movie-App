import { MovieCard } from "../components/MovieCard";
import { useMovies } from "../context/MovieContext";

export default function FavoritePage({ type }) {
  const { favorites } = useMovies();

  if (!favorites.length)
    return (
      <p className="p-4 text-center text-3xl font-black text-gray-300">
        No favorites yet!
      </p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {favorites.map((movie) => (
        <MovieCard key={movie.id} movie={movie} type={type} />
      ))}
    </div>
  );
}
