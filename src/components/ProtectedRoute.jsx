import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check if they bypassed the landing page "Breach"
  const hasVaultAccess = localStorage.getItem("vault_access") === "granted";

  if (loading) return null; // Or a loading spinner

  // If no user (Supabase) AND no vault access (Local Flag), send to landing
  if (!user && !hasVaultAccess) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
}
