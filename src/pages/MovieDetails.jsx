import { useNavigate, useParams } from "react-router-dom";
import {
  getMovieDetails,
  getMovieVideos,
  getWatchProviders,
} from "../services/movieApi";
import { useState, useEffect } from "react";
import { Loader } from "../components/Loader";

export default function MovieDetailPage() {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [movie, setMovie] = useState();
  const [trailer, setTrailer] = useState();
  const [providers, SetProviders] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMovie() {
      setLoading(true);

      try {
        const data = await getMovieDetails(id, type);
        const video = await getMovieVideos(id, type);
        const movieProvider = await getWatchProviders(id, type);

        setMovie(data);
        setTrailer(video);
        SetProviders(movieProvider);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id, type]);

  if (loading || !movie) {
    return <Loader loading={true} />;
  }

  const country =
    providers?.results?.NG ||
    providers?.results?.US ||
    Object.values(providers?.results || {})[0];

  const affiliateLinks = {
    Netflix: "https://www.netflix.com",
    "Amazon Prime Video": "https://www.amazon.com/primevideo",
    "Apple TV": "https://tv.apple.com",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
        {/* 🎞 Poster */}
        <div className="flex justify-center">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
            alt={movie?.title}
            className="rounded-2xl shadow-2xl w-full max-w-sm hover:scale-105 transition duration-300"
          />
        </div>

        {/* 📄 Details */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold">
            {movie?.title || movie?.name}
          </h1>
          {/* Tagline */}
          <p className="italic text-gray-400 font-serif hover:bg-slate-500 w-fit rounded-xl px-2">
            {movie?.tagline}
          </p>

          {/* Overview */}
          <p className="text-gray-300 leading-relaxed ">{movie?.overview}</p>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <p>⭐ Popularity: {movie?.popularity}</p>
            <p>📅 Release: {movie?.release_date || movie?.first_air_date}</p>
            <p>🌍 Country: {movie?.production_countries?.[0]?.name}</p>
            <p>⭐ Rating: {movie?.vote_average}</p>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mt-2">
            {movie?.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm border border-red-400/30"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* STREAMING */}
          {country?.flatrate?.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {country.flatrate.map((p) => (
                <a
                  key={p.provider_id}
                  href={affiliateLinks[p.provider_name] || country.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
                >
                  Watch on {p.provider_name}
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-2">
              No streaming options available in your region.
            </p>
          )}

          {/* Trailer */}
          {trailer ? (
            <div className="mt-6 w-full aspect-video">
              <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="bg-black/45 p-5 flex justify-center items-center rounded-xl cursor-default hover:bg-black/40 h-full">
              <div className="text-xl">Trailer is not available!</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition group mt-3"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          Back to Movies
        </button>
      </div>
    </div>
  );
}
