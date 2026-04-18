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
    <div className="grid grid-cols-2 gap-4 absolutejustify-center p-4 md:grid-cols-4">
      {favorites.map((movie) => (
        <MovieCard key={movie.id} movie={movie} type={type} />
      ))}
    </div>
  );
}
