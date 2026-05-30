import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getContent } from "../../services/movieApi";

gsap.registerPlugin(ScrollTrigger);

const VerticalMosaic = () => {
  const containerRef = useRef();
  const [movieBatches, setMovieBatches] = useState([[], [], [], [], []]);

  useEffect(() => {
    let cancelled = false;
    const fetchMovies = async () => {
      try {
        const data = await getContent({ type: "movie", category: "popular" });
        if (!cancelled && data?.results) {
          const all = [...data.results, ...data.results];
          setMovieBatches([
            all.slice(0, 8),
            all.slice(8, 16),
            all.slice(4, 12),
            all.slice(12, 20),
            all.slice(2, 10),
          ]);
        }
      } catch (err) {
        console.error("Mosaic fetch error:", err);
      }
    };
    fetchMovies();
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(() => {
    if (movieBatches[0].length === 0 || !containerRef.current) return;

    const columns = gsap.utils.toArray(".mosaic-column");

    columns.forEach((col, i) => {
      const speed = (i + 1) * 80;
      const direction = i % 2 === 0 ? -speed : speed;

      gsap.to(col, {
        y: direction,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [movieBatches]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[120vh] w-full bg-black overflow-hidden flex items-center justify-center border-t border-white/5"
    >
      {/* Background text */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2 className="text-[20vw] font-black italic tracking-tighter text-white/[0.04] uppercase select-none">
          VAULT
        </h2>
      </div>

      {/* Mosaic columns */}
      <div className="relative z-10 flex gap-3 md:gap-6 w-full px-3 md:px-8 h-full">
        {movieBatches.map((batch, colIndex) => (
          <div
            key={colIndex}
            className={`mosaic-column flex-1 flex flex-col gap-3 md:gap-6 ${
              colIndex >= 3 ? "hidden lg:flex" : ""
            } ${colIndex === 1 ? "-mt-[120px] md:-mt-[200px]" : ""}`}
          >
            {batch.map((movie, i) => (
              <div
                key={`${movie.id}-${i}`}
                className="relative aspect-[2/3] w-full bg-zinc-900 overflow-hidden group cursor-crosshair shadow-xl"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                  alt={movie.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-2 left-2 right-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-[7px] md:text-[8px] font-mono text-cyan-500 uppercase">
                    Unit_{movie.id}
                  </p>
                  <p className="text-[9px] md:text-[10px] font-black text-white italic uppercase truncate">
                    {movie.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Gradient masks */}
      <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />

      {/* Scanlines */}
      <div className="absolute inset-0 z-40 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
      </div>

      {/* Stats HUD */}
      <div className="absolute bottom-6 md:bottom-10 left-4 md:left-20 z-50 pointer-events-none flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-500 animate-ping rounded-full shrink-0" />
          <span className="text-white font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase">
            Archive_Sync: ACTIVE
          </span>
        </div>
        <p className="text-zinc-600 font-mono text-[8px] uppercase tracking-widest">
          Processing 84.2 Terabytes of Cinematic Data...
        </p>
      </div>
    </section>
  );
};

export default VerticalMosaic;
