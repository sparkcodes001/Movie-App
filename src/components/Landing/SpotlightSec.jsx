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
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef();
  const heroRef = useRef();
  const titleRef = useRef();
  const hudElements = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  useGSAP(
    () => {
      if (!movie || !containerRef.current) return;

      // Only pin on desktop
      if (!isMobile) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=1000",
            pin: true,
            scrub: 1,
          },
        });

        tl.fromTo(
          heroRef.current,
          { z: 100, opacity: 0, scale: 1.1 },
          { z: 0, opacity: 1, scale: 1, duration: 1, ease: "expo.out" },
        ).from(
          ".hud-card-v2",
          { opacity: 0, y: 20, stagger: 0.1, duration: 0.6 },
          "-=0.8",
        );
      } else {
        // Mobile: simple fade-in on scroll, no pin
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
        gsap.fromTo(
          ".hud-card-v2",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      gsap.to(".bg-image", {
        scale: 1.08,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "linear",
      });
    },
    { dependencies: [movie, isMobile] },
  );

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
      className="relative w-full bg-[#020202] overflow-hidden text-white"
      style={{
        minHeight: isMobile ? "auto" : "100vh",
        perspective: "1200px",
      }}
    >
      {/* ── Backdrop ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-transparent z-10 hidden md:block" />
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          className="bg-image w-full h-full object-cover opacity-20 grayscale"
          alt=""
        />
      </div>

      {/* ── Background title typography ───────────────────────────── */}
      <div
        ref={titleRef}
        className="absolute inset-0 flex items-center justify-center z-10 select-none pointer-events-none overflow-hidden"
      >
        <h2 className="text-[22vw] md:text-[18vw] font-black italic tracking-tighter leading-none text-white/[0.03] uppercase">
          {movie.title?.split(" ")[0] || "NOIR"}
        </h2>
      </div>

      {/* ── MOBILE LAYOUT ─────────────────────────────────────────── */}
      {isMobile && (
        <div className="relative z-30 flex flex-col min-h-screen px-5 pt-12 pb-10 gap-8">
          {/* Top status badge */}
          <div className="hud-card-v2 self-start flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <Activity size={11} className="text-cyan-400 animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest">
              Live Feed
            </span>
          </div>

          {/* Poster */}
          <div ref={heroRef} className="relative self-center">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-20 rounded-lg" />
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="h-[42vh] rounded-lg border border-white/10 relative z-10 shadow-2xl"
                alt={movie.title}
              />
            )}
            {/* Rating badge */}
            <div className="hud-card-v2 absolute -bottom-4 -right-4 z-30 px-3 py-2 rounded-xl bg-black/80 border border-white/10 backdrop-blur-xl flex items-center gap-2">
              <span className="text-sm font-black italic text-cyan-400">
                {movie.vote_average?.toFixed(1)}
              </span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={7}
                    className="fill-cyan-500 text-cyan-500"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Movie info */}
          <div className="hud-card-v2 flex flex-col gap-5 mt-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Target size={12} className="text-cyan-500" />
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  {movie.release_date?.split("-")[0] || "TBA"}
                </span>
              </div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-[0.9] mb-3">
                {movie.title}
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-cyan-500/30 pl-4 italic line-clamp-3">
                {movie.overview}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleStream}
                className="flex-1 h-12 bg-white text-black font-black uppercase tracking-tighter italic transition-all active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors text-sm">
                  <Play size={14} fill="currentColor" /> Stream
                </span>
              </button>
              <button className="h-12 w-12 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all backdrop-blur-md shrink-0">
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP LAYOUT ────────────────────────────────────────── */}
      {!isMobile && (
        <>
          {/* Poster — centered */}
          <div
            className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              ref={heroRef}
              className="relative shadow-[0_0_80px_rgba(0,0,0,0.9)] rounded-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-20 rounded-lg" />
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="h-[55vh] lg:h-[65vh] rounded-lg border border-white/10 relative z-10"
                  alt={movie.title}
                />
              )}
            </div>
          </div>

          {/* HUD overlay */}
          <div className="absolute inset-0 z-40 px-10 lg:px-12 py-12 lg:py-16 flex flex-col justify-between pointer-events-none">
            {/* Top row */}
            <div className="flex justify-between items-start w-full">
              {/* Rating card */}
              <div
                ref={(el) => (hudElements.current[0] = el)}
                className="hud-card-v2 p-4 lg:p-5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-2xl flex gap-5 items-center shadow-2xl"
              >
                <div className="relative w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shrink-0">
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
                  <span className="text-sm font-black italic text-cyan-400">
                    {movie.vote_average?.toFixed(1)}
                  </span>
                </div>
                <div>
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

              {/* Live badge */}
              <div
                ref={(el) => (hudElements.current[1] = el)}
                className="hud-card-v2 px-4 py-2 bg-white/5 border border-white/10 rounded-full flex gap-3 items-center backdrop-blur-md"
              >
                <Activity size={12} className="text-cyan-400 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Live Feed
                </span>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-end gap-6">
              {/* Movie info + buttons */}
              <div
                ref={(el) => (hudElements.current[2] = el)}
                className="hud-card-v2 max-w-lg space-y-5 pointer-events-auto"
              >
                <div>
                  <h1 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] mb-3">
                    {movie.title}
                  </h1>
                  <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-cyan-500/30 pl-4 italic line-clamp-3">
                    {movie.overview}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleStream}
                    className="flex-none h-12 lg:h-14 px-8 lg:px-10 bg-white text-black font-black uppercase tracking-tighter italic transition-all active:scale-95 flex items-center gap-2 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                      <Play size={15} fill="currentColor" /> Stream
                    </span>
                  </button>
                  <button className="h-12 lg:h-14 w-12 lg:w-14 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all backdrop-blur-md">
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Meta panel */}
              <div
                ref={(el) => (hudElements.current[3] = el)}
                className="hud-card-v2 bg-zinc-900/80 border border-white/5 p-4 lg:p-5 backdrop-blur-xl flex flex-col gap-4 pointer-events-auto shadow-2xl min-w-[160px]"
              >
                <div className="flex items-center gap-3">
                  <Target size={14} className="text-cyan-500 shrink-0" />
                  <div>
                    <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.2em]">
                      Release
                    </p>
                    <p className="text-sm font-black italic">
                      {movie.release_date?.split("-")[0] || "TBA"}
                    </p>
                  </div>
                </div>
                <div className="h-[1px] w-full bg-white/5" />
                <button
                  onClick={handleStream}
                  className="flex items-center justify-between group text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-cyan-400 transition-colors"
                >
                  Full Data <Info size={12} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Post-processing overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-20" />
      </div>
    </section>
  );
};

export default SpotlightSec;
