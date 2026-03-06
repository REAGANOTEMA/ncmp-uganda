// src/pages/Index.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();

  // Not logged in → redirect to landing/login page
  if (!user) return <Navigate to="/landing-login" replace />;

  // Map backend roles to frontend routes
  const roleRedirects: Record<string, string> = {
    super_admin: "/dashboard",
    speaker: "/dashboard",
    mp: "/dashboard",
    staff: "/dashboard",
    data_entry: "/dashboard",
    citizen: "/dashboard",
  };

  // Normalize role to lowercase (safety) and redirect
  const userRole = user.role?.toLowerCase() || "";
  const redirectPath = roleRedirects[userRole] || "/dashboard";

  return <Navigate to={redirectPath} replace />;
}