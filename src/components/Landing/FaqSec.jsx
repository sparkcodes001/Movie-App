import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lock, Unlock, Terminal, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FAQ_DATA = [
  {
    id: "01",
    q: "WHAT IS THE NOIR ARCHIVE?",
    a: "A high-fidelity digital vault preserving the legacy of cinematic masterpieces. We bypass the mainstream to bring you the raw essence of film.",
  },
  {
    id: "02",
    q: "HOW ARE FILMS SELECTED FOR BREACH?",
    a: "Every title undergoes a rigorous metadata analysis. We look for cultural impact, visual innovation, and narrative depth.",
  },
  {
    id: "03",
    q: "IS THE CONNECTION SECURE?",
    a: "End-to-end encrypted cinematic streaming. Your watch history is stored on a decentralized ledger, invisible to tracking.",
  },
  {
    id: "04",
    q: "CAN I DOWNLOAD DATA LOCALLY?",
    a: "Archive access is temporary and ephemeral. We believe in the moment of the watch, not the weight of the file.",
  },
];

const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|<>";

// ─── FAQ Section ──────────────────────────────────────────────────────────────
const FaqSec = () => {
  const containerRef = useRef();

  useGSAP(
    () => {
      // Header entrance
      gsap.fromTo(
        ".header-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // FAQ items — fromTo so opacity always resolves to 1
      gsap.fromTo(
        ".faq-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".faq-list",
            start: "top 90%", // earlier trigger
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-zinc-950 text-zinc-400 font-mono py-20 md:py-32 px-5 sm:px-10 md:px-20 overflow-hidden"
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-12 md:mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-800/80 pb-8 md:pb-12">
        <div className="header-reveal space-y-3 md:space-y-4">
          <div className="flex items-center gap-3 text-cyan-500">
            <Terminal size={16} className="shrink-0 animate-pulse" />
            <span className="text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] uppercase">
              Protocol: Inquiry // V.4.0
            </span>
          </div>
          <h2 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">
            Access <span className="text-zinc-700">Protocol</span>
          </h2>
        </div>

        <div className="header-reveal text-[9px] md:text-[10px] flex flex-wrap lg:flex-col gap-2 md:gap-3 text-zinc-600 font-bold border-t lg:border-t-0 border-zinc-800 pt-5 lg:pt-0">
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping shrink-0" />
            STX-SYSTEMS: ONLINE
          </p>
          <p>DB_CONNECTION: ENCRYPTED</p>
          <p>LOCATION: [REDACTED]</p>
        </div>
      </div>

      {/* FAQ list */}
      <div className="faq-list relative z-10 max-w-5xl w-full mx-auto space-y-3 md:space-y-4">
        {FAQ_DATA.map((item) => (
          <FAQItem key={item.id} item={item} />
        ))}
      </div>

      {/* Footer HUD */}
      <div className="relative z-10 mt-14 md:mt-20 flex flex-wrap items-center gap-4 md:gap-6 text-[9px] md:text-[10px] text-zinc-700">
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} className="text-cyan-900" />
          <span>ENCRYPTED LAYER</span>
        </div>
        <div className="hidden sm:block h-[1px] w-12 md:w-20 bg-zinc-800" />
        <span className="opacity-50">© NOIR_CORP 2024</span>
        <span className="ml-auto text-cyan-900 font-black">SECURE_NODE_04</span>
      </div>
    </section>
  );
};

// ─── FAQ Item ──────────────────────────────────────────────────────────────────
const FAQItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayText, setDisplayText] = useState(item.q);
  const timerRef = useRef(null);
  const isScrambling = useRef(false);

  const triggerScramble = useCallback(() => {
    clearInterval(timerRef.current);
    isScrambling.current = true;
    let iteration = 0;

    timerRef.current = setInterval(() => {
      setDisplayText(
        item.q
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            if (index < iteration) return item.q[index];
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join(""),
      );

      iteration += 0.7;

      if (iteration >= item.q.length) {
        clearInterval(timerRef.current);
        isScrambling.current = false;
        setDisplayText(item.q);
      }
    }, 22);
  }, [item.q]);

  const stopScramble = useCallback(() => {
    clearInterval(timerRef.current);
    isScrambling.current = false;
    setDisplayText(item.q);
  }, [item.q]);

  useEffect(() => {
    if (isOpen) {
      triggerScramble();
    } else {
      stopScramble();
    }
    return () => clearInterval(timerRef.current);
  }, [isOpen]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleMouseEnter = () => {
    if (!isOpen && !isScrambling.current) {
      triggerScramble();
    }
  };

  const handleMouseLeave = () => {
    if (!isOpen) {
      stopScramble();
    }
  };

  return (
    <div
      onClick={handleToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      aria-expanded={isOpen}
      className={`faq-item group relative border transition-all duration-300 cursor-pointer overflow-hidden select-none ${
        isOpen
          ? "border-cyan-500/50 bg-zinc-950"
          : "border-zinc-800/80 bg-zinc-950/30 hover:border-zinc-700"
      }`}
    >
      {/* Active indicator */}
      <div
        className={`absolute left-0 top-0 h-full w-[3px] bg-cyan-500 transition-all duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="flex items-start gap-4 md:gap-8 p-5 md:p-8 relative z-10">
        {/* ID */}
        <span
          className={`text-[10px] md:text-xs mt-1 transition-colors duration-300 font-bold shrink-0 ${
            isOpen ? "text-cyan-500" : "text-zinc-700"
          }`}
        >
          {item.id}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm md:text-lg lg:text-xl font-bold tracking-tight transition-colors duration-300 uppercase leading-tight break-words ${
              isOpen ? "text-white" : "text-zinc-500"
            }`}
          >
            {displayText}
          </h3>

          {/* Expand/collapse */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              isOpen
                ? "grid-rows-[1fr] opacity-100 mt-5 md:mt-6"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-4 md:pt-5 max-w-2xl">
                {item.a}
              </p>
            </div>
          </div>
        </div>

        {/* Lock icon */}
        <div
          className={`transition-all duration-500 pt-0.5 shrink-0 ${
            isOpen ? "text-cyan-500" : "text-zinc-700"
          }`}
        >
          {isOpen ? <Unlock size={16} /> : <Lock size={16} />}
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 bg-cyan-500/[0.03] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
    </div>
  );
};

export default FaqSec;
