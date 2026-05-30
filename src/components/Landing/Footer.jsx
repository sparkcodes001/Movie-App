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
  const navigate = useNavigate();

  useEffect(() => {
    setHasAccess(localStorage.getItem("vault_access") === "granted");
  }, []);

  const handleBreach = async (e) => {
    e.preventDefault();
    if (status === "LOADING") return;
    setStatus("LOADING");

    try {
      const { error } = await supabase
        .from("leads")
        .insert([{ email: email.toLowerCase().trim() }]);

      if (error && error.code !== "23505") throw error;

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

      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      console.error("Breach Failed:", err.message);
      setStatus("ERROR");
      setTimeout(() => setStatus("READY"), 3000);
    }
  };

  const socials = [
    { id: "git", icon: <SiGithub />, label: "GITHUB", link: "#" },
    { id: "tik", icon: <SiTiktok />, label: "TIKTOK", link: "#" },
    { id: "ins", icon: <SiInstagram />, label: "INSTA", link: "#" },
    { id: "dsc", icon: <SiDiscord />, label: "DISCORD", link: "#" },
    { id: "xxx", icon: <SiX />, label: "X-CORP", link: "#" },
    { id: "whp", icon: <SiWhatsapp />, label: "WHATSAPP", link: "#" },
  ];

  const protocolLinks = ["Privacy", "Cookies", "Terms"];
  const archiveLinks = ["The Vault", "Personnel", "Neural Link"];

  return (
    <footer
      id="footer-section"
      className="relative min-h-screen w-full bg-[#030303] text-white flex flex-col justify-center overflow-hidden border-t border-white/5 py-20 lg:py-0"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_0%,transparent_100%)]" />
      </div>

      {/* Main grid */}
      <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 items-center min-h-[calc(100vh-80px)]">
        {/* Left — Uplink */}
        <div className="uplink-content flex flex-col gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-cyan-500">
              <RiTerminalBoxLine size={16} className="animate-pulse shrink-0" />
              <span className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] md:tracking-[0.5em] uppercase whitespace-nowrap">
                {hasAccess
                  ? "Connection_Encrypted // v4.0.1"
                  : "Auth_Session // v4.0.1"}
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[8rem] font-black italic tracking-tighter leading-[0.85] uppercase">
              {hasAccess ? "UPLINK" : "ESTABLISH"} <br />
              <span className={hasAccess ? "text-cyan-500" : "text-zinc-800"}>
                {hasAccess ? "ACTIVE" : "UPLINK"}
              </span>
            </h2>
          </div>

          {!hasAccess ? (
            <form
              onSubmit={handleBreach}
              className="relative w-full max-w-xl space-y-6 md:space-y-10 group"
            >
              <div className="relative border-b border-zinc-800 group-focus-within:border-cyan-500 transition-colors pb-4">
                <label className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest mb-2 block">
                  Neural_Mail_Address
                </label>
                <div className="flex items-center gap-4">
                  <RiMailLine className="text-zinc-700 shrink-0" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="USER@NETWORK.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-lg sm:text-xl md:text-2xl font-black italic uppercase placeholder:text-zinc-900 tracking-tighter"
                  />
                </div>
              </div>

              {/* Fixed button */}
              <button
                type="submit"
                disabled={status === "LOADING"}
                className="group/btn relative overflow-hidden bg-white text-black px-8 md:px-12 py-4 md:py-5 font-black uppercase italic tracking-widest text-xs inline-flex items-center justify-center gap-4 transition-transform active:scale-95 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Sweep overlay */}
                <div className="absolute inset-0 z-0 bg-cyan-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />

                <span className="relative z-10 text-black group-hover/btn:text-white transition-colors duration-300">
                  {status === "LOADING"
                    ? "Decrypting..."
                    : status === "ERROR"
                      ? "Breach Failed — Retry"
                      : "Sign Up to Breach"}
                </span>

                <RiFingerprint2Line
                  size={18}
                  className="relative z-10 text-black group-hover/btn:text-white group-hover/btn:scale-125 transition-all duration-300"
                />
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <p className="text-zinc-500 font-mono text-xs tracking-widest leading-relaxed max-w-md">
                Welcome back, Agent. Your neural link is established. Full
                archive access has been granted to your current workstation.
              </p>
              <div className="flex items-center gap-4 text-cyan-500 font-mono text-[10px] tracking-widest uppercase">
                <RiRadioButtonLine className="animate-pulse" />
                System_Status: Verified
              </div>
              <button
                onClick={() => navigate("/")}
                className="group/btn relative overflow-hidden bg-white text-black px-8 py-4 font-black uppercase italic tracking-widest text-xs inline-flex items-center gap-3 transition-transform active:scale-95 shadow-xl"
              >
                <div className="absolute inset-0 z-0 bg-cyan-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 text-black group-hover/btn:text-white transition-colors duration-300">
                  Enter Archive
                </span>
                <RiArrowRightUpLine
                  className="relative z-10 text-black group-hover/btn:text-white group-hover/btn:rotate-45 transition-all duration-300"
                  size={16}
                />
              </button>
            </div>
          )}
        </div>

        {/* Right — Social + links */}
        <div className="relative flex flex-col gap-10 md:gap-14 lg:pl-20 lg:border-l border-white/5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.link}
                className="group flex flex-col items-center justify-center p-5 md:p-7 border border-zinc-900 hover:border-cyan-500/50 bg-zinc-950/30 hover:bg-cyan-500/5 transition-all duration-300"
              >
                <div className="text-xl md:text-2xl text-zinc-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {social.icon}
                </div>
                <span className="mt-3 text-[8px] font-mono text-zinc-800 group-hover:text-cyan-500 tracking-widest uppercase font-bold transition-colors duration-300">
                  {social.label}
                </span>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono text-zinc-700 tracking-[0.4em] uppercase border-b border-zinc-900 pb-2">
                Protocols
              </h4>
              <ul className="space-y-3">
                {protocolLinks.map((link) => (
                  <li
                    key={link}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <span className="text-sm font-black italic uppercase text-zinc-600 group-hover:text-white transition-colors">
                      {link}
                    </span>
                    <RiArrowRightUpLine className="text-zinc-800 group-hover:text-cyan-500 transition-colors" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-mono text-zinc-700 tracking-[0.4em] uppercase border-b border-zinc-900 pb-2">
                Archive
              </h4>
              <ul className="space-y-3">
                {archiveLinks.map((link) => (
                  <li
                    key={link}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <span className="text-sm font-black italic uppercase text-zinc-600 group-hover:text-white transition-colors">
                      {link}
                    </span>
                    <RiArrowRightUpLine className="text-zinc-800 group-hover:text-cyan-500 transition-colors" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Success screen */}
      <div className="breach-success absolute inset-0 hidden flex-col items-center justify-center bg-black z-50 opacity-0 scale-95 pointer-events-none p-6 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-5 md:p-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 shadow-[0_0_60px_rgba(6,182,212,0.2)]">
            <RiShieldFlashLine size={40} className="animate-pulse" />
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase text-white">
            Access <span className="text-cyan-500">Granted</span>
          </h2>
          <p className="text-zinc-500 font-mono text-[9px] md:text-[10px] tracking-[0.5em] md:tracking-[1em] uppercase">
            Establishing Neural Connection...
          </p>
        </div>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 w-full p-5 md:p-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center bg-black gap-4">
        <div className="flex gap-5 md:gap-10 items-center">
          <div className="text-zinc-700 font-mono text-[8px] md:text-[9px] tracking-widest uppercase">
            System: <span className="text-cyan-500">Secure</span>
          </div>
          <div className="text-zinc-700 font-mono text-[8px] md:text-[9px] tracking-widest uppercase">
            Latency: <span className="text-cyan-500">14ms</span>
          </div>
        </div>
        <div className="text-[9px] md:text-[10px] font-mono text-zinc-800 tracking-widest uppercase text-center">
          © NOIR_ARCHIVE // DATA_LINK_2024
        </div>
      </div>
    </footer>
  );
};

export default Footer;
