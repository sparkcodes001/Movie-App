import React, { useState, useEffect, useRef } from "react";
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

const FaqSec = () => {
  const containerRef = useRef();

  // Scroll Entrance Animation
  useGSAP(
    () => {
      gsap.from(".header-reveal", {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-zinc-950 text-zinc-400 font-mono py-16 md:py-24 px-5 sm:px-10 md:px-20 overflow-hidden flex flex-col justify-center"
    >
      {/* SCANLINES */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
      </div>

      {/* HEADER */}
      <div className="relative z-10 mb-12 md:mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-zinc-800 pb-10">
        <div className="header-reveal space-y-4">
          <div className="flex items-center gap-3 text-cyan-500">
            <Terminal size={18} className="shrink-0" />
            <span className="text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] uppercase animate-pulse">
              Protocol: Inquiry // V.4.0
            </span>
          </div>
          <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
            Access <span className="text-zinc-700">Protocol</span>
          </h2>
        </div>

        <div className="header-reveal text-[9px] md:text-[10px] grid grid-cols-2 lg:flex lg:flex-col gap-2 text-zinc-600 font-bold border-t lg:border-t-0 border-zinc-800 pt-6 lg:pt-0">
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />{" "}
            STX-SYSTEMS: ONLINE
          </p>
          <p>DB_CONNECTION: ENCRYPTED</p>
          <p className="hidden sm:block">LOCATION: [REDACTED]</p>
          <p className="sm:hidden">LOC: [REDACTED]</p>
        </div>
      </div>

      {/* FAQ LIST */}
      <div className="relative z-10 max-w-5xl w-full mx-auto space-y-4">
        {FAQ_DATA.map((item) => (
          <FAQItem key={item.id} item={item} />
        ))}
      </div>

      {/* FOOTER HUD - Responsive positioning */}
      <div className="footer-hud mt-16 lg:absolute lg:bottom-10 lg:left-20 flex flex-wrap items-center gap-4 md:gap-6 text-[9px] md:text-[10px] text-zinc-700 z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-cyan-900" />
          <span>ENCRYPTED LAYER</span>
        </div>
        <div className="hidden sm:block h-[1px] w-12 md:w-20 bg-zinc-800" />
        <span className="opacity-50">© NOIR_CORP 2024</span>
        <span className="ml-auto lg:ml-0 text-cyan-900 font-black">
          SECURE_NODE_04
        </span>
      </div>
    </section>
  );
};

const FAQItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayText, setDisplayText] = useState(item.q);
  const chars = "!@#$%^&*()_+-=";
  const timerRef = useRef(null);

  // Scramble effect logic
  const triggerScramble = () => {
    let iteration = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDisplayText(
        item.q
          .split("")
          .map((letter, index) => {
            if (index < iteration) return item.q[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );
      if (iteration >= item.q.length) clearInterval(timerRef.current);
      iteration += 1;
    }, 25);
  };

  useEffect(() => {
    if (isOpen) {
      triggerScramble();
    } else {
      clearInterval(timerRef.current);
      setDisplayText(item.q);
    }
    return () => clearInterval(timerRef.current);
  }, [isOpen, item.q]);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      onMouseEnter={() => !isOpen && triggerScramble()} // Visual hint on desktop
      onMouseLeave={() => !isOpen && setDisplayText(item.q)}
      className={`faq-item group relative border transition-all duration-300 cursor-pointer overflow-hidden
        ${isOpen ? "border-cyan-500/50 bg-zinc-950" : "border-zinc-800 bg-zinc-950/30 hover:border-zinc-700"}`}
    >
      {/* Active Indicator Bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1 bg-cyan-500 transition-all duration-500 
        ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <div className="flex items-start gap-4 md:gap-8 p-5 md:p-8 relative z-10">
        {/* ID Number */}
        <span
          className={`text-[10px] md:text-xs mt-1.5 transition-colors font-bold 
          ${isOpen ? "text-cyan-500" : "text-zinc-700"}`}
        >
          {item.id}
        </span>

        {/* Content Area */}
        <div className="flex-1">
          <h3
            className={`text-base md:text-xl font-bold tracking-tight transition-colors duration-300 uppercase leading-tight
            ${isOpen ? "text-white" : "text-zinc-500"}`}
          >
            {displayText}
          </h3>

          {/* Animated Reveal Container */}
          <div
            className={`grid transition-all duration-500 ease-in-out 
            ${isOpen ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"}`}
          >
            <div className="overflow-hidden">
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800 pt-5 max-w-2xl">
                {item.a}
              </p>
            </div>
          </div>
        </div>

        {/* Status Icon */}
        <div
          className={`transition-all duration-500 pt-1 shrink-0
          ${isOpen ? "text-cyan-500 rotate-180" : "text-zinc-800"}`}
        >
          {isOpen ? <Unlock size={18} /> : <Lock size={18} />}
        </div>
      </div>

      {/* Hover Background Glow (Desktop only) */}
      <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
    </div>
  );
};

export default FaqSec;
