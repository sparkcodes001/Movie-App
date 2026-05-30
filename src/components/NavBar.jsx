import { Menu, X, LogOut, Heart, Film, Tv, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CinematicLogo from "../context/Logo";
import { RiRadioButtonLine } from "react-icons/ri";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const [searchParams] = useSearchParams();
  const [openMenu, setOpenMenu] = useState(false);
  const [openMovies, setOpenMovies] = useState(false);
  const [openTvShow, setOpenTvShow] = useState(false);

  const logoRef = useRef(null);
  const desktopLinksRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const navRef = useRef(null);

  const currentType = searchParams.get("type") || "movie";
  const currentCategory = searchParams.get("category") || "popular";

  const handleClick = (category, mediaType) => {
    navigate(`/home/?type=${mediaType}&category=${category}`);
    setOpenMenu(false);
    setOpenMovies(false);
    setOpenTvShow(false);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.removeItem("vault_access");
      setOpenMenu(false);
      navigate("/home");
    } catch (error) {
      console.error("Connection Severance Failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useGSAP(() => {
    if (
      !logoRef.current ||
      !desktopLinksRef.current ||
      !mobileToggleRef.current
    )
      return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      logoRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8 },
    )
      .fromTo(
        desktopLinksRef.current.children,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
        "-=0.5",
      )
      .fromTo(
        mobileToggleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        "-=0.4",
      );
  }, []);

  useEffect(() => {
    if (openMenu && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" },
      );
      gsap.fromTo(
        mobileMenuRef.current.children,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.07,
          ease: "power2.out",
          delay: 0.05,
        },
      );
    }
  }, [openMenu]);

  const movieCategories = ["popular", "top_rated", "upcoming", "now_playing"];
  const tvCategories = ["popular", "top_rated", "on_the_air", "airing_today"];

  const dropdownClass =
    "invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-0 bg-[#080808] border border-white/10 p-2 w-52 shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-200 z-50";

  const dropdownItemClass = (active) =>
    `w-full text-left px-4 py-2.5 capitalize text-[10px] font-mono uppercase tracking-widest transition-all hover:translate-x-1 border-l-2 ${
      active
        ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
        : "border-transparent text-zinc-500 hover:border-zinc-600 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-[#030303]/90 backdrop-blur-xl border-b border-white/5"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
        {/* Logo */}
        <div
          ref={logoRef}
          onClick={() => navigate("/")}
          className="cursor-pointer"
        >
          <CinematicLogo />
        </div>

        {/* Desktop Links */}
        <div
          ref={desktopLinksRef}
          className="hidden md:flex gap-8 items-center"
        >
          <div className="hidden lg:flex items-center gap-2 font-mono text-[8px] tracking-[0.2em] uppercase text-zinc-600">
            <RiRadioButtonLine
              className="text-green-500 animate-pulse"
              size={10}
            />
            <span>Archive_Online</span>
          </div>

          {/* Movies */}
          <div className="relative group">
            <button
              className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors py-2 ${
                currentType === "movie"
                  ? "text-cyan-400"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              <Film size={14} /> Movies
              <ChevronDown
                size={12}
                className="group-hover:rotate-180 transition-transform duration-300"
              />
            </button>
            <div className={dropdownClass}>
              {movieCategories.map((item) => (
                <button
                  key={item}
                  onClick={() => handleClick(item, "movie")}
                  className={dropdownItemClass(
                    currentType === "movie" && currentCategory === item,
                  )}
                >
                  {item.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* TV Shows */}
          <div className="relative group">
            <button
              className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors py-2 ${
                currentType === "tv"
                  ? "text-cyan-400"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              <Tv size={14} /> TV Shows
              <ChevronDown
                size={12}
                className="group-hover:rotate-180 transition-transform duration-300"
              />
            </button>
            <div className={dropdownClass}>
              {tvCategories.map((item) => (
                <button
                  key={item}
                  onClick={() => handleClick(item, "tv")}
                  className={dropdownItemClass(
                    currentType === "tv" && currentCategory === item,
                  )}
                >
                  {item.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <Link
            to="/fav"
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors group"
          >
            <Heart
              size={14}
              className="group-hover:fill-red-400 transition-all"
            />
            Vault
          </Link>

          {/* Logout */}
          {(user || localStorage.getItem("vault_access")) && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-white/10 hover:border-red-500/50 px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-zinc-600 hover:text-red-400 transition-all"
            >
              <LogOut size={12} /> Sever_Link
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          ref={mobileToggleRef}
          onClick={() => setOpenMenu(!openMenu)}
          className="md:hidden text-zinc-400 hover:text-white p-2 border border-white/10 transition-colors"
        >
          {openMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu — solid bg, no opacity modifier on arbitrary color */}
      {openMenu && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 w-full border-b border-white/5 p-4 flex flex-col gap-2 overflow-hidden"
          style={{
            backgroundColor: "#030303",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Mobile Movies */}
          <div className="flex flex-col">
            <button
              onClick={() => setOpenMovies(!openMovies)}
              className={`flex justify-between items-center w-full p-3 border border-white/5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                currentType === "movie"
                  ? "text-cyan-400 border-cyan-500/20"
                  : "text-zinc-500"
              }`}
            >
              <span className="flex items-center gap-2">
                <Film size={14} /> Movies
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${openMovies ? "rotate-180" : ""}`}
              />
            </button>
            {openMovies && (
              <div className="grid grid-cols-2 gap-1 mt-1 pl-2">
                {movieCategories.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleClick(item, "movie")}
                    className={`text-left py-2.5 px-3 font-mono text-[9px] uppercase tracking-widest transition-all border-l-2 ${
                      currentType === "movie" && currentCategory === item
                        ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
                        : "border-transparent text-zinc-600 hover:text-white"
                    }`}
                  >
                    {item.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile TV */}
          <div className="flex flex-col">
            <button
              onClick={() => setOpenTvShow(!openTvShow)}
              className={`flex justify-between items-center w-full p-3 border border-white/5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                currentType === "tv"
                  ? "text-cyan-400 border-cyan-500/20"
                  : "text-zinc-500"
              }`}
            >
              <span className="flex items-center gap-2">
                <Tv size={14} /> TV Shows
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${openTvShow ? "rotate-180" : ""}`}
              />
            </button>
            {openTvShow && (
              <div className="grid grid-cols-2 gap-1 mt-1 pl-2">
                {tvCategories.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleClick(item, "tv")}
                    className={`text-left py-2.5 px-3 font-mono text-[9px] uppercase tracking-widest transition-all border-l-2 ${
                      currentType === "tv" && currentCategory === item
                        ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
                        : "border-transparent text-zinc-600 hover:text-white"
                    }`}
                  >
                    {item.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Favorites */}
          <Link
            to="/fav"
            onClick={() => setOpenMenu(false)}
            className="flex items-center gap-2 p-3 border border-white/5 font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors"
          >
            <Heart size={14} className="text-red-500 fill-red-500" />
            Favorites_Vault
          </Link>

          {/* Mobile Logout */}
          {(user || localStorage.getItem("vault_access")) && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full p-3 border border-red-500/20 bg-red-500/5 font-mono text-[9px] uppercase tracking-widest text-red-500/70 hover:text-red-400 transition-all mt-1"
            >
              <LogOut size={14} /> Sever_Connection
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
