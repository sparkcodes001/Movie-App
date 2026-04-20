import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar({ setCategories, setType }) {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [movieOpen, setMovieOpen] = useState(false);
  const [tvOpen, setTvOpen] = useState(false);

  const handleNavigation = (category, type) => {
    setCategories(category);
    setType(type);
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-gray-800">
      <div className=" mx-auto flex items-center justify-between px-4 py-3">
        {/* LOGO */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-white">
          🎬 <span className="text-sky-500">MovieApp</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {/* MOVIES */}
          <div className="relative group">
            <button className="text-gray-200 hover:text-sky-500 transition">
              Movies ▾
            </button>

            <div className="absolute z-50 left-0 mt-3 w-48 bg-gray-900 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
              <ul className="p-2 space-y-1">
                {["popular", "top_rated", "upcoming", "now_playing"].map(
                  (item) => (
                    <li
                      key={item}
                      onClick={() => handleNavigation(item, "movie")}
                      className="px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer capitalize"
                    >
                      {item.replace("_", " ")}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* TV SHOWS */}
          <div className="relative group">
            <button className="text-gray-200 hover:text-sky-500 transition">
              TV Shows ▾
            </button>

            <div className="absolute left-0 mt-3 w-48 bg-gray-900 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
              <ul className="p-2 space-y-1">
                {["popular", "top_rated", "on_the_air", "airing_today"].map(
                  (item) => (
                    <li
                      key={item}
                      onClick={() => handleNavigation(item, "tv")}
                      className="px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer capitalize"
                    >
                      {item.replace("_", " ")}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* FAVORITE */}
          <Link
            to="/fav"
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            Favorite
          </Link>

          {/* LOGOUT */}
          {user && (
            <button
              onClick={logOut}
              className="px-4 py-2 bg-sky-600 rounded-lg hover:bg-sky-700 transition"
            >
              Log Out
            </button>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 px-6 pb-6 space-y-4 transition-all">
          {/* Movies */}
          <div>
            <button
              onClick={() => setMovieOpen(!movieOpen)}
              className="w-full text-left py-2 text-gray-200"
            >
              Movies ▾
            </button>

            {movieOpen && (
              <ul className="pl-4 space-y-2 text-gray-400">
                {["popular", "top_rated", "upcoming", "now_playing"].map(
                  (item) => (
                    <li
                      key={item}
                      onClick={() => handleNavigation(item, "movie")}
                      className="cursor-pointer capitalize"
                    >
                      {item.replace("_", " ")}
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>

          {/* TV */}
          <div>
            <button
              onClick={() => setTvOpen(!tvOpen)}
              className="w-full text-left py-2 text-gray-200"
            >
              TV Shows ▾
            </button>

            {tvOpen && (
              <ul className="pl-4 space-y-2 text-gray-400">
                {["popular", "top_rated", "on_the_air", "airing_today"].map(
                  (item) => (
                    <li
                      key={item}
                      onClick={() => handleNavigation(item, "tv")}
                      className="cursor-pointer capitalize"
                    >
                      {item.replace("_", " ")}
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>

          {/* Favorite */}
          <Link
            to="/fav"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-gray-200"
          >
            Favorite
          </Link>

          {/* Logout */}
          {user && (
            <button
              onClick={() => {
                logOut();
                setMenuOpen(false);
              }}
              className="w-full py-2 bg-sky-600 rounded-lg"
            >
              Log Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
