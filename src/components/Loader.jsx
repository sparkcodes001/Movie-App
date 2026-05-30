import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Terminal } from "lucide-react";

export function Loader({ loading }) {
  const [progress, setProgress] = useState(0);
  const container = useRef();
  const barRef = useRef();

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) =>
          prev < 99 ? prev + Math.floor(Math.random() * 15) : 99,
        );
      }, 150);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  useGSAP(() => {
    if (loading) {
      // Subtle flicker instead of heavy rough ease for better mobile performance
      gsap.to(container.current, {
        opacity: 0.95,
        duration: 0.15,
        repeat: -1,
        yoyo: true,
        ease: "none",
      });
    }
  }, [loading]);

  // Separate useEffect for progress bar to keep it smooth
  useEffect(() => {
    if (loading && barRef.current) {
      gsap.to(barRef.current, {
        width: `${progress}%`,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  }, [progress, loading]);

  if (!loading) return null;

  return (
    <div
      ref={container}
      className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[9999] overflow-hidden px-6"
    >
      {/* BACKGROUND SCANLINES */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="relative flex flex-col items-center gap-6 md:gap-10 w-full max-w-[280px] md:max-w-xs">
        {/* TOP STATUS */}
        <div className="flex items-center gap-2 md:gap-3 text-cyan-500 animate-pulse">
          <Terminal size={16} className="md:w-5 md:h-5" />
          <span className="font-mono text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] whitespace-nowrap">
            Status: Initializing_Breach
          </span>
        </div>

        {/* LOGO REVEAL */}
        <h2 className="text-white font-black italic text-2xl md:text-4xl tracking-tighter uppercase select-none">
          MOVIE<span className="text-cyan-500">LAB</span>
        </h2>

        {/* PROGRESS BAR SECTION */}
        <div className="w-full space-y-2 md:space-y-4">
          <div className="flex justify-between font-mono text-[7px] md:text-[9px] text-zinc-500 uppercase tracking-widest">
            <span className="opacity-70">Decrypting_Node</span>
            <span className="text-cyan-500 font-bold">{progress}%</span>
          </div>

          <div className="h-[1px] md:h-[2px] w-full bg-zinc-900 relative overflow-hidden">
            <div
              ref={barRef}
              className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,1)]"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        {/* SYSTEM LOGS (FLICKERING) */}
        <div className="flex flex-col items-center gap-1 font-mono text-[6px] md:text-[8px] text-zinc-700 uppercase tracking-[0.1em] md:tracking-[0.2em] text-center">
          <span className="animate-pulse">Bypassing_Firewall... OK</span>
          <span className="opacity-40">Neural_Handshake... ACTIVE</span>
          <span className="text-red-900/40">Trace_Status: UNDETECTED</span>
        </div>
      </div>

      {/* RESPONSIVE CORNER BRACKETS - Moved closer to corners on mobile */}
      <div className="absolute top-6 left-6 md:top-12 md:left-12 w-6 h-6 md:w-12 md:h-12 border-t border-l border-white/10" />
      <div className="absolute top-6 right-6 md:top-12 md:right-12 w-6 h-6 md:w-12 md:h-12 border-t border-r border-white/10" />
      <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 w-6 h-6 md:w-12 md:h-12 border-b border-l border-white/10" />
      <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 w-6 h-6 md:w-12 md:h-12 border-b border-r border-white/10" />
    </div>
  );
}
