import { useState } from "react";
import StatsCard from "@/components/StatsCard";
import { ClipboardList, FolderKanban, CheckCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import mpPic from "@/assets/mp-placeholder.png";

const RECENT_REQUESTS = [
  { id: "REQ-001", name: "Grace Nakato", type: "Scholarship", status: "In Progress", date: "2025-01-15" },
  { id: "REQ-002", name: "Peter Ochieng", type: "Medical Assistance", status: "New", date: "2025-01-14" },
];

const STATUS_COLORS = {
  "New": "badge-new",
  "In Progress": "badge-progress",
  "Resolved": "badge-resolved",
};

export default function MPDashboardPage() {
  const [profile, setProfile] = useState({
    name: "Hon. Jane Atim",
    constituency: "Mukono North",
    party: "National Unity",
    picture: mpPic,
    termStart: "2021-05-01",
    termEnd: "2026-04-30",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Banner */}
      <div className="bg-primary/10 rounded-xl p-6 flex flex-col md:flex-row items-center gap-5">
        <img src={profile.picture} alt="MP" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-primary/50 object-cover" />
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profile.name}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{profile.constituency} • {profile.party}</p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Term: {profile.termStart} to {profile.termEnd}</p>
          <button className="mt-2 px-4 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Requests" value="1,284" subtitle="This term" icon={ClipboardList} variant="primary" />
        <StatsCard title="Resolved Cases" value="1,089" subtitle="85% resolution" icon={CheckCircle} variant="success" />
        <StatsCard title="Active Projects" value="24" subtitle="8 completed" icon={FolderKanban} variant="gold" />
        <StatsCard title="Beneficiaries" value="3,420" subtitle="Programs served" icon={Heart} variant="danger" />
      </div>

      {/* Recent Requests */}
      <div className="gov-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Citizen Requests</h3>
          <Link to="/requests" className="text-xs font-semibold hover:underline text-primary">View All</Link>
        </div>
        <div className="divide-y divide-border">
          {RECENT_REQUESTS.map(r => (
            <div key={r.id} className="px-5 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.type} • {r.date}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status]}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}