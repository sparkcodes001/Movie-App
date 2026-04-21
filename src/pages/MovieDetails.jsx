import { useNavigate, useParams } from "react-router-dom";
import {
  getMovieDetails,
  getMovieVideos,
  getWatchProviders,
} from "../services/movieApi";
import { useState, useEffect } from "react";
import { Loader } from "../components/Loader";
import { Star, Calendar, Globe, Play, ArrowLeft, Monitor } from "lucide-react";

export default function MovieDetailPage() {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [movie, setMovie] = useState();
  const [trailer, setTrailer] = useState();
  const [providers, setProviders] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMovie() {
      setLoading(true);
      try {
        const [details, video, movieProvider] = await Promise.all([
          getMovieDetails(id, type),
          getMovieVideos(id, type),
          getWatchProviders(id, type),
        ]);
        setMovie(details);
        setTrailer(video);
        setProviders(movieProvider);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [id, type]);

  if (loading || !movie) return <Loader loading={true} />;

  const country =
    providers?.results?.NG ||
    providers?.results?.US ||
    Object.values(providers?.results || {})[0];

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* 1. CINEMATIC BACKDROP */}
      <div className="absolute inset-0 z-0 h-[60vh] md:h-screen">
        <img
          src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
          className="w-full h-full object-cover opacity-30"
          alt="backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6 pb-20">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all mb-8 backdrop-blur-md"
        >
          <ArrowLeft size={18} /> <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-[350px_1fr] gap-12">
          {/* 🎞 POSTER COLUMN */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 shadow-cyan-500/10">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                alt={movie?.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* STREAMING PROVIDERS */}
            {country?.flatrate?.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">
                <h3 className="flex items-center gap-2 text-sm font-bold text-cyan-500 uppercase tracking-widest mb-4">
                  <Monitor size={16} /> Available On
                </h3>
                <div className="flex flex-wrap gap-4">
                  {country.flatrate.map((p) => (
                    <div key={p.provider_id} className="group relative">
                      <img
                        src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                        className="w-10 h-10 rounded-xl transition-transform group-hover:scale-110"
                        alt={p.provider_name}
                      />
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {p.provider_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 📄 DETAILS COLUMN */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
                {movie?.title || movie?.name}
              </h1>
              {movie?.tagline && (
                <p className="text-xl text-cyan-400/80 italic font-medium">
                  "{movie?.tagline}"
                </p>
              )}
            </div>

            {/* QUICK STATS */}
            <div className="flex flex-wrap gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Star
                  size={20}
                  className="text-yellow-500"
                  fill="currentColor"
                />
                <span className="font-bold text-lg">
                  {movie?.vote_average?.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-cyan-500" />
                <span>
                  {new Date(
                    movie?.release_date || movie?.first_air_date,
                  ).getFullYear()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={20} className="text-cyan-500" />
                <span>
                  {movie?.production_countries?.[0]?.iso_3166_1 || "Global"}
                </span>
              </div>
            </div>

            {/* GENRES */}
            <div className="flex flex-wrap gap-2">
              {movie?.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-cyan-500/20"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* OVERVIEW */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold uppercase tracking-widest text-gray-400">
                Overview
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
                {movie?.overview}
              </p>
            </div>

            {/* TRAILER SECTION */}
            <div className="mt-4">
              <h3 className="flex items-center gap-2 text-lg font-bold uppercase tracking-widest text-gray-400 mb-4">
                <Play size={20} fill="currentColor" /> Official Trailer
              </h3>
              {trailer ? (
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${trailer.key}?rel=0&showinfo=0`}
                    title="Trailer"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video bg-white/5 border border-dashed border-white/10 rounded-3xl flex items-center justify-center text-gray-500">
                  Trailer not available for this title
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
