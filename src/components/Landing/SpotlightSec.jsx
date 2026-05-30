import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Star, Plus, Info, Activity, Target } from "lucide-react";
import { getContent } from "../../services/movieApi";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const SpotlightSec = () => {
  const [movie, setMovie] = useState(null);
  const containerRef = useRef();
  const heroRef = useRef();
  const titleRef = useRef();
  const hudElements = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const loadMovies = async () => {
      try {
        const data = await getContent({ type: "movie", category: "popular" });
        if (!cancelled && data?.results) {
          setMovie(data.results[Math.floor(Math.random() * 10)]);
        }
      } catch (err) {
        console.error("Spotlight fetch error:", err);
      }
    };
    loadMovies();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current || window.innerWidth < 1024) return;
    const xPct = e.clientX / window.innerWidth - 0.5;
    const yPct = e.clientY / window.innerHeight - 0.5;

    gsap.to(heroRef.current, {
      rotateY: xPct * 12,
      rotateX: -yPct * 12,
      duration: 1.2,
      ease: "power2.out",
    });

    if (titleRef.current) {
      gsap.to(titleRef.current, {
        x: -xPct * 40,
        y: -yPct * 40,
        duration: 2,
      });
    }

    hudElements.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        x: xPct * (i + 1) * 15,
        y: yPct * (i + 1) * 15,
        duration: 0.8 + i * 0.1,
      });
    });
  };

  useGSAP(() => {
    if (!movie || !containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=1500",
        pin: true,
        scrub: 1,
      },
    });

    tl.fromTo(
      heroRef.current,
      { z: 150, opacity: 0, scale: 1.2 },
      { z: 0, opacity: 1, scale: 1, duration: 1.5, ease: "expo.out" },
    ).from(
      ".hud-card-v2",
      { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 },
      "-=1",
    );

    gsap.to(".bg-image", {
      scale: 1.12,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "linear",
    });
  }, [movie]);

  const handleStream = () => {
    const hasAccess = localStorage.getItem("vault_access") === "granted";
    if (!hasAccess) {
      document
        .getElementById("footer-section")
        ?.scrollIntoView({ behavior: "smooth" });
    } else if (movie) {
      navigate(`/movie/${movie.id}`);
    }
  };

  if (!movie) return null;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen md:h-screen w-full bg-[#020202] overflow-hidden text-white flex flex-col md:flex-row items-center justify-center p-6 md:p-0"
      style={{ perspective: "1200px" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-transparent z-10 hidden md:block" />
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          className="bg-image w-full h-full object-cover opacity-20 grayscale"
          alt=""
        />
      </div>

      {/* Background typography */}
      <div
        ref={titleRef}
        className="absolute inset-0 flex items-center justify-center z-10 select-none pointer-events-none p-4 overflow-hidden"
      >
        <h2 className="text-[22vw] md:text-[20vw] font-black italic tracking-tighter leading-none text-center text-white/[0.03] uppercase">
          {movie.title?.split(" ")[0] || "NOIR"}
        </h2>
      </div>

      {/* Poster */}
      <div
        className="relative z-30 pointer-events-none mt-10 md:mt-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={heroRef}
          className="relative shadow-[0_0_60px_rgba(0,0,0,0.8)] rounded-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-20 rounded-lg" />
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh] rounded-lg border border-white/10 relative z-10"
              alt={movie.title}
            />
          )}
        </div>
      </div>

      {/* HUD Interface */}
      <div className="absolute inset-0 z-40 px-5 md:px-12 py-8 md:py-16 flex flex-col justify-between pointer-events-none">
        {/* Top HUD */}
        <div className="flex justify-between items-start w-full">
          <div
            ref={(el) => (hudElements.current[0] = el)}
            className="hud-card-v2 p-3 md:p-5 rounded-xl md:rounded-2xl bg-black/60 border border-white/10 backdrop-blur-2xl flex gap-3 md:gap-5 items-center shadow-2xl"
          >
            <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center shrink-0">
              <svg
                className="absolute w-full h-full -rotate-90"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="94.2"
                  strokeDashoffset={94.2 - (94.2 * movie.vote_average) / 10}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-xs md:text-sm font-black italic text-cyan-400">
                {movie.vote_average?.toFixed(1)}
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={8}
                    className="fill-cyan-500 text-cyan-500"
                  />
                ))}
              </div>
              <p className="text-[8px] uppercase font-black tracking-widest text-zinc-500">
                Data Rating
              </p>
            </div>
          </div>

          <div
            ref={(el) => (hudElements.current[1] = el)}
            className="hud-card-v2 px-3 md:px-4 py-2 bg-white/5 border border-white/10 rounded-full flex gap-2 md:gap-3 items-center backdrop-blur-md"
          >
            <Activity size={12} className="text-cyan-400 animate-pulse" />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">
              Live Feed
            </span>
          </div>
        </div>

        {/* Bottom HUD */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 md:gap-6">
          <div
            ref={(el) => (hudElements.current[2] = el)}
            className="hud-card-v2 w-full md:max-w-lg space-y-4 md:space-y-6 pointer-events-auto"
          >
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] mb-3">
                {movie.title}
              </h1>
              <div className="text-zinc-400 text-xs md:text-sm leading-relaxed border-l-2 border-cyan-500/30 pl-4 italic line-clamp-2 md:line-clamp-3">
                {movie.overview}
              </div>
            </div>

            <div className="flex flex-row gap-3">
              <button
                onClick={handleStream}
                className="flex-1 md:flex-none h-11 md:h-14 px-6 md:px-10 bg-white text-black font-black uppercase tracking-tighter italic transition-all active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                  <Play size={15} fill="currentColor" /> Stream
                </span>
              </button>

              <button className="h-11 w-11 md:h-14 md:w-14 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all backdrop-blur-md">
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div
            ref={(el) => (hudElements.current[3] = el)}
            className="hud-card-v2 hidden sm:flex bg-zinc-900/80 border border-white/5 p-4 md:p-5 backdrop-blur-xl flex-col gap-4 pointer-events-auto shadow-2xl min-w-[150px]"
          >
            <div className="flex items-center gap-3">
              <Target size={14} className="text-cyan-500 shrink-0" />
              <div>
                <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.2em]">
                  Release
                </p>
                <p className="text-xs md:text-sm font-black italic">
                  {movie.release_date?.split("-")[0] || "TBA"}
                </p>
              </div>
            </div>
            <div className="h-[1px] w-full bg-white/5" />
            <button
              onClick={handleStream}
              className="flex items-center justify-between group text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-cyan-400 transition-colors pointer-events-auto"
            >
              Full Data <Info size={12} className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Post-processing */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-20" />
      </div>
    </section>
  );
};

export default SpotlightSec;
