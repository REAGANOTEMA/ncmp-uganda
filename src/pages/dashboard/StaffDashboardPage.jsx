import StatsCard from "@/components/StatsCard";
import { ClipboardList, CheckCircle, Clock, Bell } from "lucide-react";

const TASKS = [
  { id: "REQ-001", name: "Grace Nakato", type: "Scholarship", status: "In Progress" },
  { id: "REQ-002", name: "Peter Ochieng", type: "Medical Assistance", status: "New" },
];

const STATUS_COLORS = {
  "New": "badge-new",
  "In Progress": "badge-progress",
  "Resolved": "badge-resolved",
};

export default function StaffDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">Staff Workspace</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="My Assigned Cases" value="47" subtitle="Active tasks" icon={ClipboardList} variant="primary" />
        <StatsCard title="Resolved Today" value="8" icon={CheckCircle} variant="success" />
        <StatsCard title="Pending Review" value="12" icon={Clock} variant="gold" />
        <StatsCard title="Notifications" value="5" icon={Bell} variant="danger" />
      </div>

      <div className="gov-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">My Task Queue</h3>
        </div>
        <div className="divide-y divide-border">
          {TASKS.map(task => (
            <div key={task.id} className="px-5 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{task.id} — {task.name}</p>
                <p className="text-xs text-muted-foreground">{task.type}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[task.status]}`}>{task.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}