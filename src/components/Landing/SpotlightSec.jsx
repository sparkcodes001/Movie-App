import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Star, Plus, Info, Activity, Target } from "lucide-react";
import { getContent } from "../../services/movieApi";

gsap.registerPlugin(ScrollTrigger);

const SpotlightSec = () => {
  const [movie, setMovie] = useState(null);
  const containerRef = useRef();
  const heroRef = useRef();
  const titleRef = useRef();
  const hudElements = useRef([]);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await getContent({ type: "movie" });
      if (data?.results) setMovie(data.results[Math.floor(Math.random() * 10)]);
    };
    loadMovies();
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current || window.innerWidth < 1024) return;

    const { clientX, clientY } = e;
    const xPct = clientX / window.innerWidth - 0.5;
    const yPct = clientY / window.innerHeight - 0.5;

    gsap.to(heroRef.current, {
      rotateY: xPct * 15,
      rotateX: -yPct * 15,
      duration: 1.2,
      ease: "power2.out",
    });

    gsap.to(titleRef.current, {
      x: -xPct * 60,
      y: -yPct * 60,
      duration: 2,
    });

    hudElements.current.forEach((el, i) => {
      if (!el) return;
      const depth = (i + 1) * 20;
      gsap.to(el, {
        x: xPct * depth,
        y: yPct * depth,
        duration: 0.8 + i * 0.1,
      });
    });
  };

  useGSAP(() => {
    if (!movie) return;

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
      { z: 200, opacity: 0, scale: 1.3 },
      { z: 0, opacity: 1, scale: 1, duration: 1.5, ease: "expo.out" },
    ).from(
      ".hud-card-v2",
      {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
      },
      "-=1",
    );

    gsap.to(".bg-image", {
      scale: 1.15,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "linear",
    });
  }, [movie]);

  if (!movie) return null;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen md:h-screen w-full bg-[#020202] overflow-hidden text-white flex flex-col md:flex-row items-center justify-center p-6 md:p-0 [perspective:1200px]"
    >
      {/* 1. CINEMATIC BACKDROP */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-transparent z-10 hidden md:block" />
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          className="bg-image w-full h-full object-cover opacity-20 grayscale"
          alt="background"
        />
      </div>

      {/* 2. BACKGROUND TYPOGRAPHY */}
      <div
        ref={titleRef}
        className="absolute inset-0 flex items-center justify-center z-10 select-none pointer-events-none p-4"
      >
        <h2 className="text-[22vw] md:text-[20vw] font-black italic tracking-tighter leading-[0.8] text-center text-white/[0.03] md:text-white/[0.05] uppercase break-words overflow-hidden">
          {movie.title.split(" ")[0]}
        </h2>
      </div>

      {/* 3. HERO POSTER */}
      <div
        className="relative z-30 pointer-events-none mt-10 md:mt-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={heroRef}
          className="relative shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-20" />
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh] rounded-lg border border-white/10 relative z-10"
            alt={movie.title}
          />
        </div>
      </div>

      {/* 4. INTERACTIVE HUD INTERFACE */}
      <div className="absolute inset-0 z-40 px-5 md:px-12 py-8 md:py-16 flex flex-col justify-between pointer-events-none">
        {/* TOP HUD */}
        <div className="flex justify-between items-start w-full">
          <div
            ref={(el) => (hudElements.current[0] = el)}
            className="hud-card-v2 p-3 md:p-5 rounded-xl md:rounded-2xl bg-black/60 border border-white/10 backdrop-blur-2xl flex gap-3 md:gap-5 items-center shadow-2xl"
          >
            <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
              <svg className="absolute w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="126"
                  strokeDashoffset={126 - (126 * movie.vote_average) / 10}
                />
              </svg>
              <span className="text-xs md:text-lg font-black italic text-cyan-400">
                {movie.vote_average.toFixed(1)}
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
            className="hud-card-v2 px-4 py-2 bg-white/5 border border-white/10 rounded-full flex gap-3 items-center backdrop-blur-md"
          >
            <Activity size={12} className="text-cyan-400 animate-pulse" />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">
              Live Feed
            </span>
          </div>
        </div>

        {/* BOTTOM HUD */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div
            ref={(el) => (hudElements.current[2] = el)}
            className="hud-card-v2 w-full md:max-w-lg space-y-4 md:space-y-6 pointer-events-auto"
          >
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] mb-4">
                {movie.title}
              </h1>
              <div className="relative text-zinc-400 text-xs md:text-sm leading-relaxed border-l-2 border-cyan-500/30 pl-4 italic line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                <p>{movie.overview}</p>
              </div>
            </div>

            <div className="flex flex-row gap-3">
              <button className="flex-1 md:flex-none h-12 md:h-14 px-6 md:px-10 bg-white text-black font-black uppercase tracking-tighter italic rounded-sm transition-all active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden">
                <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white">
                  <Play size={16} fill="currentColor" /> Stream
                </span>
              </button>

              <button className="h-12 w-12 md:h-14 md:w-14 border border-white/20 flex items-center justify-center rounded-sm hover:bg-white hover:text-black transition-all backdrop-blur-md">
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* METADATA - Hidden on small mobile */}
          <div
            ref={(el) => (hudElements.current[3] = el)}
            className="hud-card-v2 hidden sm:flex bg-zinc-900/80 border border-white/5 p-4 md:p-5 rounded-sm backdrop-blur-xl flex-col gap-4 pointer-events-auto shadow-2xl min-w-[160px]"
          >
            <div className="flex items-center gap-4">
              <Target size={16} className="text-cyan-500" />
              <div>
                <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.2em]">
                  Release
                </p>
                <p className="text-xs md:text-sm font-black italic">
                  {movie.release_date.split("-")[0]}
                </p>
              </div>
            </div>
            <div className="h-[1px] w-full bg-white/5" />
            <button className="flex items-center justify-between group text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-cyan-400 transition-colors">
              Full Data <Info size={12} className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. POST-PROCESSING */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] md:shadow-[inset_0_0_300px_rgba(0,0,0,0.9)]" />
      </div>
    </section>
  );
};

export default SpotlightSec;
