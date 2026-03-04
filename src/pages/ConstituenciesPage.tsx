import { useState, useMemo } from "react";
import { Search, MapPin, Users, FolderKanban, ClipboardList, ChevronRight, Twitter, Facebook, Globe } from "lucide-react";
import { UGANDAN_CONSTITUENCIES, UGANDAN_REGIONS, UGANDAN_PARTIES } from "@/data/ugandaData";
import { Link } from "react-router-dom";
import type { MPProfile } from "@/types/MPProfile";

export default function ConstituenciesPage() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");
  const [selected, setSelected] = useState<typeof UGANDAN_CONSTITUENCIES[0] | null>(null);

  // Filter constituencies
  const filtered = useMemo(() => {
    return UGANDAN_CONSTITUENCIES.filter(c =>
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
       c.district.toLowerCase().includes(search.toLowerCase()) ||
       c.mp.toLowerCase().includes(search.toLowerCase())) &&
      (regionFilter === "All" || c.region === regionFilter)
    );
  }, [search, regionFilter]);

  // Region counts
  const regionCount = useMemo(() => {
    return UGANDAN_REGIONS.reduce((acc, r) => {
      acc[r] = UGANDAN_CONSTITUENCIES.filter(c => c.region === r).length;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  // Random stats helper
  const getRandomStat = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Constituencies Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">
            All {UGANDAN_CONSTITUENCIES.length}+ constituencies across Uganda
          </p>
        </div>
      </div>

      {/* Region overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {UGANDAN_REGIONS.map(r => (
          <button
            key={r}
            onClick={() => setRegionFilter(regionFilter === r ? "All" : r)}
            className={`gov-card p-4 text-center transition-all ${regionFilter === r ? "ring-2 ring-primary" : ""}`}
          >
            <div className="text-2xl font-bold font-display text-primary">{regionCount[r]}</div>
            <div className="text-xs text-muted-foreground mt-1">{r}</div>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="gov-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 h-9 w-full rounded-lg text-sm bg-muted border-0 focus:outline-none"
            placeholder="Search by name, district, or MP..."
          />
        </div>
        <select
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-sm bg-muted border-0 focus:outline-none"
        >
          <option value="All">All Regions</option>
          {UGANDAN_REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <span className="text-sm text-muted-foreground">{filtered.length} constituencies</span>
      </div>

      {/* Main grid */}
      <div className={`grid gap-4 ${selected ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}>
        {/* Constituencies Table */}
        <div className={selected ? "lg:col-span-2" : ""}>
          <div className="gov-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full gov-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Constituency</th>
                    <th>District</th>
                    <th>Region</th>
                    <th>MP</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr
                      key={c.id}
                      className={`hover:bg-muted/30 transition-colors cursor-pointer ${selected?.id === c.id ? "bg-primary/5" : ""}`}
                      onClick={() => setSelected(selected?.id === c.id ? null : c)}
                    >
                      <td className="text-muted-foreground text-xs">{c.id}</td>
                      <td className="flex items-center gap-2">
                        <MapPin size={12} className="text-primary flex-shrink-0" />
                        <span className="font-medium text-foreground">{c.name}</span>
                      </td>
                      <td className="text-muted-foreground text-xs">{c.district}</td>
                      <td>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{c.region}</span>
                      </td>
                      <td className="flex items-center gap-2 text-xs font-medium">
                        {c.mpPhoto && <img src={c.mpPhoto} alt={c.mp} className="w-6 h-6 rounded-full border" />}
                        {c.mp}
                        {c.party && <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded bg-primary/10 text-primary">{c.party}</span>}
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-xs ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <button className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors">
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="space-y-4">
            <div className="gov-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-foreground text-lg">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
              </div>

              {/* MP Photo + Party Badge */}
              <div className="flex items-center gap-3 mb-3">
                {selected.mpPhoto && <img src={selected.mpPhoto} alt={selected.mp} className="w-14 h-14 rounded-full border" />}
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{selected.mp}</span>
                  {selected.party && <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{selected.party}</span>}
                </div>
              </div>

              {/* Constituency Info */}
              <div className="space-y-2">
                {[
                  { label: "District", value: selected.district },
                  { label: "Region", value: selected.region },
                  { label: "Constituency ID", value: `CON-${String(selected.id).padStart(3, "0")}` },
                  { label: "Term", value: `${selected.termStart} → ${selected.termEnd}` },
                  { label: "Status", value: selected.status },
                ].map(i => (
                  <div key={i.label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{i.label}</span>
                    <span className="text-sm font-semibold text-foreground">{i.value}</span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-2 mt-3">
                {selected.twitter && <a href={`https://twitter.com/${selected.twitter.replace("@","")}`} target="_blank" className="p-2 rounded bg-blue-50 text-blue-600"><Twitter size={14} /></a>}
                {selected.facebook && <a href={selected.facebook} target="_blank" className="p-2 rounded bg-blue-50 text-blue-800"><Facebook size={14} /></a>}
                {selected.website && <a href={selected.website} target="_blank" className="p-2 rounded bg-green-50 text-green-700"><Globe size={14} /></a>}
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "Requests", value: getRandomStat(100, 500), icon: ClipboardList },
                  { label: "Projects", value: getRandomStat(5, 30), icon: FolderKanban },
                  { label: "Staff", value: getRandomStat(2, 8), icon: Users },
                ].map(s => (
                  <div key={s.label} className="rounded-lg p-3 text-center bg-muted flex flex-col items-center gap-1">
                    <s.icon size={18} className="text-primary" />
                    <div className="text-lg font-bold font-display text-primary">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <Link to="/requests" className="flex-1 text-center py-2 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 transition-colors">
                  View Requests
                </Link>
                <Link to="/mp-profiles" className="flex-1 text-center py-2 rounded-lg text-xs font-medium transition-all"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                  View MP
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}