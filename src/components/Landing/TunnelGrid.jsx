import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getContent } from "../../services/movieApi";

gsap.registerPlugin(ScrollTrigger);

const TunnelSec = () => {
  const containerRef = useRef();
  const stRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    let rafId;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchMovies = async () => {
      try {
        const data = await getContent({ type: "movie", category: "top_rated" });
        if (!cancelled) {
          setMovies(
            [...data.results].sort(() => Math.random() - 0.5).slice(0, 12),
          );
        }
      } catch (err) {
        console.error("Tunnel fetch error:", err);
      }
    };
    fetchMovies();
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      if (movies.length === 0 || !containerRef.current) return;

      // Kill previous instance
      if (stRef.current) {
        stRef.current.kill();
        stRef.current = null;
      }

      const cards = gsap.utils.toArray(".tunnel-card");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onEnter: () => ScrollTrigger.refresh(),
        },
      });

      stRef.current = tl.scrollTrigger;

      tl.fromTo(
        ".tunnel-text",
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1 },
        0,
      );

      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { z: -3500, opacity: 0 },
          { z: 600, opacity: 1, ease: "none", duration: 1.5 },
          i * 0.1,
        );
      });

      tl.to(".tunnel-text", { opacity: 0, scale: 1.3, duration: 0.5 }, "-=0.5");

      return () => {
        if (stRef.current) {
          stRef.current.kill();
          stRef.current = null;
        }
      };
    },
    { dependencies: [movies, dimensions] },
  );

  const getRadius = () => {
    if (dimensions.width < 640) return { x: 110, y: 170 };
    if (dimensions.width < 1024) return { x: 230, y: 280 };
    return { x: 420, y: 330 };
  };

  const { x: rx, y: ry } = getRadius();

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-black overflow-hidden"
      style={{
        perspective: dimensions.width < 640 ? "500px" : "900px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* Top gradient */}
      <div className="absolute top-0 left-0 w-full h-24 md:h-48 bg-gradient-to-b from-zinc-950 to-transparent z-50 pointer-events-none" />

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 tunnel-text pointer-events-none px-6 text-center">
        <div className="flex items-center gap-2 tracking-[0.3rem] uppercase text-[9px] md:text-[10px] text-cyan-500 mb-4">
          <div className="h-[1px] w-8 bg-cyan-500" />
          <span>Cinematic Immersion</span>
          <div className="h-[1px] w-8 bg-cyan-500" />
        </div>
        <h2 className="text-white text-5xl sm:text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.9]">
          The <br />
          <span className="not-italic bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-500">
            Legacy
          </span>
        </h2>
        <p className="text-zinc-500 mt-6 font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase">
          Timeless Masterpieces
        </p>
      </div>

      {/* 3D cards */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {movies.map((movie, i) => {
          const angle = (i / movies.length) * Math.PI * 2;
          const posX = Math.cos(angle) * rx;
          const posY = Math.sin(angle) * ry;

          return (
            <div
              key={movie.id}
              className="tunnel-card absolute w-[90px] sm:w-[150px] md:w-[220px] aspect-[2/3] rounded-lg overflow-hidden border border-white/10 shadow-2xl"
              style={{
                transform: `translate3d(${posX}px, ${posY}px, 0px)`,
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>
          );
        })}
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-48 md:h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-50 pointer-events-none" />

      {/* Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
    </section>
  );
};

export default TunnelSec;
