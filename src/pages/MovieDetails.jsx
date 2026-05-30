import { useNavigate, useParams } from "react-router-dom";
import {
  getMovieDetails,
  getMovieVideos,
  getWatchProviders,
} from "../services/movieApi";
import { useState, useEffect, useRef } from "react";
import { Loader } from "../components/Loader";
import {
  Play,
  ArrowLeft,
  X,
  Download,
  HardDrive,
  ExternalLink,
  Activity,
} from "lucide-react";
import { RiFingerprint2Line, RiTerminalBoxLine } from "react-icons/ri";
import gsap from "gsap";

export default function MovieDetailPage() {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const backdropRef = useRef(null);

  const streamUrl =
    type === "movie"
      ? `https://vidsrc.to/embed/movie/${id}`
      : `https://vidsrc.to/embed/tv/${id}`;

  const movieTitle = movie?.title || movie?.name || "Unknown";
  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie?.first_air_date
      ? new Date(movie.first_air_date).getFullYear()
      : "N/A";
  const runtime = movie?.runtime || movie?.episode_run_time?.[0] || null;
  const rating = movie?.vote_average?.toFixed(1) ?? "N/A";

  const downloadSources = [
    {
      name: "1337x // Ultra_HD",
      url: `https://1337x.to/search/${encodeURIComponent(movieTitle)}/1/`,
      type: "Magnet",
    },
    {
      name: "YTS // Optimized_1080p",
      url: `https://yts.mx/browse-movies/${encodeURIComponent(movieTitle)}/all/all/0/latest`,
      type: "Direct",
    },
    {
      name: "The_Pirate_Bay",
      url: `https://thepiratebay.org/search.php?q=${encodeURIComponent(movieTitle)}`,
      type: "Torrent",
    },
  ];

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const [details, video] = await Promise.all([
          getMovieDetails(id, type),
          getMovieVideos(id, type),
        ]);
        if (!cancelled) {
          setMovie(details);
          setTrailer(video);
        }
      } catch (err) {
        if (!cancelled) setError("DATA_LINK_FAILURE");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [id, type]);

  useEffect(() => {
    if (!loading && movie && backdropRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        backdropRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 0.25, scale: 1, duration: 1.5, ease: "power2.out" },
      ).fromTo(
        ".hud-element",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: "power3.out" },
        "-=1.2",
      );
    }
  }, [loading, movie]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsPlayerOpen(false);
        setIsDownloadOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  if (loading) return <Loader loading={true} />;

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-6 font-mono">
          <p className="text-cyan-500 text-[10px] tracking-[0.5em] uppercase">
            // Error_404
          </p>
          <h1 className="text-4xl font-black italic uppercase">
            Archive_Not_Found
          </h1>
          <p className="text-zinc-600 text-xs">
            {error || "Unit does not exist."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-cyan-500/50 text-[10px] uppercase tracking-widest transition-all"
          >
            <ArrowLeft size={13} /> Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030303] text-white overflow-x-hidden">
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] opacity-30" />

      {/* Backdrop */}
      <div ref={backdropRef} className="absolute inset-0 z-0 h-screen">
        {movie.backdrop_path ? (
          <>
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              className="w-full h-full object-cover grayscale"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/85 to-[#030303]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-[#030303]" />
        )}
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-20">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="hud-element group mb-10 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft
            size={13}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Return_to_Archive
        </button>

        <div className="grid lg:grid-cols-[300px_1fr] xl:grid-cols-[360px_1fr] gap-8 lg:gap-14 items-start">
          {/* Left */}
          <div className="hud-element space-y-6">
            {/* Poster */}
            <div className="relative group overflow-hidden border border-white/10 shadow-2xl">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movieTitle}
                  className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="aspect-[2/3] bg-zinc-900 flex items-center justify-center text-zinc-700 font-mono text-xs">
                  No_Poster
                </div>
              )}
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-[2px] bg-cyan-500" />
              <div className="absolute top-0 left-0 w-[2px] h-6 bg-cyan-500" />
              <div className="absolute bottom-0 right-0 w-6 h-[2px] bg-cyan-500/50" />
              <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-cyan-500/50" />
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Metadata HUD */}
            <div className="bg-[#0a0a0a] border border-white/5 p-5 space-y-5">
              <div className="flex items-center gap-3 text-cyan-500 border-b border-white/5 pb-4">
                <RiTerminalBoxLine size={14} />
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase">
                  Unit_Metadata
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Protocol",
                    value: type === "movie" ? "Feature" : "Series",
                  },
                  { label: "Clearance", value: `${rating}/10`, cyan: true },
                  { label: "Release", value: releaseYear },
                  {
                    label: "Runtime",
                    value: runtime ? `${runtime} min` : "N/A",
                  },
                ].map(({ label, value, cyan }) => (
                  <div key={label} className="space-y-1">
                    <p className="text-[7px] text-zinc-700 uppercase font-bold tracking-widest font-mono">
                      {label}
                    </p>
                    <p
                      className={`text-xs font-black italic uppercase font-mono ${cyan ? "text-cyan-500" : "text-white"}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="hud-element flex flex-col gap-7">
            {/* Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none">
                {movieTitle}
              </h1>
              {movie.tagline && (
                <p className="text-cyan-500 font-mono text-[10px] tracking-[0.2em] uppercase mt-3 opacity-70 italic">
                  // {movie.tagline}
                </p>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.slice(0, 5).map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 border border-white/10 bg-white/5 font-mono text-[8px] uppercase tracking-widest text-zinc-500"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
              <button
                onClick={() => setIsPlayerOpen(true)}
                className="group relative px-8 sm:px-10 py-4 bg-white text-black font-black uppercase italic tracking-widest text-[10px] flex items-center gap-3 overflow-hidden active:scale-95 transition-all"
              >
                <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                  <Play size={14} fill="currentColor" /> Initialize_Stream
                </span>
              </button>

              <button
                onClick={() => setIsDownloadOpen(true)}
                className="px-6 sm:px-8 py-4 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 text-zinc-500 hover:text-white transition-all font-black uppercase italic tracking-widest text-[10px] flex items-center gap-2"
              >
                <Download size={13} /> Breach_Data
              </button>
            </div>

            {/* Overview */}
            <div className="pl-4 border-l border-cyan-500/30 py-1">
              <h3 className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.4em] mb-3">
                Transmission_Log
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed italic">
                {movie.overview || "No data received for this unit."}
              </p>
            </div>

            {/* Trailer */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Activity size={13} className="text-cyan-500 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-600">
                  Visual_Confirmation
                </span>
              </div>
              {trailer ? (
                <div className="relative aspect-video w-full overflow-hidden border border-white/10 shadow-2xl group">
                  <iframe
                    className="absolute inset-0 w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                    src={`https://www.youtube.com/embed/${trailer.key}?modestbranding=1&rel=0`}
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute top-0 left-0 w-6 h-[2px] bg-cyan-500 pointer-events-none" />
                  <div className="absolute top-0 left-0 w-[2px] h-6 bg-cyan-500 pointer-events-none" />
                </div>
              ) : (
                <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center border border-dashed border-white/10">
                  <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
                    Video_Feed_Offline
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Player Modal */}
      {isPlayerOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4"
          onClick={() => setIsPlayerOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl aspect-video bg-black border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-6 h-[2px] bg-cyan-500" />
            <div className="absolute top-0 left-0 w-[2px] h-6 bg-cyan-500" />
            <button
              onClick={() => setIsPlayerOpen(false)}
              className="absolute -top-10 right-0 text-zinc-500 hover:text-cyan-400 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest transition-colors"
            >
              Close_Session <X size={14} />
            </button>
            <iframe
              src={streamUrl}
              className="w-full h-full"
              title="Player"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Download Modal */}
      {isDownloadOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsDownloadOpen(false)}
        >
          <div
            className="w-full max-w-md space-y-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-5">
              <div className="p-5 border border-cyan-500/20 bg-cyan-500/5 text-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                <RiFingerprint2Line size={40} className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase">
                  Initiate <span className="text-cyan-500">Breach</span>
                </h2>
                <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.3em] mt-2">
                  Target_ID: {movieTitle}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {downloadSources.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-white/5 bg-[#0a0a0a] hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <HardDrive
                      size={14}
                      className="text-zinc-700 group-hover:text-cyan-500 transition-colors"
                    />
                    <div className="text-left">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-white">
                        {s.name}
                      </p>
                      <p className="font-mono text-[8px] uppercase text-zinc-600 mt-0.5">
                        {s.type}
                      </p>
                    </div>
                  </div>
                  <ExternalLink
                    size={12}
                    className="text-zinc-700 group-hover:text-cyan-500 transition-colors"
                  />
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsDownloadOpen(false)}
              className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-700 hover:text-white transition-colors"
            >
              // Abort_Infiltration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
