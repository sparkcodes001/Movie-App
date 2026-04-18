import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/Home";
import MovieDetailPage from "./pages/MovieDetails";
import FavoritePage from "./pages/Favorites";
import Navbar from "./components/NavBar";
import { AuthPage } from "./pages/Auth";
import { useState } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();
  const [categories, setCategories] = useState("popular");
  const [type, setType] = useState("movie");

  return (
    <div>
      {location.pathname !== "/auth" && (
        <Navbar setCategories={setCategories} setType={setType} />
      )}
      <Routes className="pt-11">
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage categories={categories} type={type} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:type/:id"
          element={
            <ProtectedRoute>
              <MovieDetailPage type={type} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fav"
          element={
            <ProtectedRoute>
              <FavoritePage type={type} />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div>
                not fonud
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
