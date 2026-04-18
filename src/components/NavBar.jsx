import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ setCategories, setType }) {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 backdrop-blur flex items-center gap-6 justify-between shadow-lg shadow-black/70 p-4 w-full text-white bg-black/40 z-50">
      <Link to={"/"} className="text-xl font-bold">
        🎬 MovieApp
      </Link>

      {/* <p className="text-center text-white">
        Welcome back {user && user.name} 🎉
      </p> */}

      <div className="flex gap-3">
        {/* MOVIES DROPDOWN */}
        <div className="relative group">
          <button className="hover:text-sky-500 text-lg">Movies ▾</button>

          <div
            className="absolute left-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg 
                        opacity-0 group-hover:opacity-100 invisible 
                        group-hover:visible transition-all duration-300 z-50"
          >
            <ul className="flex flex-col p-2 z-10">
              <li
                onClick={() => {
                  setCategories("popular");
                  setType("movie");
                  navigate("/");
                }}
                className="p-2 hover:bg-gray-700 rounded cursor-pointer"
              >
                Popular
              </li>
              <li
                onClick={() => {
                  setCategories("top_rated");
                  setType("movie");
                  navigate("/");
                }}
                className="p-2 hover:bg-gray-700 rounded cursor-pointer"
              >
                Top Rated
              </li>
              <li
                onClick={() => {
                  setCategories("upcoming");
                  setType("movie");
                  navigate("/");
                }}
                className="p-2 hover:bg-gray-700 rounded cursor-pointer"
              >
                Upcoming
              </li>
              <li
                onClick={() => {
                  setCategories("now_playing");
                  setType("movie");
                  navigate("/");
                }}
                className="p-2 hover:bg-gray-700 rounded cursor-pointer"
              >
                Now Playing
              </li>
            </ul>
          </div>
        </div>

        {/* TV-SHOW */}
        <div className="relative group">
          <button className="hover:text-sky-500 transition-all text-lg">
            Tv-show ▾
          </button>

          <div
            className="absolute left-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg 
                        opacity-0 group-hover:opacity-100 invisible 
                        group-hover:visible transition-all duration-300 z-50"
          >
            <ul className="flex flex-col p-2">
              <li
                onClick={() => {
                  setCategories("popular");
                  setType("tv");
                  navigate("/");
                }}
                className="p-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                Popular
              </li>
              <li
                onClick={() => {
                  setCategories("top_rated");
                  setType("tv");
                  navigate("/");
                }}
                className="p-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                Top Rated
              </li>
              <li
                onClick={() => {
                  setCategories("on_the_air");
                  setType("tv");
                  navigate("/");
                }}
                className="p-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                On Tv
              </li>
              <li
                onClick={() => {
                  setCategories("airing_today");
                  setType("tv");
                  navigate("/");
                }}
                className="p-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                Airing Today
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          to={"/fav"}
          className="p-2 text-sm bg-gray-800 rounded-lg hover:bg-gray-900 shadow-2xl border border-gray-600 transition-all"
        >
          Favorite
        </Link>
        {user && (
          <button
            onClick={() => logOut()}
            className="p-2 text-sm text-gray-100 bg-sky-600 rounded-lg hover:bg-sky-800 shadow-2xl border border-black/45 transition-all"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}
