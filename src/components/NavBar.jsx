import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ setCategories, setType }) {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  const handleClick = (category, type) => {
    setType(type);
    setCategories(category);
    navigate("/");
    setOpenMenu(false);
  };

  const [openMenu, setOpenMenu] = useState(false);
  const [openMovies, setOpenMovies] = useState(false);
  const [openTvShow, setOpenTvShow] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-gray-800">
      <div className="flex justify-between items-center px-2 py-3">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="font-black text-cyan-400 md:text-xl text-lg"
        >
          🎬 MovieLab
        </div>

        {/* Actions btn for BIG-SCREEN */}
        <div className="hidden md:flex gap-5">
          {/* Movies */}
          <div className="relative group">
            <button className="p-2 hover:text-blue-400 text-lg">
              Movies ▾
            </button>

            <ul className="invisible opacity-0 absolute top-12 group-hover:visible flex flex-col bg-gray-900 p-2 text-nowrap rounded-md space-y-1 z-50 transition-all group-hover:opacity-100 group-hover:transition-all group-hover:duration-300">
              {["popular", "top_rated", "upcoming", "now_playing"].map(
                (item) => (
                  <li
                    key={item}
                    onClick={() => handleClick(item, "movie")}
                    className="capitalize w-48 hover:bg-cyan-900 py-2 px-3 cursor-pointer rounded-md"
                  >
                    {item.replaceAll("_", " ")}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Tv Shows */}
          <div className="relative group">
            <button className="p-2 hover:text-blue-400 text-lg">
              Tv-Shows ▾
            </button>

            <ul className="invisible opacity-0 absolute top-12 group-hover:visible flex flex-col bg-gray-900 p-2 text-nowrap rounded-md space-y-1 z-50 transition-all group-hover:opacity-100 group-hover:transition-all group-hover:duration-300">
              {["popular", "top_rated", "on_the_air", "airing_today"].map(
                (item) => (
                  <li
                    key={item}
                    onClick={() => handleClick(item, "tv")}
                    className="capitalize w-48 hover:bg-cyan-900 py-2 px-3 cursor-pointer rounded-md"
                  >
                    {item.replaceAll("_", " ")}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="flex gap-5 items-center">
            <Link
              to={"/fav"}
              className="p-2 px-3 bg-gray-800 backdrop-blur  rounded-md hover:bg-slate-700 transition-all text-center"
            >
              Favorites
            </Link>

            <button className="p-2 px-3 bg-sky-500 rounded-md hover:bg-sky-600 transition-all">
              Log-Out
            </button>
          </div>
        </div>

        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="transition-all duration-200 md:hidden"
        >
          {openMenu ? <X /> : <Menu />}
        </button>
      </div>

      {/* Av=ction Btn on Mobile View */}
      {openMenu && (
        <div className="md:hidden flex flex-col gap-3 p-3 bg-gray-950 transition-all duration-200">
          {/* Movies */}
          <div className="flex flex-col items-start gap-1 border rounded-md p-2 border-gray-500 bg-black/70 transition-all">
            <button
              className="ml-1 text-gray-100 w-full text-start"
              onClick={() => setOpenMovies(!openMovies)}
            >
              Movies ▾
            </button>

            {openMovies && (
              <div className=" text-gray-400 w-full rounded-md px-3 py-2">
                <ul className="flex flex-col gap-2 capitalize">
                  {["popular", "top_rated", "upcoming", "now_playing"].map(
                    (item) => (
                      <li key={item} onClick={() => handleClick(item, "movie")}>
                        {item.replaceAll("_", " ")}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Tv-shows */}
          <div className="flex flex-col items-start gap-1 border rounded-md p-2 border-gray-500 bg-black/70 transition-all">
            <button
              className="ml-1 text-gray-100 w-full text-start"
              onClick={() => setOpenTvShow(!openTvShow)}
            >
              Tv-shows ▾
            </button>

            {openTvShow && (
              <div className="bg-black/30 text-gray-400 w-full rounded-md px-3 py-2">
                <ul className="flex flex-col gap-2 capitalize">
                  {["popular", "top_rated", "on_the_air", "airing_today"].map(
                    (item) => (
                      <li key={item} onClick={() => handleClick(item, "tv")}>
                        {item.replaceAll("_", " ")}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>

          <Link
            to={"/fav"}
            className="border rounded-md p-2 bg-black/70 pl-3 text-gray-100 border-gray-500 transition-all"
          >
            Favorites
          </Link>
          {user && (
            <button
              onClick={() => logOut()}
              className="border rounded-md p-2 border-gray-500 bg-blue-600 transition-all"
            >
              Log-Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Menu, X } from "lucide-react";

// export default function Navbar({ setCategories, setType }) {
//   const { user, logOut } = useAuth();
//   const navigate = useNavigate();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [movieOpen, setMovieOpen] = useState(false);
//   const [tvOpen, setTvOpen] = useState(false);

//   const handleNavigation = (category, type) => {
//     setCategories(category);
//     setType(type);
//     navigate("/");
//     setMenuOpen(false);
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-gray-800">
//       <div className=" mx-auto flex items-center justify-between px-4 py-3">
//         {/* LOGO */}
//         <Link to="/" className="text-xl md:text-2xl font-bold text-white">
//           🎬 <span className="text-sky-500">MovieApp</span>
//         </Link>

//         {/* DESKTOP MENU */}
//         <div className="hidden md:flex items-center gap-8">
//           {/* MOVIES */}
//           <div className="relative group">
//             <button className="text-gray-200 hover:text-sky-500 transition">
//               Movies ▾
//             </button>

//             <div className="absolute z-50 left-0 mt-3 w-48 bg-gray-900 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
//               <ul className="p-2 space-y-1">
//                 {["popular", "top_rated", "upcoming", "now_playing"].map(
//                   (item) => (
//                     <li
//                       key={item}
//                       onClick={() => handleNavigation(item, "movie")}
//                       className="px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer capitalize"
//                     >
//                       {item.replace("_", " ")}
//                     </li>
//                   ),
//                 )}
//               </ul>
//             </div>
//           </div>

//           {/* TV SHOWS */}
//           <div className="relative group">
//             <button className="text-gray-200 hover:text-sky-500 transition">
//               TV Shows ▾
//             </button>

//             <div className="absolute left-0 mt-3 w-48 bg-gray-900 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
//               <ul className="p-2 space-y-1">
//                 {["popular", "top_rated", "on_the_air", "airing_today"].map(
//                   (item) => (
//                     <li
//                       key={item}
//                       onClick={() => handleNavigation(item, "tv")}
//                       className="px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer capitalize"
//                     >
//                       {item.replace("_", " ")}
//                     </li>
//                   ),
//                 )}
//               </ul>
//             </div>
//           </div>

//           {/* FAVORITE */}
//           <Link
//             to="/fav"
//             className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
//           >
//             Favorite
//           </Link>

//           {/* LOGOUT */}
//           {user && (
//             <button
//               onClick={logOut}
//               className="px-4 py-2 bg-sky-600 rounded-lg hover:bg-sky-700 transition"
//             >
//               Log Out
//             </button>
//           )}
//         </div>

//         {/* MOBILE BUTTON */}
//         <button
//           onClick={() => setMenuOpen(!menuOpen)}
//           className="md:hidden text-white"
//         >
//           {menuOpen ? <X size={26} /> : <Menu size={26} />}
//         </button>
//       </div>

//       {/* MOBILE MENU */}
//       {menuOpen && (
//         <div className="md:hidden bg-black/95 px-6 pb-6 space-y-4 transition-all">
//           {/* Movies */}
//           <div>
//             <button
//               onClick={() => setMovieOpen(!movieOpen)}
//               className="w-full text-left py-2 text-gray-200"
//             >
//               Movies ▾
//             </button>

//             {movieOpen && (
//               <ul className="pl-4 space-y-2 text-gray-400">
//                 {["popular", "top_rated", "upcoming", "now_playing"].map(
//                   (item) => (
//                     <li
//                       key={item}
//                       onClick={() => handleNavigation(item, "movie")}
//                       className="cursor-pointer capitalize"
//                     >
//                       {item.replace("_", " ")}
//                     </li>
//                   ),
//                 )}
//               </ul>
//             )}
//           </div>

//           {/* TV */}
//           <div>
//             <button
//               onClick={() => setTvOpen(!tvOpen)}
//               className="w-full text-left py-2 text-gray-200"
//             >
//               TV Shows ▾
//             </button>

//             {tvOpen && (
//               <ul className="pl-4 space-y-2 text-gray-400">
//                 {["popular", "top_rated", "on_the_air", "airing_today"].map(
//                   (item) => (
//                     <li
//                       key={item}
//                       onClick={() => handleNavigation(item, "tv")}
//                       className="cursor-pointer capitalize"
//                     >
//                       {item.replace("_", " ")}
//                     </li>
//                   ),
//                 )}
//               </ul>
//             )}
//           </div>

//           {/* Favorite */}
//           <Link
//             to="/fav"
//             onClick={() => setMenuOpen(false)}
//             className="block py-2 text-gray-200"
//           >
//             Favorite
//           </Link>

//           {/* Logout */}
//           {user && (
//             <button
//               onClick={() => {
//                 logOut();
//                 setMenuOpen(false);
//               }}
//               className="w-full py-2 bg-sky-600 rounded-lg"
//             >
//               Log Out
//             </button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// }
