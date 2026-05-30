import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Terminal } from "lucide-react";
import CinematicLogo from "../context/Logo";
// import CinematicLogo from "../context/Logo";

export function Loader({ loading }) {
  const [progress, setProgress] = useState(0);
  const container = useRef();
  const barRef = useRef();

  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) =>
          prev < 92 ? prev + Math.floor(Math.random() * 12) + 2 : 92,
        );
      }, 180);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  useEffect(() => {
    if (loading && barRef.current) {
      gsap.to(barRef.current, {
        width: `${progress}%`,
        duration: 0.4,
        ease: "power1.out",
      });
    }
  }, [progress, loading]);

  useGSAP(() => {
    if (loading && container.current) {
      // Very subtle flicker
      gsap.to(container.current, {
        opacity: 0.92,
        duration: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "none",
      });
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <div
      ref={container}
      className="fixed inset-0 bg-[#030303] flex flex-col items-center justify-center z-[9999] overflow-hidden"
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_3px] opacity-40" />

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-white/10" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-white/10" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-white/10" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-white/10" />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-8 w-full max-w-xs px-6">
        {/* Status */}
        <div className="flex items-center gap-3 text-cyan-500">
          <Terminal size={14} />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] animate-pulse">
            Initializing_Breach
          </span>
        </div>

        {/* Logo */}
        <CinematicLogo />

        {/* Progress */}
        <div className="w-full space-y-3">
          <div className="flex justify-between font-mono text-[8px] text-zinc-600 uppercase tracking-widest">
            <span>Decrypting_Node</span>
            <span className="text-cyan-500 font-bold">
              {Math.min(progress, 99)}%
            </span>
          </div>

          <div className="h-[1px] w-full bg-zinc-900 relative overflow-hidden">
            <div
              ref={barRef}
              className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        {/* Log lines */}
        <div className="flex flex-col items-center gap-1.5 font-mono text-[7px] text-zinc-700 uppercase tracking-[0.15em] text-center">
          <span className="animate-pulse">Bypassing_Firewall... OK</span>
          <span className="opacity-50">Neural_Handshake... ACTIVE</span>
          <span className="text-red-900/50">Trace_Status: UNDETECTED</span>
        </div>
      </div>
    </div>
  );
}
