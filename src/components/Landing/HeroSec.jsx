import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  LogIn,
  Play,
  ShieldCheck,
  Zap,
  Activity,
  Terminal,
} from "lucide-react";
import { RiArrowRightUpLine } from "react-icons/ri";
import CinematicLogo from "../../context/Logo";
import { useNavigate } from "react-router-dom";

const HeroSec = () => {
  const container = useRef();
  const screenRef = useRef();
  const floatItemsRef = useRef([]);
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("vault_access") === "granted";
    setHasAccess(access);
  }, []);

  const handleAction = () => {
    if (hasAccess) {
      navigate("/");
    } else {
      document
        .getElementById("footer-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Fade in noise and video
      tl.fromTo(".bg-overlay", { opacity: 0 }, { opacity: 1, duration: 2 });

      // Entrance animations
      tl.from(
        ".nav-item",
        { y: -20, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power4.out" },
        0.5,
      )
        .from(
          ".hero-content > *",
          {
            x: -50,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.5",
        )
        .from(
          ".screen-container",
          {
            scale: 0.9,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
          },
          "-=1",
        );

      // Floating particles animation
      floatItemsRef.current.forEach((item, i) => {
        gsap.to(item, {
          y: "random(-20, 20)",
          x: "random(-20, 20)",
          duration: "random(2, 4)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });
    },
    { scope: container },
  );

  const handleMouseMove = (e) => {
    if (!container.current || window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // 3D Tilt for Screen
    const xRotation = (clientY / innerHeight - 0.5) * -15;
    const yRotation = (clientX / innerWidth - 0.5) * 15;
    gsap.to(screenRef.current, {
      rotateX: xRotation,
      rotateY: yRotation,
      duration: 0.8,
      ease: "power2.out",
    });

    // Parallax for Background
    gsap.to(".bg-video", {
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
      duration: 1,
    });
  };

  return (
    <div
      ref={container}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full text-white bg-[#050505] flex flex-col overflow-hidden selection:bg-cyan-500 selection:text-black"
    >
      {/* CINEMATIC BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grain/Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://media.giphy.com/media/oEI9uWUicGLeE/giphy.gif')] z-20 mix-blend-overlay" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />

        {/* Scanlines Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-10" />

        <div className="bg-video w-full h-full scale-110">
          <video
            className="w-full h-full object-cover opacity-40"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/bgvideo5.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="nav-item group flex items-center gap-3 cursor-pointer">
          <CinematicLogo />
          <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />
          <span className="text-[9px] font-mono text-zinc-500 tracking-[0.3em] hidden sm:block uppercase">
            System_v4.0
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="nav-item hidden lg:flex flex-col items-end font-mono text-[8px] tracking-[0.2em] uppercase">
            <span className="text-zinc-600">Network_Latency</span>
            <span className="text-cyan-500">14ms // Secure</span>
          </div>
          <button
            onClick={handleAction}
            className="nav-item group relative flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-cyan-500 hover:text-white transition-all rounded-full font-black text-[10px] uppercase tracking-widest overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {hasAccess ? "Enter Archive" : "Establish Link"}{" "}
              <LogIn size={14} />
            </span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-20 flex-1 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 pt-10 lg:pt-0">
        <div className="hero-content flex flex-col items-center lg:items-start space-y-8">
          <div className="baner flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-sm backdrop-blur-md">
            <Activity size={14} className="text-cyan-500 animate-pulse" />
            <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-400">
              Live_Stream_Decrypted: <span className="text-white">Active</span>
            </span>
          </div>

          <div className="space-y-4 text-center lg:text-start">
            <h1 className="heroTextMain text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.8] uppercase">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                NOIR
              </span>
              <br />
              <span className="italic text-cyan-500">ARCHIVE</span>
            </h1>
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <Terminal size={14} className="text-zinc-700" />
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Unauthorized access is prohibited
              </p>
            </div>
          </div>

          <p className="max-w-[500px] text-zinc-400 text-sm md:text-base leading-relaxed font-medium text-center lg:text-start border-l-2 border-cyan-500/30 pl-6">
            Access the world's most comprehensive encrypted database of
            cinematic intelligence. 4K decrypts, neural recommendations, and
            personnel tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:justify-start justify-center pt-4">
            <button
              onClick={handleAction}
              className={`group relative px-10 py-5 font-black uppercase italic tracking-widest text-xs transition-all active:scale-95 flex items-center gap-4 overflow-hidden ${
                hasAccess
                  ? "bg-cyan-500/10 border border-cyan-500/40 text-cyan-400"
                  : "bg-white text-black "
              }`}
            >
              <div className="bg-cyan-500 w-full h-full absolute inset-0 z-0 translate-y-full group-hover:translate-y-0 duration-300" />
              {hasAccess ? <ShieldCheck size={20} /> : null}
              <span className="z-20">{hasAccess ? "Uplink Active" : "Initiate Breach"}</span>
              <RiArrowRightUpLine
                size={20}
                className="group-hover:rotate-45 transition-transform z-20"
              />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - 3D SCREEN WITH HUD */}
        <div className="screen-container relative z-20 hidden lg:flex justify-center items-center perspective-1000">
          {/* HUD Elements */}
          <div
            ref={(el) => (floatItemsRef.current[0] = el)}
            className="absolute -top-10 -left-10 z-30 font-mono text-[10px] text-cyan-500/50 flex flex-col gap-1"
          >
            <span>[DATA_STREAM_ON]</span>
            <span>FR_RATE: 24.00</span>
          </div>
          <div
            ref={(el) => (floatItemsRef.current[1] = el)}
            className="absolute -bottom-10 -right-10 z-30 font-mono text-[10px] text-zinc-500 flex flex-col items-end"
          >
            <span>COORD: 40.7128° N</span>
            <span>VAULT_REF: 099-X</span>
          </div>

          <div
            ref={screenRef}
            className="relative w-full max-w-[600px] aspect-video bg-zinc-900 rounded-lg border border-white/10 overflow-hidden group cursor-none shadow-[0_0_100px_rgba(0,0,0,1)] transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Screen Content */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100 opacity-50 group-hover:opacity-80" />

            {/* Play Button HUD */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="relative p-8 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm group-hover:bg-cyan-500 group-hover:border-cyan-400 group-hover:text-black transition-all duration-500">
                <Play fill="currentColor" size={40} className="ml-1" />
                <div className="absolute inset-0 rounded-full border border-cyan-500 animate-ping opacity-0 group-hover:opacity-100" />
              </div>
            </div>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/20 shadow-[0_0_15px_cyan] animate-scan z-20" />
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSec;
