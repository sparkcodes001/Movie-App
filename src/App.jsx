import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/Home";
import MovieDetailPage from "./pages/MovieDetails";
import FavoritePage from "./pages/Favorites";
import Navbar from "./components/NavBar";
import { LandingPage } from "./pages/LandingPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <div className="bg-zinc-950 min-h-screen">
      {showNavbar && <Navbar />}

      <main className={showNavbar ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/:type/:id"
            element={
              <ProtectedRoute>
                <MovieDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fav"
            element={
              <ProtectedRoute>
                <FavoritePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="h-screen flex items-center justify-center text-white font-mono uppercase tracking-widest">
                404 // Protocol_Not_Found
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
