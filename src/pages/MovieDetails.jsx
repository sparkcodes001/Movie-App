import { useNavigate, useParams } from "react-router-dom";
import {
  getMovieDetails,
  getMovieVideos,
  getWatchProviders,
} from "../services/movieApi";
import { useState, useEffect } from "react";
import { Loader } from "../components/Loader";
import {
  Star,
  Calendar,
  Globe,
  Play,
  ArrowLeft,
  Monitor,
  X,
  Download,
  HardDrive,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";

export default function MovieDetailPage() {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [movie, setMovie] = useState();
  const [trailer, setTrailer] = useState();
  const [providers, setProviders] = useState();
  const [loading, setLoading] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // FIXED: Improved URLs for better reliability
  const streamUrl =
    type === "movie"
      ? `https://vidsrc.to/embed/movie/${id}`
      : `https://vidsrc.to/embed/tv/${id}`;

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
        console.log("Error loading movie details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [id, type]);

  if (loading || !movie) return <Loader loading={true} />;

  const movieTitle = movie?.title || movie?.name;
  const downloadSources = [
    {
      name: "YTS (Best for 720p/1080p)",
      url: `https://yts.mx/browse-movies/${movieTitle}/all/all/0/latest/0/all`,
      type: "Torrent/Direct",
    },
    {
      name: "GoMovies (Direct Download)",
      url: `https://vidsrc.to/download/movie/${id}`,
      type: "Direct",
    },
    {
      name: "SSR Movies (Multi-Quality)",
      url: `https://ssrmovies.win/?s=${movieTitle}`,
      type: "Direct/Cloud",
    },
  ];

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
          {/* POSTER COLUMN */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 shadow-cyan-500/10">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                alt={movie?.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* STREAMING PROVIDERS (Legal links) */}
            {country?.flatrate?.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">
                <h3 className="flex items-center gap-2 text-sm font-bold text-cyan-500 uppercase tracking-widest mb-4">
                  <Monitor size={16} /> Legal Streaming
                </h3>
                <div className="flex flex-wrap gap-4">
                  {country.flatrate.map((p) => (
                    <div key={p.provider_id} className="group relative">
                      <img
                        src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                        className="w-10 h-10 rounded-xl transition-transform group-hover:scale-110"
                        alt={p.provider_name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DETAILS COLUMN */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 italic">
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
              <div className="flex items-center gap-2 font-bold">
                <Calendar size={20} className="text-cyan-500" />
                <span>
                  {new Date(
                    movie?.release_date || movie?.first_air_date,
                  ).getFullYear()}
                </span>
              </div>
            </div>

            {/* WATCH NOW BUTTON */}
            {/* DOWNLOAD & WATCH BUTTONS */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={() => setIsPlayerOpen(true)}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-cyan-600/40"
              >
                <Play size={20} fill="currentColor" /> Watch Now
              </button>

              <button
                onClick={() => setIsDownloadOpen(true)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95"
              >
                <Download size={20} /> Download
              </button>
            </div>

            {/* DOWNLOAD MODAL */}
            {isDownloadOpen && (
              <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
                <div className="relative w-full max-w-md bg-gray-900 border border-white/10 rounded-3xl p-6 shadow-2xl">
                  <button
                    onClick={() => setIsDownloadOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                  >
                    <X size={24} />
                  </button>

                  <div className="text-center mb-6">
                    <div className="bg-cyan-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                      <Download className="text-cyan-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-black italic tracking-tighter">
                      DOWNLOAD<span className="text-cyan-500">HUB</span>
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      Select a download source for "{movieTitle}"
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {downloadSources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <HardDrive
                            className="text-gray-500 group-hover:text-cyan-500"
                            size={20}
                          />
                          <div>
                            <p className="font-bold text-sm text-white">
                              {source.name}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                              {source.type}
                            </p>
                          </div>
                        </div>
                        <ExternalLink size={16} className="text-gray-600" />
                      </a>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex gap-3">
                    <ShieldAlert
                      className="text-yellow-500 shrink-0"
                      size={18}
                    />
                    <p className="text-[10px] text-yellow-500/80 leading-relaxed">
                      Downloads are provided by external indexers. We recommend
                      using a VPN and a browser with an AdBlocker for safety.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* OVERVIEW */}
            <div className="space-y-3 mt-4">
              <h3 className="text-lg font-bold uppercase tracking-widest text-gray-400">
                Overview
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
                {movie?.overview}
              </p>
            </div>

            {/* TRAILER SECTION */}
            <div className="mt-8">
              <h3 className="flex items-center gap-2 text-lg font-bold uppercase tracking-widest text-gray-400 mb-4">
                <Play size={20} fill="none" /> Official Trailer
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
                <div className="aspect-video bg-white/5 border border-dashed border-white/10 rounded-3xl flex items-center justify-center text-gray-500 italic">
                  Trailer not available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO PLAYER MODAL */}
      {isPlayerOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsPlayerOpen(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[110] bg-black/60 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-xl"
            >
              <X size={24} />
            </button>

            {/* THE PLAYER IFRAME */}
            <iframe
              src={streamUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
