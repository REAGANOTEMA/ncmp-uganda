import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, send to landing/login page
    return <Navigate to="/landing-login" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case "super_admin":
    case "speaker":
    case "mp":
    case "staff":
    case "data_entry":
    case "citizen":
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
}