import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/landing-login" replace />;

  const roleRedirects: Record<string, string> = {
    super_admin: "/dashboard",
    speaker: "/dashboard",
    mp: "/dashboard",
    staff: "/dashboard",
    data_entry: "/dashboard",
    citizen: "/dashboard",
  };

  const redirectPath = roleRedirects[user.role?.toLowerCase()] || "/dashboard";

  return <Navigate to={redirectPath} replace />;
}