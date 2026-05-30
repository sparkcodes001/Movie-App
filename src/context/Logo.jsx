import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CinematicLogo = () => {
  const logoRef = useRef();
  const textRef = useRef();

  useGSAP(
    () => {
      // Subtle "System Glitch" effect on load
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 5 });
      tl.to(logoRef.current, { opacity: 0.5, duration: 0.1 })
        .to(logoRef.current, { opacity: 1, duration: 0.1 })
        .to(logoRef.current, { x: 2, duration: 0.05, skewX: 10 })
        .to(logoRef.current, { x: 0, duration: 0.05, skewX: 0 });
    },
    { scope: logoRef },
  );

  return (
    <div
      ref={logoRef}
      className="flex items-center gap-2 md:gap-3 cursor-pointer group select-none"
    >
      {/* ICON BLOCK: Always visible, scales perfectly */}
      <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white text-black font-black italic text-lg md:text-xl border border-white group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all duration-300">
        N{/* Animated Scanline across the icon */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent h-1/2 w-full top-0 animate-pulse pointer-events-none" />
      </div>

      {/* TEXT BLOCK: Responsive hiding/scaling */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center">
          <span className="text-white font-black text-sm md:text-xl tracking-tighter uppercase group-hover:text-cyan-400 transition-colors duration-300">
            NOIR
            {/* Hide 'ARCHIVE' on very small screens to save space */}
            <span className="hidden sm:inline">_ARCHIVE</span>
          </span>

          {/* Cursor element */}
          <span
            className="w-1.5 h-4 md:w-2 md:h-5 bg-cyan-500 ml-1 animate-bounce"
            style={{ animationDuration: "0.8s" }}
          />
        </div>

        {/* HUD Subtext: Visible only on tablet/desktop */}
        <span className="text-[6px] md:text-[8px] font-mono text-zinc-600 tracking-[0.3em] uppercase hidden md:block group-hover:text-zinc-400 transition-colors">
          Protocol_V4.0.1
        </span>
      </div>
    </div>
  );
};

export default CinematicLogo;
