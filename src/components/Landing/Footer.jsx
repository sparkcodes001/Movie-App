import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  SiGithub,
  SiInstagram,
  SiTiktok,
  SiX,
  SiDiscord,
  SiWhatsapp,
} from "react-icons/si";
import {
  RiMailLine,
  RiArrowRightUpLine,
  RiShieldFlashLine,
  RiTerminalBoxLine,
  RiFingerprint2Line,
  RiRadioButtonLine,
} from "react-icons/ri";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("READY");
  const [hasAccess, setHasAccess] = useState(false);
  const containerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("vault_access") === "granted";
    setHasAccess(access);
  }, []);

  const handleBreach = async (e) => {
    e.preventDefault();
    setStatus("LOADING");

    try {
      const { error } = await supabase
        .from("leads")
        .insert([{ email: email.toLowerCase() }]);

      if (error && error.code !== "23505") throw error;

      // Success Animation
      const tl = gsap.timeline();
      tl.to(".uplink-content", { opacity: 0, y: -20, duration: 0.4 }).to(
        ".breach-success",
        {
          display: "flex",
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
      );

      localStorage.setItem("vault_access", "granted");
      setHasAccess(true);

      // Navigate to Home after showing success
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      console.error("Breach Failed:", error.message);
      setStatus("ERROR");
      setTimeout(() => setStatus("READY"), 3000);
    }
  };

  return (
    <footer
      id="footer-section"
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#030303] text-white flex flex-col justify-center overflow-hidden border-t border-white/5 py-20 lg:py-0"
    >
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_0%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 items-center">
        <div className="uplink-content flex flex-col gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-cyan-500 mb-2">
              <RiTerminalBoxLine size={18} className="animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase">
                {hasAccess
                  ? "Connection_Encrypted // v4.0.1"
                  : "Auth_Session // v4.0.1"}
              </span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] xl:text-[8rem] font-black italic tracking-tighter leading-[0.85] uppercase">
              {hasAccess ? "UPLINK" : "ESTABLISH"} <br />
              <span className={hasAccess ? "text-cyan-500" : "text-zinc-800"}>
                {hasAccess ? "ACTIVE" : "UPLINK"}
              </span>
            </h2>
          </div>

          {!hasAccess ? (
            <form
              onSubmit={handleBreach}
              className="relative w-full max-w-2xl space-y-6 group"
            >
              <div className="relative border-b border-zinc-800 group-focus-within:border-cyan-500 transition-colors pb-4">
                <label className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest mb-2 block">
                  Neural_Mail_Address
                </label>
                <div className="flex items-center gap-4">
                  <RiMailLine className="text-zinc-700 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="USER@NETWORK.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-xl md:text-3xl font-black italic uppercase placeholder:text-zinc-900 tracking-tighter"
                  />
                </div>
              </div>
              <button
                disabled={status === "LOADING"}
                className="group/btn relative w-full sm:w-auto overflow-hidden bg-white text-black px-8 py-4 font-black uppercase italic tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-cyan-500 hover:text-white transition-all active:scale-95"
              >
                <span className="relative z-10">
                  {status === "LOADING" ? "Decrypting..." : "Sign Up to Breach"}
                </span>
                <RiFingerprint2Line
                  size={20}
                  className="relative z-10 group-hover/btn:scale-125 transition-transform"
                />
                <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <p className="text-zinc-500 font-mono text-xs tracking-widest leading-relaxed max-w-md">
                Welcome back, Agent. Your neural link is established. Full
                archive access has been granted.
              </p>
              <div className="flex items-center gap-4 text-cyan-500 font-mono text-[10px] tracking-widest uppercase">
                <RiRadioButtonLine className="animate-pulse" /> System_Status:
                Verified
              </div>
            </div>
          )}
        </div>

        {/* SOCIAL NODES */}
        <div className="relative flex flex-col gap-10 lg:pl-20 lg:border-l border-white/5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: "git", icon: <SiGithub />, label: "GITHUB" },
              { id: "tik", icon: <SiTiktok />, label: "TIKTOK" },
              { id: "ins", icon: <SiInstagram />, label: "INSTA" },
              { id: "dsc", icon: <SiDiscord />, label: "DISCORD" },
              { id: "xxx", icon: <SiX />, label: "X-CORP" },
              { id: "whp", icon: <SiWhatsapp />, label: "WHATSAPP" },
            ].map((social) => (
              <a
                key={social.id}
                href="#"
                className="footer-node group flex flex-col items-center justify-center p-6 border border-zinc-900 hover:border-cyan-500/50 bg-zinc-950/30 transition-all"
              >
                <div className="text-xl text-zinc-600 group-hover:text-white transition-all">
                  {social.icon}
                </div>
                <span className="mt-3 text-[8px] font-mono text-zinc-800 group-hover:text-cyan-500 tracking-widest uppercase font-bold">
                  {social.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      <div className="breach-success absolute inset-0 hidden flex-col items-center justify-center bg-black z-50 opacity-0 scale-95 pointer-events-none p-6 text-center">
        <RiShieldFlashLine
          size={60}
          className="text-cyan-500 animate-pulse mb-6"
        />
        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
          Access <span className="text-cyan-500">Granted</span>
        </h2>
        <p className="text-zinc-500 font-mono text-[10px] tracking-[1em] uppercase mt-4">
          Establishing Neural Connection...
        </p>
      </div>

      <div className="lg:absolute bottom-0 left-0 w-full p-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center bg-black z-40 gap-4">
        <div className="text-[9px] font-mono text-zinc-800 tracking-widest uppercase">
          © NOIR_ARCHIVE // DATA_LINK_2024
        </div>
      </div>
    </footer>
  );
};

export default Footer;
