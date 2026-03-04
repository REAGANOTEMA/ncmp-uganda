import { useAuth } from "@/contexts/AuthContext";
import SuperAdminDashboard from "./dashboard/SuperAdminDashboardPage";
import SpeakerDashboard from "./dashboard/SpeakerDashboardPage";
import MPDashboard from "./dashboard/MPDashboardPage";
import StaffDashboard from "./dashboard/StaffDashboardPage";
import CitizenDashboard from "./dashboard/CitizenDashboardPage";

/**
 * DashboardPage
 * Renders the appropriate dashboard based on the logged-in user's role.
 * Other pages in /pages (like Constituency, MPProfiles, Requests, etc.) remain unaffected.
 */
export default function DashboardPage() {
  const { user } = useAuth();

  // Show nothing if user is not yet loaded
  if (!user) return null;

  // Map roles to dashboard components
  const dashboardMap = {
    super_admin: SuperAdminDashboard,
    speaker: SpeakerDashboard,
    mp: MPDashboard,
    staff: StaffDashboard,
    data_entry: StaffDashboard,
    citizen: CitizenDashboard,
  };

  // Select the dashboard component based on user.role
  const DashboardComponent = dashboardMap[user.role] || SuperAdminDashboard;

  return <DashboardComponent />;
}