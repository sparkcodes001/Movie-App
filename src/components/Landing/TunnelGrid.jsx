import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getContent } from "../../services/movieApi";

gsap.registerPlugin(ScrollTrigger);

const TunnelSec = () => {
  const containerRef = useRef();
  const [movies, setMovies] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on resize for responsive radius
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getContent({ type: "movie", category: "top_rated" });
        // Take 12 random movies
        setMovies(
          [...data.results].sort(() => Math.random() - 0.5).slice(0, 12),
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  useGSAP(() => {
    if (movies.length === 0) return;

    const cards = gsap.utils.toArray(".tunnel-card");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000", // Slightly shorter for better mobile feel
        pin: true,
        scrub: 1,
      },
    });

    // Animate Text first
    tl.fromTo(
      ".tunnel-text",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1 },
      0,
    );

    // Animate Cards
    cards.forEach((card, i) => {
      tl.fromTo(
        card,
        {
          z: -4000,
          opacity: 0,
        },
        {
          z: 800,
          opacity: 1,
          ease: "none",
          duration: 1.5,
        },
        i * 0.1, // Staggering
      );
    });

    // Fade out text at the end
    tl.to(".tunnel-text", { opacity: 0, scale: 1.5, duration: 0.5 }, "-=0.5");
  }, [movies, dimensions]);

  // Dynamic Radius Calculations
  const getRadius = () => {
    if (dimensions.width < 640) return { x: 120, y: 180 }; // Mobile
    if (dimensions.width < 1024) return { x: 250, y: 300 }; // Tablet
    return { x: 450, y: 350 }; // Desktop
  };

  const { x: rx, y: ry } = getRadius();

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-black overflow-hidden"
      style={{
        perspective: dimensions.width < 640 ? "600px" : "1000px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* 1. TOP GRADIENT (Transition from previous section) */}
      <div className="absolute top-0 left-0 w-full h-32 md:h-64 bg-gradient-to-b from-zinc-950 to-transparent z-50 pointer-events-none" />

      {/* 2. CENTER CONTENT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 tunnel-text pointer-events-none px-6 text-center">
        <div className="flex items-center gap-2 tracking-[0.2rem] md:tracking-[0.4rem] uppercase text-[9px] md:text-[10px] text-cyan-500 mb-4">
          <div className="h-[1px] w-8 md:w-12 bg-cyan-500" />
          <span>Cinematic Immersion</span>
          <div className="h-[1px] w-8 md:w-12 bg-cyan-500" />
        </div>
        <h2 className="text-white text-5xl sm:text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.9]">
          The <br />
          <span className="not-italic bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-500">
            Legacy
          </span>
        </h2>
        <p className="text-zinc-500 mt-6 font-mono text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.6em] uppercase">
          Timeless Masterpieces
        </p>
      </div>

      {/* 3. THE 3D TUNNEL CARDS */}
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
              className="tunnel-card absolute w-[140px] sm:w-[200px] md:w-[280px] aspect-[2/3] rounded-lg md:rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-colors hover:border-cyan-500/50"
              style={{
                // Center the card then apply calculated X/Y offsets
                transform: `translate3d(${posX}px, ${posY}px, 0px)`,
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Card Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
            </div>
          );
        })}
      </div>

      {/* 4. BOTTOM GRADIENT (Transition to Footer) */}
      <div className="absolute bottom-0 left-0 w-full h-64 md:h-80 bg-gradient-to-t from-black via-black/80 to-transparent z-50 pointer-events-none" />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Scanline Effect for extra style */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
    </section>
  );
};

export default TunnelSec;
