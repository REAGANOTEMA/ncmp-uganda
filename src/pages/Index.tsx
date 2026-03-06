import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();

  // Not logged in → redirect to login/landing page
  if (!user) return <Navigate to="/landing-login" replace />;

  // Define a role-to-route mapping
  const roleRedirects: Record<string, string> = {
    super_admin: "/dashboard",
    speaker: "/dashboard",
    mp: "/dashboard",
    staff: "/dashboard",
    data_entry: "/dashboard",
    citizen: "/dashboard",
  };

  // Redirect based on role, fallback to /dashboard
  return <Navigate to={roleRedirects[user.role] || "/dashboard"} replace />;
}