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
  const scrollTriggerRef = useRef(null);
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [contentType, setContentType] = useState("movie");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      if (movies.length === 0 || !sectionRef.current || !triggerRef.current)
        return;

      // Kill previous local trigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      // Mobile: no horizontal scroll, just vertical stacked cards
      if (isMobile) {
        gsap.fromTo(
          ".box",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: triggerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
        return;
      }

      // Desktop: horizontal scroll
      ScrollTrigger.refresh();

      const totalWidth = sectionRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth;

      if (scrollDistance <= 0) return;

      const pinST = ScrollTrigger.create({
        trigger: triggerRef.current,
        pin: true,
        scrub: 0.5,
        start: "top top",
        end: `+=${scrollDistance}`,
        invalidateOnRefresh: true,
        animation: gsap.to(sectionRef.current, {
          x: -scrollDistance,
          ease: "none",
        }),
      });

      scrollTriggerRef.current = pinST;

      // Card animations within horizontal scroll
      gsap.utils.toArray(".box").forEach((box) => {
        ScrollTrigger.create({
          trigger: box,
          containerAnimation: pinST,
          start: "left 90%",
          onEnter: () =>
            gsap.fromTo(
              box,
              { opacity: 0, x: 30 },
              { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
            ),
        });
      });

      return () => {
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
          scrollTriggerRef.current = null;
        }
      };
    },
    { scope: triggerRef, dependencies: [movies, isMobile] },
  );

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section
        ref={triggerRef}
        className="bg-[#030303] py-20 px-5 overflow-hidden"
      >
        {/* Header */}
        <div className="mb-12 space-y-2">
          <p className="font-bold italic text-cyan-500 text-xs tracking-[3px] uppercase">
            Exclusive Selection
          </p>
          <div className="text-gray-100 text-5xl font-black tracking-tighter leading-[0.9]">
            <p>MOST</p>
            <p>WATCHED</p>
            <p className="italic text-cyan-500">THIS WEEK</p>
          </div>
        </div>

        {/* Stacked cards */}
        <div ref={sectionRef} className="flex flex-col gap-5">
          {movies.map((movie, index) => {
            const rawDate = movie.release_date || movie.first_air_date || "";
            const releaseYear = rawDate.split("-")[0];

            return (
              <div
                key={movie.id || index}
                onClick={() => handleCardClick(movie)}
                className="box group relative h-[55vw] w-full bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-cyan-500/30 cursor-pointer active:scale-[0.98] transition-all duration-300"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-500"
                  alt={movie.title || movie.name}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-5 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-[8px] rounded-full uppercase tracking-widest font-bold">
                      {contentType === "movie" ? "Feature" : "Series"}
                    </span>
                    <span className="text-white/40 font-mono text-[9px]">
                      {releaseYear || "TBA"}
                    </span>
                  </div>
                  <h3 className="text-white text-xl font-black uppercase italic tracking-tighter leading-none line-clamp-2">
                    {movie.title || movie.name}
                  </h3>
                </div>
                <div className="absolute bottom-5 right-5 w-9 h-9 flex items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-cyan-500 group-hover:border-cyan-500 group-hover:text-black group-hover:rotate-45">
                  <RiArrowRightUpLine className="text-lg" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // ── DESKTOP LAYOUT (horizontal scroll) ────────────────────────────────────
  return (
    <section
      ref={triggerRef}
      className="overflow-hidden bg-[#030303]"
      style={{ height: "100vh" }}
    >
      <div
        ref={sectionRef}
        className="relative flex flex-row items-center h-screen w-max"
        style={{ willChange: "transform" }}
      >
        {/* Background large text */}
        <div className="absolute inset-0 flex items-center pointer-events-none z-0 overflow-hidden">
          <h1 className="ml-20 text-white/[0.02] text-[25vw] font-black uppercase whitespace-nowrap italic select-none">
            Trending
          </h1>
        </div>

        {/* Intro panel */}
        <div className="relative z-10 flex flex-col gap-6 w-screen px-12 md:px-20 shrink-0 justify-center h-full text-left">
          <p className="font-bold italic text-cyan-500 text-sm tracking-[3px] uppercase">
            Exclusive Selection
          </p>
          <div className="text-gray-100 text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            <p>MOST</p>
            <p>WATCHED</p>
            <p className="italic text-cyan-500">THIS WEEK</p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-white/40 italic">
            <div className="h-[1px] w-12 bg-cyan-500/50" />
            <span className="text-sm uppercase tracking-widest font-mono">
              Scroll To Explore
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="flex items-center gap-16 lg:gap-20 px-12 md:px-20 h-full relative z-10">
          {movies.map((movie, index) => {
            const rawDate = movie.release_date || movie.first_air_date || "";
            const releaseYear = rawDate.split("-")[0];

            return (
              <div
                key={movie.id || index}
                onClick={() => handleCardClick(movie)}
                className="box group relative h-[65vh] w-[38vw] lg:w-[32vw] bg-zinc-900 border border-white/5 rounded-[2.5rem] shrink-0 overflow-hidden shadow-2xl hover:border-cyan-500/30 cursor-pointer active:scale-[0.98] transition-all duration-300"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500 ease-out"
                  alt={movie.title || movie.name}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-10 flex flex-col justify-end pr-24">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-[9px] rounded-full uppercase tracking-widest font-bold">
                      {contentType === "movie" ? "Feature" : "Series"}
                    </span>
                    <span className="text-white/40 font-mono text-[10px]">
                      {releaseYear || "TBA"}
                    </span>
                  </div>
                  <h3 className="text-white text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none line-clamp-2">
                    {movie.title || movie.name}
                  </h3>
                </div>
                <div className="absolute bottom-10 right-10 w-14 h-14 flex items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-cyan-500 group-hover:border-cyan-500 group-hover:text-black group-hover:scale-110 group-hover:rotate-45 shadow-xl">
                  <RiArrowRightUpLine className="text-2xl" />
                </div>
              </div>
            );
          })}

          {/* End spacer */}
          <div className="w-[15vw] shrink-0 flex flex-col items-center justify-center gap-4 opacity-20 pointer-events-none">
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
