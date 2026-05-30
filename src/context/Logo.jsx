import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CinematicLogo = () => {
  const logoRef = useRef();

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 6 });
      tl.to(logoRef.current, { opacity: 0.4, duration: 0.08 })
        .to(logoRef.current, { opacity: 1, duration: 0.08 })
        .to(logoRef.current, { x: 3, skewX: 8, duration: 0.05 })
        .to(logoRef.current, { x: 0, skewX: 0, duration: 0.05 });
    },
    { scope: logoRef },
  );

  return (
    <div
      ref={logoRef}
      className="flex items-center gap-2 md:gap-3 cursor-pointer group select-none"
    >
      {/* Icon block */}
      <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white text-black font-black italic text-lg md:text-xl border border-white group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all duration-300">
        N
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent w-full pointer-events-none animate-pulse" />
      </div>

      {/* Text block */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center">
          <span className="text-white font-black text-sm md:text-base tracking-tighter uppercase group-hover:text-cyan-400 transition-colors duration-300 font-mono">
            NOIR
            <span className="hidden sm:inline">_ARCHIVE</span>
          </span>
          <span
            className="w-1.5 h-4 md:w-2 md:h-5 bg-cyan-500 ml-1"
            style={{ animation: "blink 0.8s step-end infinite" }}
          />
        </div>
        <span className="text-[6px] md:text-[8px] font-mono text-zinc-600 tracking-[0.3em] uppercase hidden md:block group-hover:text-zinc-400 transition-colors">
          Protocol_V4.0.1
        </span>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CinematicLogo;
