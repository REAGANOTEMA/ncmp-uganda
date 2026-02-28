// pages/projectsPage.tsx
import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit } from "lucide-react";
import { UGANDAN_CONSTITUENCIES } from "@/data/ugandaData";

// Firebase
import { db } from "@/firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

const statusColors: Record<string, string> = {
  Active: "badge-progress",
  Completed: "badge-resolved",
  Planned: "badge-new",
  "On Hold": "bg-gray-100 text-gray-700 border border-gray-200",
};

const categoryColors: Record<string, string> = {
  Infrastructure: "bg-blue-100 text-blue-800",
  Education: "bg-green-100 text-green-800",
  Health: "bg-red-100 text-red-800",
  "Water & Sanitation": "bg-cyan-100 text-cyan-800",
  Youth: "bg-purple-100 text-purple-800",
  Economic: "bg-amber-100 text-amber-800",
};

function formatUGX(v: number) {
  if (v >= 1000000000) return `UGX ${(v / 1000000000).toFixed(1)}B`;
  if (v >= 1000000) return `UGX ${(v / 1000000).toFixed(0)}M`;
  return `UGX ${v.toLocaleString()}`;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState<"table" | "cards">("cards");
  const [showModal, setShowModal] = useState(false);

  const [newProject, setNewProject] = useState({
    name: "",
    category: "Infrastructure",
    constituency: UGANDAN_CONSTITUENCIES[0]?.name || "",
    budget: 0,
    end: "",
    description: "",
  });

  // Fetch projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(fetched);
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.constituency.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Create project
  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.constituency || newProject.budget <= 0) return;

    await addDoc(collection(db, "projects"), {
      ...newProject,
      spent: 0,
      progress: 0,
      status: "Planned",
      start: Timestamp.now(),
      end: Timestamp.fromDate(new Date(newProject.end)),
    });

    // Refresh projects
    const querySnapshot = await getDocs(collection(db, "projects"));
    const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(fetched);

    setShowModal(false);
    setNewProject({
      name: "",
      category: "Infrastructure",
      constituency: UGANDAN_CONSTITUENCIES[0]?.name || "",
      budget: 0,
      end: "",
      description: "",
    });
  };

  // Calculate stats
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const activeCount = projects.filter(p => p.status === "Active").length;
  const completedCount = projects.filter(p => p.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Constituency Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Track and manage all constituency development projects</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Projects", value: projects.length, color: "text-foreground" },
          { label: "Active", value: activeCount, color: "text-amber-600" },
          { label: "Completed", value: completedCount, color: "text-green-600" },
          { label: "Total Budget", value: formatUGX(totalBudget), color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="gov-card p-4 text-center">
            <div className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="gov-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 h-9 w-full rounded-lg text-sm bg-muted border-0 focus:outline-none"
            placeholder="Search projects..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-sm bg-muted border-0 focus:outline-none"
        >
          {["All", "Active", "Completed", "Planned", "On Hold"].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex border rounded-lg overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
          <button
            onClick={() => setView("cards")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "cards" ? "text-primary-foreground" : "text-muted-foreground"}`}
            style={view === "cards" ? { background: "hsl(var(--primary))" } : {}}
          >
            Cards
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "table" ? "text-primary-foreground" : "text-muted-foreground"}`}
            style={view === "table" ? { background: "hsl(var(--primary))" } : {}}
          >
            Table
          </button>
        </div>
      </div>

      {/* Cards View */}
      {view === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="gov-card p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${categoryColors[p.category] || "bg-muted text-muted-foreground"}`}>{p.category}</span>
                  <h3 className="font-semibold text-foreground mt-2 leading-tight">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.constituency}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColors[p.status]}`}>{p.status}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">{p.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${p.progress}%`, background: p.progress === 100 ? "hsl(var(--success))" : "hsl(var(--primary))" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="gov-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full gov-table">
              <thead>
                <tr>
                  <th className="text-left">ID</th>
                  <th className="text-left">Project Name</th>
                  <th className="text-left">Constituency</th>
                  <th className="text-left">Category</th>
                  <th className="text-left">Budget</th>
                  <th className="text-left">Progress</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">End Date</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="font-mono text-xs text-primary font-semibold">{p.id}</td>
                    <td className="font-medium text-foreground">{p.name}</td>
                    <td className="text-muted-foreground text-xs">{p.constituency}</td>
                    <td><span className={`text-xs px-2 py-0.5 rounded-md font-medium ${categoryColors[p.category] || "bg-muted text-muted-foreground"}`}>{p.category}</span></td>
                    <td className="text-foreground text-xs">{formatUGX(p.budget)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: "hsl(var(--primary))" }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{p.progress}%</span>
                      </div>
                    </td>
                    <td><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status]}`}>{p.status}</span></td>
                    <td className="text-muted-foreground text-xs">{p.end}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Eye size={13} /></button>
                        <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Edit size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-gov-lg w-full max-w-xl p-6 animate-slide-up">
            <h3 className="font-display text-xl font-bold text-foreground mb-5">Create New Project</h3>
            <div className="space-y-4">
              <input
                placeholder="Project Name"
                value={newProject.name}
                onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none"
              />
              <select
                value={newProject.category}
                onChange={e => setNewProject({ ...newProject, category: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
              >
                {["Infrastructure", "Education", "Health", "Water & Sanitation", "Youth", "Economic"].map(c => <option key={c}>{c}</option>)}
              </select>
              <select
                value={newProject.constituency}
                onChange={e => setNewProject({ ...newProject, constituency: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
              >
                {UGANDAN_CONSTITUENCIES.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
              <input
                type="number"
                placeholder="Budget"
                value={newProject.budget}
                onChange={e => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
              />
              <input
                type="date"
                value={newProject.end}
                onChange={e => setNewProject({ ...newProject, end: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
              />
              <textarea
                placeholder="Description"
                value={newProject.description}
                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border text-sm">Cancel</button>
              <button onClick={handleCreateProject} className="flex-1 h-10 rounded-lg text-sm font-semibold" style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}