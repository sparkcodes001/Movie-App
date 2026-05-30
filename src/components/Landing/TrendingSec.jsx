import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getContent } from "../../services/movieApi";
import { RiArrowRightUpLine } from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

const TrendingSec = () => {
  const sectionRef = useRef();
  const triggerRef = useRef();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [contentType, setContentType] = useState("movie");

  const handleCardClick = (movie) => {
    const hasAccess = localStorage.getItem("vault_access") === "granted";
    if (!hasAccess) {
      document
        .getElementById("footer-section")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/${contentType}/${movie.id}`);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const loadMovies = async () => {
      try {
        const selectedType = Math.random() > 0.5 ? "movie" : "tv";
        const data = await getContent({
          type: selectedType,
          category: "popular",
        });
        if (!cancelled) {
          setContentType(selectedType);
          const shuffled = [...data.results]
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);
          setMovies(shuffled);
        }
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      }
    };
    loadMovies();
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      if (movies.length === 0 || !sectionRef.current) return;

      const totalWidth = sectionRef.current.scrollWidth;
      const scrollDistance = totalWidth - window.innerWidth;

      if (scrollDistance <= 0) return;

      const pin = gsap.to(sectionRef.current, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 0.3, // ✅ was 1, now snappy
          start: "top top",
          end: `+=${scrollDistance}`,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray(".box").forEach((box) => {
        gsap.from(box, {
          opacity: 0,
          x: 30, // ✅ removed scale + y, just simple fade
          duration: 0.4, // ✅ was 0.8, now faster
          ease: "power2.out",
          scrollTrigger: {
            trigger: box,
            containerAnimation: pin,
            start: "left 95%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // ✅ only kill local triggers
      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: triggerRef, dependencies: [movies] },
  );

  return (
    <section ref={triggerRef} className="overflow-hidden bg-[#030303]">
      <div
        ref={sectionRef}
        // ✅ removed will-change-transform — causes paint glitches
        className="relative flex flex-row items-center h-screen w-max"
      >
        {/* Background large text */}
        <div className="absolute inset-0 flex items-center pointer-events-none z-0 overflow-hidden">
          <h1 className="ml-10 md:ml-20 text-white/[0.02] text-[30vw] md:text-[25vw] font-black uppercase whitespace-nowrap italic select-none">
            Trending
          </h1>
        </div>

        {/* Intro panel */}
        <div className="relative z-10 flex flex-col gap-4 md:gap-6 w-screen px-6 sm:px-12 md:px-20 shrink-0 justify-center h-full text-left">
          <p className="font-bold italic text-cyan-500 text-xs md:text-sm tracking-[2px] md:tracking-[3px] uppercase">
            Exclusive Selection
          </p>
          <div className="text-gray-100 text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            <p>MOST</p>
            <p>WATCHED</p>
            <p className="italic text-cyan-500">THIS WEEK</p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-white/40 italic">
            <div className="h-[1px] w-8 md:w-12 bg-cyan-500/50" />
            <span className="text-[10px] md:text-sm uppercase tracking-widest font-mono">
              Scroll To Explore
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="flex items-center gap-9 md:gap-16 lg:gap-24 px-6 md:px-20 h-full relative z-10">
          {movies.map((movie, index) => {
            const rawDate = movie.release_date || movie.first_air_date || "";
            const releaseYear = rawDate.split("-")[0];

            return (
              <div
                key={movie.id || index}
                onClick={() => handleCardClick(movie)}
                className="box group relative h-[60vh] md:h-[70vh] w-[80vw] sm:w-[55vw] md:w-[40vw] lg:w-[35vw] bg-zinc-900 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] shrink-0 overflow-hidden shadow-2xl hover:border-cyan-500/30 cursor-pointer active:scale-[0.98] transition-all duration-300"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`} // ✅ w780 not original — faster load
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out" // ✅ was 1000ms
                  alt={movie.title || movie.name}
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-6 md:p-10 flex flex-col justify-end pr-16 md:pr-24">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 md:px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-[9px] rounded-full uppercase tracking-widest font-bold">
                      {contentType === "movie" ? "Feature" : "Series"}
                    </span>
                    <span className="text-white/40 font-mono text-[10px] tracking-tighter">
                      {releaseYear || "TBA"}
                    </span>
                  </div>
                  <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none line-clamp-2">
                    {movie.title || movie.name}
                  </h3>
                </div>

                <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-cyan-500 group-hover:border-cyan-500 group-hover:text-black group-hover:scale-110 group-hover:rotate-45 shadow-xl">
                  <RiArrowRightUpLine className="text-xl md:text-2xl" />
                </div>
              </div>
            );
          })}

          {/* End spacer */}
          <div className="w-[20vw] shrink-0 flex flex-col items-center justify-center gap-4 opacity-20 pointer-events-none">
            <div className="h-20 w-[1px] bg-gradient-to-b from-white to-transparent" />
            <p className="text-white text-lg font-black uppercase rotate-90 tracking-widest whitespace-nowrap">
              END OF LIST
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSec;
