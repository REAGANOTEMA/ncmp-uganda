import { useState } from "react";
import StatsCard from "@/components/StatsCard";
import {
  MapPin, Users, ClipboardList, FolderKanban,
  BarChart2, Activity, CheckCircle, Clock, AlertCircle, Star
} from "lucide-react";
import { Link } from "react-router-dom";
import superAdminPic from "@/assets/super-admin.jpg"; // placeholder profile image

// Sample data
const RECENT_CONSTITUENCIES = [
  { name: "Kampala Central", mp: "Hon. Nsereko", region: "Central", req: 284, resolved: 250, score: 88 },
  { name: "Mukono Municipal", mp: "Hon. Nambooze", region: "Central", req: 198, resolved: 185, score: 93 },
  { name: "Gulu City East", mp: "Hon. Komakech", region: "Northern", req: 156, resolved: 140, score: 90 },
];

const NATIONAL_STATS = [
  { label: "Education & Scholarships", count: 3241, percent: 75 },
  { label: "Medical Assistance", count: 2180, percent: 50 },
  { label: "Infrastructure", count: 1820, percent: 42 },
  { label: "Youth Programs", count: 2900, percent: 67 },
  { label: "Women Empowerment", count: 1500, percent: 35 },
];

const SYSTEM_ACTIVITY = [
  { label: "New requests today", value: "284", icon: ClipboardList, color: "text-blue-600" },
  { label: "Resolved this week", value: "1,204", icon: CheckCircle, color: "text-green-600" },
  { label: "Pending review", value: "438", icon: Clock, color: "text-amber-600" },
  { label: "Escalated cases", value: "32", icon: AlertCircle, color: "text-red-600" },
];

const STATUS_COLORS = {
  "New": "badge-new",
  "In Progress": "badge-progress",
  "Resolved": "badge-resolved",
  "Assigned": "bg-purple-100 text-purple-800 border border-purple-200",
  "Active": "badge-progress",
  "Completed": "badge-resolved",
};

export default function SuperAdminDashboardPage() {
  const [profile, setProfile] = useState({
    name: "Hon. John K. Doe",
    role: "Super Administrator",
    email: "superadmin@gov.ug",
    phone: "+256 700 000000",
    picture: superAdminPic,
    termStart: "2022-01-01",
    termEnd: "2026-12-31",
  });

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Profile Banner */}
      <div className="bg-primary/10 rounded-xl p-6 flex flex-col md:flex-row items-center gap-5">
        <img src={profile.picture} alt="Profile" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-primary/50 object-cover" />
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profile.name}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{profile.role}</p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Term: {profile.termStart} to {profile.termEnd}</p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Email: {profile.email} | Phone: {profile.phone}</p>
          <div className="mt-2 flex gap-2">
            <button
              className="px-4 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm"
              onClick={() => alert("Open profile edit modal")}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Constituencies" value="290" subtitle="Across 10 regions" icon={MapPin} variant="primary" />
        <StatsCard title="Active MPs" value="529" subtitle="Current parliament" icon={Users} variant="gold" />
        <StatsCard title="Total Requests" value="12,847" subtitle="All constituencies" icon={ClipboardList} variant="success" />
        <StatsCard title="Active Projects" value="1,284" subtitle="Nationwide" icon={FolderKanban} variant="danger" />
      </div>

      {/* Charts and Activity */}
      <div className="lg:grid lg:grid-cols-3 gap-4">
        {/* National Request Stats */}
        <div className="lg:col-span-2 gov-card p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart2 size={16} className="text-primary" /> National Request Statistics
          </h3>
          {NATIONAL_STATS.map(r => (
            <div key={r.label} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground font-medium">{r.label}</span>
                <span className="text-muted-foreground">{r.count.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${r.percent}%`, background: "hsl(var(--primary))" }} />
              </div>
            </div>
          ))}
        </div>

        {/* System Activity */}
        <div className="gov-card p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity size={16} className="text-primary" /> System Activity
          </h3>
          {SYSTEM_ACTIVITY.map(a => (
            <div key={a.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2">
                <a.icon size={14} className={a.color} />
                <span className="text-sm text-muted-foreground">{a.label}</span>
              </div>
              <span className="text-sm font-bold text-foreground">{a.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Constituencies Table */}
      <div className="gov-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Top Performing Constituencies</h3>
          <Link to="/constituencies" className="text-xs font-semibold hover:underline text-primary">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full gov-table">
            <thead>
              <tr>
                <th>Constituency</th>
                <th>MP</th>
                <th>Region</th>
                <th>Requests</th>
                <th>Resolved</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_CONSTITUENCIES.map(c => (
                <tr key={c.name} className="hover:bg-muted/30 transition-colors">
                  <td className="font-medium text-foreground">{c.name}</td>
                  <td className="text-muted-foreground">{c.mp}</td>
                  <td><span className="px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground">{c.region}</span></td>
                  <td className="text-foreground">{c.req}</td>
                  <td className="text-green-600 font-medium">{c.resolved}</td>
                  <td><span className="px-2 py-0.5 rounded-md text-xs font-bold bg-green-100 text-green-800">{c.score}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}