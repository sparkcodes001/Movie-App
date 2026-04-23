import { Menu, X, LogOut, Heart, Film, Tv, ChevronDown, TvMinimalPlayIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ setCategories, setType }) {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [openMovies, setOpenMovies] = useState(false);
  const [openTvShow, setOpenTvShow] = useState(false);

  // Helper to change category and close the mobile menu
  const handleClick = (category, type) => {
    setType(type);
    setCategories(category);
    navigate("/");
    setOpenMenu(false); // Close mobile menu after clicking
  };

  const handleLogout = async () => {
    await logOut();
    setOpenMenu(false);
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo - Restored Emoji */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer font-black text-xl md:text-2xl tracking-tighter text-white italic"
        >
          🎬 MOVIE<span className="text-cyan-500">LAB</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center text-gray-300 font-medium">
          {/* Movies Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors py-2">
              <Film size={18} /> Movies <ChevronDown size={14} />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-0 bg-gray-900 border border-white/10 rounded-xl p-2 w-48 shadow-2xl transition-all duration-200">
              {["popular", "top_rated", "upcoming", "now_playing"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => handleClick(item, "movie")}
                    className="w-full text-left px-4 py-2 hover:bg-cyan-600/20 hover:text-cyan-400 rounded-lg capitalize text-sm transition-all"
                  >
                    {item.replaceAll("_", " ")}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* TV Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors py-2">
              <Tv size={18} /> TV Shows <ChevronDown size={14} />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-0 bg-gray-900 border border-white/10 rounded-xl p-2 w-48 shadow-2xl transition-all duration-200">
              {["popular", "top_rated", "on_the_air", "airing_today"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => handleClick(item, "tv")}
                    className="w-full text-left px-4 py-2 hover:bg-cyan-600/20 hover:text-cyan-400 rounded-lg capitalize text-sm transition-all"
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
          >
            <Heart size={18} /> Favorites
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/50 px-4 py-2 rounded-full text-sm transition-all"
            >
              <LogOut size={16} /> Log Out
            </button>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="md:hidden text-white p-2"
        >
          {openMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu - Restored TV Shows and better layout */}
      {openMenu && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-white/10 p-4 flex flex-col gap-3 animate-in slide-in-from-top duration-300">
          {/* Mobile Movies Dropdown */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setOpenMovies(!openMovies)}
              className="flex justify-between items-center w-full p-3 bg-white/5 rounded-xl text-white font-bold"
            >
              <span className="flex items-center gap-2">
                <Film size={18} /> Movies
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform ${openMovies ? "rotate-180" : ""}`}
              />
            </button>
            {openMovies && (
              <div className="grid grid-cols-2 gap-2 pl-2">
                {["popular", "top_rated", "upcoming", "now_playing"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => handleClick(item, "movie")}
                      className="text-left py-2 px-3 text-gray-400 capitalize text-sm bg-white/5 rounded-lg"
                    >
                      {item.replaceAll("_", " ")}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Mobile TV Shows Dropdown - RESTORED */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setOpenTvShow(!openTvShow)}
              className="flex justify-between items-center w-full p-3 bg-white/5 rounded-xl text-white font-bold"
            >
              <span className="flex items-center gap-2">
                <Tv size={18} /> TV Shows
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform ${openTvShow ? "rotate-180" : ""}`}
              />
            </button>
            {openTvShow && (
              <div className="grid grid-cols-2 gap-2 pl-2">
                {["popular", "top_rated", "on_the_air", "airing_today"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => handleClick(item, "tv")}
                      className="text-left py-2 px-3 text-gray-400 capitalize text-sm bg-white/5 rounded-lg"
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
            className="flex items-center gap-2 p-3 bg-white/5 rounded-xl text-white font-bold"
          >
            <Heart size={18} className="text-red-500" /> Favorites
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full p-3 bg-red-600 rounded-xl text-white font-bold mt-2"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
