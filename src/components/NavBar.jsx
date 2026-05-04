import {
  Menu,
  X,
  LogOut,
  Heart,
  Film,
  Tv,
  ChevronDown,
  TvMinimalPlayIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Navbar({ setCategories, setType }) {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [openMovies, setOpenMovies] = useState(false);
  const [openTvShow, setOpenTvShow] = useState(false);

  // Refs for animations
  const logoRef = useRef(null);
  const desktopLinksRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const moviesDropdownRef = useRef(null);
  const tvDropdownRef = useRef(null);

  // Helper to change category and close the mobile menu
  const handleClick = (category, type) => {
    setType(type);
    setCategories(category);
    navigate("/");
    setOpenMenu(false);
  };

  const handleLogout = async () => {
    await logOut();
    setOpenMenu(false);
    navigate("/auth");
  };

  // Initial page load animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Logo dramatic entrance
    tl.fromTo(
      logoRef.current,
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      },
    );

    // Desktop links stagger animation
    if (desktopLinksRef.current) {
      tl.fromTo(
        desktopLinksRef.current.children,
        {
          y: -30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.5",
      );
    }

    // Mobile toggle button
    if (mobileToggleRef.current) {
      tl.fromTo(
        mobileToggleRef.current,
        { scale: 0, rotation: 180 },
        { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.6",
      );
    }
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (openMenu && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        {
          height: 0,
          opacity: 0,
        },
        {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        mobileMenuRef.current.children,
        {
          x: -50,
          opacity: 0,
        },
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

  // Movies dropdown animation (mobile)
  useEffect(() => {
    if (openMovies && mobileMenuRef.current) {
      const dropdown = mobileMenuRef.current.querySelector(
        ".movies-dropdown-items",
      );
      if (dropdown) {
        gsap.fromTo(
          dropdown.children,
          {
            scale: 0.8,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            stagger: 0.05,
            ease: "back.out(1.7)",
          },
        );
      }
    }
  }, [openMovies]);

  // TV Shows dropdown animation (mobile)
  useEffect(() => {
    if (openTvShow && mobileMenuRef.current) {
      const dropdown =
        mobileMenuRef.current.querySelector(".tv-dropdown-items");
      if (dropdown) {
        gsap.fromTo(
          dropdown.children,
          {
            scale: 0.8,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            stagger: 0.05,
            ease: "back.out(1.7)",
          },
        );
      }
    }
  }, [openTvShow]);

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div
          ref={logoRef}
          onClick={() => navigate("/")}
          className="cursor-pointer font-black text-xl md:text-2xl tracking-tighter text-white italic"
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.1,
              // rotation: 5,
              duration: 0.3,
              ease: "power2.out",
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              // rotation: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }}
        >
          🎬 MOVIE<span className="text-cyan-500">LAB</span>
        </div>

        {/* Desktop Links */}
        <div
          ref={desktopLinksRef}
          className="hidden md:flex gap-8 items-center text-gray-300 font-medium"
        >
          {/* Movies Dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors py-2"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget.querySelector("svg:last-child"), {
                  rotation: 180,
                  duration: 0.3,
                });
                gsap.to(e.currentTarget, {
                  y: -2,
                  duration: 0.2,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget.querySelector("svg:last-child"), {
                  rotation: 0,
                  duration: 0.3,
                });
                gsap.to(e.currentTarget, {
                  y: 0,
                  duration: 0.2,
                });
              }}
            >
              <Film size={18} /> Movies <ChevronDown size={14} />
            </button>
            <div
              ref={moviesDropdownRef}
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-0 bg-gray-900 border border-white/10 rounded-xl p-2 w-48 shadow-2xl transition-all duration-200"
              onMouseEnter={(e) => {
                gsap.fromTo(
                  e.currentTarget.children,
                  { x: -10, opacity: 0 },
                  {
                    x: 0,
                    opacity: 1,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: "power2.out",
                  },
                );
              }}
            >
              {["popular", "top_rated", "upcoming", "now_playing"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => handleClick(item, "movie")}
                    className="w-full text-left px-4 py-2 hover:bg-cyan-600/20 hover:text-cyan-400 rounded-lg capitalize text-sm transition-all"
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, {
                        x: 5,
                        duration: 0.2,
                      });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, {
                        x: 0,
                        duration: 0.2,
                      });
                    }}
                  >
                    {item.replaceAll("_", " ")}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* TV Dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors py-2"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget.querySelector("svg:last-child"), {
                  rotation: 180,
                  duration: 0.3,
                });
                gsap.to(e.currentTarget, {
                  y: -2,
                  duration: 0.2,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget.querySelector("svg:last-child"), {
                  rotation: 0,
                  duration: 0.3,
                });
                gsap.to(e.currentTarget, {
                  y: 0,
                  duration: 0.2,
                });
              }}
            >
              <Tv size={18} /> TV Shows <ChevronDown size={14} />
            </button>
            <div
              ref={tvDropdownRef}
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-0 bg-gray-900 border border-white/10 rounded-xl p-2 w-48 shadow-2xl transition-all duration-200"
              onMouseEnter={(e) => {
                gsap.fromTo(
                  e.currentTarget.children,
                  { x: -10, opacity: 0 },
                  {
                    x: 0,
                    opacity: 1,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: "power2.out",
                  },
                );
              }}
            >
              {["popular", "top_rated", "on_the_air", "airing_today"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => handleClick(item, "tv")}
                    className="w-full text-left px-4 py-2 hover:bg-cyan-600/20 hover:text-cyan-400 rounded-lg capitalize text-sm transition-all"
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, {
                        x: 5,
                        duration: 0.2,
                      });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, {
                        x: 0,
                        duration: 0.2,
                      });
                    }}
                  >
                    {item.replaceAll("_", " ")}
                  </button>
                ),
              )}
            </div>
          </div>

          <Link
            to="/fav"
            className="flex items-center gap-1 hover:text-red-400 transition-colors"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget.querySelector("svg"), {
                scale: 1.3,
                fill: "#f87171",
                duration: 0.3,
                ease: "back.out(1.7)",
              });
              gsap.to(e.currentTarget, {
                y: -2,
                duration: 0.2,
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget.querySelector("svg"), {
                scale: 1,
                fill: "none",
                duration: 0.3,
              });
              gsap.to(e.currentTarget, {
                y: 0,
                duration: 0.2,
              });
            }}
          >
            <Heart size={18} /> Favorites
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/50 px-4 py-2 rounded-full text-sm transition-all"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)",
                  duration: 0.3,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  boxShadow: "0 0 0px rgba(239, 68, 68, 0)",
                  duration: 0.3,
                });
              }}
            >
              <LogOut size={16} /> Log Out
            </button>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          ref={mobileToggleRef}
          onClick={() => setOpenMenu(!openMenu)}
          className="md:hidden text-white p-2"
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.1,
              rotation: 180,
              duration: 0.3,
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
            });
          }}
        >
          {openMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {openMenu && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-white/10 p-4 flex flex-col gap-3 overflow-hidden"
        >
          {/* Mobile Movies Dropdown */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setOpenMovies(!openMovies)}
              className="flex justify-between items-center w-full p-3 bg-white/5 rounded-xl text-white font-bold"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  duration: 0.2,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  duration: 0.2,
                });
              }}
            >
              <span className="flex items-center gap-2">
                <Film size={18} /> Movies
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${openMovies ? "rotate-180" : ""}`}
              />
            </button>
            {openMovies && (
              <div className="movies-dropdown-items grid grid-cols-2 gap-2 pl-2">
                {["popular", "top_rated", "upcoming", "now_playing"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => handleClick(item, "movie")}
                      className="text-left py-2 px-3 text-gray-400 capitalize text-sm bg-white/5 rounded-lg hover:bg-cyan-600/20 hover:text-cyan-400 transition-all"
                    >
                      {item.replaceAll("_", " ")}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Mobile TV Shows Dropdown */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setOpenTvShow(!openTvShow)}
              className="flex justify-between items-center w-full p-3 bg-white/5 rounded-xl text-white font-bold"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  duration: 0.2,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  duration: 0.2,
                });
              }}
            >
              <span className="flex items-center gap-2">
                <Tv size={18} /> TV Shows
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${openTvShow ? "rotate-180" : ""}`}
              />
            </button>
            {openTvShow && (
              <div className="tv-dropdown-items grid grid-cols-2 gap-2 pl-2">
                {["popular", "top_rated", "on_the_air", "airing_today"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => handleClick(item, "tv")}
                      className="text-left py-2 px-3 text-gray-400 capitalize text-sm bg-white/5 rounded-lg hover:bg-cyan-600/20 hover:text-cyan-400 transition-all"
                    >
                      {item.replaceAll("_", " ")}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          <Link
            to="/fav"
            onClick={() => setOpenMenu(false)}
            className="flex items-center gap-2 p-3 bg-white/5 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
          >
            <Heart size={18} className="text-red-500" /> Favorites
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full p-3 bg-red-600 rounded-xl text-white font-bold mt-2 hover:bg-red-700 transition-all active:scale-95"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
