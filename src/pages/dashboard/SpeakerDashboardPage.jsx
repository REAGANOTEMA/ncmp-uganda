import { useState } from "react";
import StatsCard from "@/components/StatsCard";
import {
  Users, ClipboardList, FolderKanban, MapPin,
  BarChart2, Activity, CheckCircle, Clock, AlertCircle, Star
} from "lucide-react";
import { Link } from "react-router-dom";
import speakerPic from "@/assets/speaker-placeholder.png";

// Sample Data
const RECENT_VOTES = [
  { bill: "Education Reform", status: "Passed", date: "2025-02-10" },
  { bill: "Healthcare Budget", status: "Pending", date: "2025-02-08" },
  { bill: "Infrastructure Fund", status: "Passed", date: "2025-02-05" },
];

const STATUS_COLORS = {
  Passed: "bg-green-100 text-green-800",
  Pending: "bg-amber-100 text-amber-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function SpeakerDashboardPage() {
  const [profile, setProfile] = useState({
    name: "Hon. Rebecca Akello",
    role: "Speaker of Parliament",
    email: "speaker@gov.ug",
    phone: "+256 700 123456",
    picture: speakerPic,
    termStart: "2021-05-01",
    termEnd: "2026-04-30",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Banner */}
      <div className="bg-primary/10 rounded-xl p-6 flex flex-col md:flex-row items-center gap-5">
        <img src={profile.picture} alt="Speaker" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-primary/50 object-cover" />
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profile.name}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{profile.role}</p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Term: {profile.termStart} to {profile.termEnd}</p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Email: {profile.email} | Phone: {profile.phone}</p>
          <button className="mt-2 px-4 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Bills Passed" value="48" subtitle="This session" icon={CheckCircle} variant="success" />
        <StatsCard title="Pending Bills" value="12" subtitle="Under discussion" icon={ClipboardList} variant="primary" />
        <StatsCard title="Members Oversight" value="529" subtitle="Total MPs" icon={Users} variant="gold" />
        <StatsCard title="Active Committees" value="34" subtitle="Parliamentary Committees" icon={FolderKanban} variant="danger" />
      </div>

      {/* Recent Votes Table */}
      <div className="gov-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Bill Decisions</h3>
          <Link to="/bills" className="text-xs font-semibold hover:underline text-primary">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full gov-table">
            <thead>
              <tr>
                <th>Bill</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_VOTES.map(bill => (
                <tr key={bill.bill} className="hover:bg-muted/30 transition-colors">
                  <td className="font-medium text-foreground">{bill.bill}</td>
                  <td><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[bill.status]}`}>{bill.status}</span></td>
                  <td className="text-muted-foreground">{bill.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}