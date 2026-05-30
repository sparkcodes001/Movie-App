import { Menu, X, LogOut, Heart, Film, Tv, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CinematicLogo from "../context/Logo";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openMenu, setOpenMenu] = useState(false);
  const [openMovies, setOpenMovies] = useState(false);
  const [openTvShow, setOpenTvShow] = useState(false);

  const logoRef = useRef(null);
  const desktopLinksRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const navRef = useRef(null);

  // Current active state derived from URL
  const currentType = searchParams.get("type") || "movie";
  const currentCategory = searchParams.get("category") || "popular";

  // THE CORE FIX: Navigate to "/" with type+category in URL, wipe everything else
  const handleClick = (category, mediaType) => {
    navigate({
      pathname: "/",
      search: `?type=${mediaType}&category=${category}`,
    });
    setOpenMenu(false);
    setOpenMovies(false);
    setOpenTvShow(false);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.removeItem("vault_access");
      setOpenMenu(false);
      navigate("/auth");
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
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
    );

    tl.fromTo(
      desktopLinksRef.current.children,
      { y: -30, opacity: 0, scale: 0 },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
      },
      "-=0.5",
    );

    tl.fromTo(
      mobileToggleRef.current,
      { scale: 0, rotation: 180 },
      { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.6",
    );
  }, []);

  useEffect(() => {
    if (openMenu && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" },
      );
      gsap.fromTo(
        mobileMenuRef.current.children,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.1,
        },
      );
    }
  }, [openMenu]);

  const movieCategories = ["popular", "top_rated", "upcoming", "now_playing"];
  const tvCategories = ["popular", "top_rated", "on_the_air", "airing_today"];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div
          ref={logoRef}
          onClick={() => handleClick("popular", "movie")}
          className="cursor-pointer"
        >
          <CinematicLogo />
        </div>

        {/* Desktop Links */}
        <div
          ref={desktopLinksRef}
          className="hidden md:flex gap-8 items-center text-gray-300 font-medium"
        >
          {/* Movies Dropdown */}
          <div className="relative group">
            <button
              className={`flex items-center gap-1 transition-colors py-2 ${
                currentType === "movie"
                  ? "text-cyan-400"
                  : "hover:text-cyan-400"
              }`}
            >
              <Film size={18} /> Movies{" "}
              <ChevronDown
                size={14}
                className="group-hover:rotate-180 transition-transform duration-300"
              />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-0 bg-gray-950 border border-white/10 rounded-xl p-2 w-48 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-200">
              {movieCategories.map((item) => (
                <button
                  key={item}
                  onClick={() => handleClick(item, "movie")}
                  className={`w-full text-left px-4 py-2 rounded-lg capitalize text-sm transition-all hover:translate-x-1 ${
                    currentType === "movie" && currentCategory === item
                      ? "bg-cyan-600/30 text-cyan-400 font-bold"
                      : "hover:bg-cyan-600/20 hover:text-cyan-400"
                  }`}
                >
                  {item.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* TV Dropdown */}
          <div className="relative group">
            <button
              className={`flex items-center gap-1 transition-colors py-2 ${
                currentType === "tv" ? "text-cyan-400" : "hover:text-cyan-400"
              }`}
            >
              <Tv size={18} /> TV Shows{" "}
              <ChevronDown
                size={14}
                className="group-hover:rotate-180 transition-transform duration-300"
              />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-0 bg-gray-950 border border-white/10 rounded-xl p-2 w-48 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-200">
              {tvCategories.map((item) => (
                <button
                  key={item}
                  onClick={() => handleClick(item, "tv")}
                  className={`w-full text-left px-4 py-2 rounded-lg capitalize text-sm transition-all hover:translate-x-1 ${
                    currentType === "tv" && currentCategory === item
                      ? "bg-cyan-600/30 text-cyan-400 font-bold"
                      : "hover:bg-cyan-600/20 hover:text-cyan-400"
                  }`}
                >
                  {item.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/fav"
            className="flex items-center gap-1 hover:text-red-400 transition-colors group"
          >
            <Heart
              size={18}
              className="group-hover:fill-red-400 transition-all group-hover:scale-110"
            />{" "}
            Favorites
          </Link>

          {(user || localStorage.getItem("vault_access")) && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 hover:bg-red-600/10 border border-white/10 hover:border-red-500/50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
            >
              <LogOut size={14} /> Sever Connection
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          ref={mobileToggleRef}
          onClick={() => setOpenMenu(!openMenu)}
          className="md:hidden text-white p-2"
        >
          {openMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {openMenu && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-white/10 p-4 flex flex-col gap-3 overflow-hidden backdrop-blur-xl"
        >
          {/* Mobile Movies */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setOpenMovies(!openMovies)}
              className={`flex justify-between items-center w-full p-3 bg-white/5 rounded-xl font-bold ${
                currentType === "movie" ? "text-cyan-400" : "text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Film size={18} /> Movies
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  openMovies ? "rotate-180" : ""
                }`}
              />
            </button>
            {openMovies && (
              <div className="grid grid-cols-2 gap-2 pl-2">
                {movieCategories.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleClick(item, "movie")}
                    className={`text-left py-2 px-3 capitalize text-sm rounded-lg transition-all ${
                      currentType === "movie" && currentCategory === item
                        ? "bg-cyan-600/30 text-cyan-400 font-bold"
                        : "text-gray-400 bg-white/5 active:bg-cyan-600/20 active:text-cyan-400"
                    }`}
                  >
                    {item.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile TV Shows */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setOpenTvShow(!openTvShow)}
              className={`flex justify-between items-center w-full p-3 bg-white/5 rounded-xl font-bold ${
                currentType === "tv" ? "text-cyan-400" : "text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Tv size={18} /> TV Shows
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  openTvShow ? "rotate-180" : ""
                }`}
              />
            </button>
            {openTvShow && (
              <div className="grid grid-cols-2 gap-2 pl-2">
                {tvCategories.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleClick(item, "tv")}
                    className={`text-left py-2 px-3 capitalize text-sm rounded-lg transition-all ${
                      currentType === "tv" && currentCategory === item
                        ? "bg-cyan-600/30 text-cyan-400 font-bold"
                        : "text-gray-400 bg-white/5 active:bg-cyan-600/20 active:text-cyan-400"
                    }`}
                  >
                    {item.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/fav"
            onClick={() => setOpenMenu(false)}
            className="flex items-center gap-2 p-3 bg-white/5 rounded-xl text-white font-bold"
          >
            <Heart size={18} className="text-red-500 fill-red-500" /> Favorites
          </Link>

          {(user || localStorage.getItem("vault_access")) && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full p-4 bg-red-600/20 border border-red-600/50 rounded-xl text-red-500 font-black uppercase tracking-widest mt-2 active:scale-95"
            >
              <LogOut size={18} /> Sever Connection
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
