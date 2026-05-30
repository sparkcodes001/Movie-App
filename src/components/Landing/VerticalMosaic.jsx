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
    const fetchMovies = async () => {
      try {
        const data = await getContent({ type: "movie", category: "popular" });
        const allMovies = [...data.results, ...data.results]; // Double for length
        // Split into 5 columns
        const batches = [
          allMovies.slice(0, 8),
          allMovies.slice(8, 16),
          allMovies.slice(4, 12),
          allMovies.slice(12, 20),
          allMovies.slice(2, 10),
        ];
        setMovieBatches(batches);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  useGSAP(() => {
    if (movieBatches[0].length === 0) return;

    const columns = gsap.utils.toArray(".mosaic-column");

    columns.forEach((col, i) => {
      const speed = (i + 1) * 100; // Different speeds
      const direction = i % 2 === 0 ? -speed : speed; // Opposite directions

      gsap.to(col, {
        y: direction,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    // Fade out everything as we reach the footer
    gsap.to(".mosaic-overlay", {
      backgroundColor: "rgba(0,0,0,1)",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
      },
    });
  }, [movieBatches]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[120vh] w-full bg-black overflow-hidden flex items-center justify-center border-t border-white/5"
    >
      {/* BACKGROUND TEXT */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <h2 className="text-[20vw] font-black italic tracking-tighter text-white/5 uppercase select-none">
          VAULT
        </h2>
      </div>

      {/* THE MOSAIC COLUMNS */}
      <div className="relative z-10 flex gap-4 md:gap-8 w-full px-4 md:px-10 h-full">
        {movieBatches.map((batch, colIndex) => (
          <div
            key={colIndex}
            className={`mosaic-column flex-1 flex flex-col gap-4 md:gap-8 
              ${colIndex > 2 ? "hidden lg:flex" : ""} // Hide columns on mobile
              ${colIndex === 1 ? "mt-[-200px]" : "mt-0"} // Offset starting position
            `}
          >
            {batch.map((movie, i) => (
              <div
                key={`${movie.id}-${i}`}
                className="relative aspect-[2/3] w-full bg-zinc-900 rounded-sm overflow-hidden group cursor-crosshair shadow-2xl"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
                  alt=""
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <p className="text-[8px] font-mono text-cyan-500 uppercase">
                    Unit_{movie.id}
                  </p>
                  <p className="text-[10px] font-black text-white italic uppercase truncate">
                    {movie.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* GRADIENT MASK (Fades top and bottom for smooth transition) */}
      <div className="mosaic-overlay absolute inset-0 z-30 pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />

      {/* SCANLINES OVERLAY */}
      <div className="absolute inset-0 z-40 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
      </div>

      {/* STATS HUD (Mobile Friendly) */}
      <div className="absolute bottom-10 left-6 md:left-20 z-50 pointer-events-none flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-500 animate-ping rounded-full" />
          <span className="text-white font-mono text-[10px] tracking-[0.3em] uppercase">
            Archive_Sync: ACTIVE
          </span>
        </div>
        <p className="text-zinc-600 font-mono text-[8px] uppercase">
          Processing 84.2 Terabytes of Cinematic Data...
        </p>
      </div>
    </section>
  );
};

export default VerticalMosaic;
