import { useAuth } from "@/contexts/AuthContext";
import SuperAdminDashboard from "./dashboard/superadmindashboardpage";
import SpeakerDashboard from "./dashboard/SpeakerDashboardPage";
import MPDashboard from "./dashboard/MPDashboardPage";
import StaffDashboard from "./dashboard/StaffDashboardPage";
import CitizenDashboard from "./dashboard/CitizenDashboardPage";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return <p className="p-4 text-center">Loading dashboard...</p>;

  const dashboardMap = {
    super_admin: SuperAdminDashboard,
    speaker: SpeakerDashboard,
    mp: MPDashboard,
    staff: StaffDashboard,
    data_entry: StaffDashboard,
    citizen: CitizenDashboard,
  };

  const DashboardComponent = dashboardMap[user.role];

  if (!DashboardComponent)
    return <p className="p-4 text-center">No dashboard available for your role.</p>;

  return <DashboardComponent />;
}