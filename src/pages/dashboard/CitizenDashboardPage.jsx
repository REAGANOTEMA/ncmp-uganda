import StatsCard from "@/components/StatsCard";
import { ClipboardList, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const MY_REQUESTS = [
  { id: "REQ-001", type: "Scholarship", status: "In Progress", date: "2025-01-15" },
  { id: "REQ-002", type: "Medical Assistance", status: "Resolved", date: "2025-01-14" },
  { id: "REQ-003", type: "Business Support", status: "Pending", date: "2025-01-13" },
];

const STATUS_COLORS = {
  "New": "badge-new",
  "In Progress": "badge-progress",
  "Resolved": "badge-resolved",
  "Pending": "badge-progress",
};

export default function CitizenDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">My Constituency Portal</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="My Requests" value="3" subtitle="Submitted" icon={ClipboardList} variant="primary" />
        <StatsCard title="Resolved" value="1" subtitle="Successfully closed" icon={CheckCircle} variant="success" />
        <StatsCard title="Pending" value="1" subtitle="Awaiting response" icon={Clock} variant="gold" />
      </div>

      <div className="gov-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Submit a New Request</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Scholarship", "Medical Aid", "Infrastructure", "Youth Program"].map(t => (
            <Link key={t} to="/requests"
              className="p-3 rounded-lg border text-center text-sm font-medium hover:border-primary/40 hover:bg-muted transition-all">
              {t}
            </Link>
          ))}
        </div>
      </div>

      <div className="gov-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">My Requests</h3>
        </div>
        <div className="divide-y divide-border">
          {MY_REQUESTS.map(r => (
            <div key={r.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{r.id} — {r.type}</p>
                <p className="text-xs text-muted-foreground">Submitted {r.date}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status]}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}