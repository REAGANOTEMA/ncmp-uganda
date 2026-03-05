import { Link } from "react-router-dom";
import ncmpLogo from "@/assets/ncmp-logo.png";
import parliamentHero from "@/assets/hero.jpg";
import mpPlaceholder from "@/assets/mp-placeholder.png";
import { Shield, Users, FolderKanban, BarChart3, ClipboardList, Heart, Star, ChevronRight } from "lucide-react";

const FEATURES = [
  { icon: ClipboardList, title: "Citizen Request Management", desc: "Receive, track, and resolve citizen requests with full case history and priority management." },
  { icon: FolderKanban, title: "Project Tracking", desc: "Monitor constituency development projects, budgets, milestones, and progress in real-time." },
  { icon: Heart, title: "Beneficiary Programs", desc: "Manage scholarships, medical assistance, youth & women programs with approval workflows." },
  { icon: Users, title: "MP Profiles", desc: "Complete professional profiles for every MP including party, term, bio and contact info." },
  { icon: BarChart3, title: "Reports & Analytics", desc: "Comprehensive performance dashboards, PDF exports and constituency-wide insights." },
  { icon: Shield, title: "Role-Based Security", desc: "Enterprise-grade access control for Super Admin, MPs, Staff, Citizens and Auditors." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ncmpLogo} alt="NCMP" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-bold text-sm text-primary">NCMP Uganda</div>
              <div className="text-xs text-muted-foreground">National Constituency Management Platform</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#constituencies" className="hover:text-foreground transition-colors">Constituencies</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </div>
          <Link to="/login" className="px-5 py-2 rounded-lg text-sm font-semibold transition-all bg-primary text-primary-foreground hover:opacity-90">
            Sign In →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <img src={parliamentHero} alt="Uganda Parliament" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <img src={ncmpLogo} alt="NCMP" className="w-12 h-12 rounded-full object-cover border-2 border-secondary/50" />
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-secondary">Republic of Uganda</div>
                <div className="text-xs text-primary-foreground/60">Official Government Platform</div>
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              National Constituency<br />
              <span className="text-secondary">Management Platform</span>
            </h1>
            <p className="text-primary-foreground/70 text-xl leading-relaxed mb-10 max-w-2xl">
              Empowering Uganda's 529 Members of Parliament to deliver transparent, accountable, and efficient service to 46 million citizens across 290+ constituencies in 2026.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 bg-secondary text-secondary-foreground">
                Access Platform →
              </Link>
              <a href="#features" className="px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all border-primary-foreground/30 text-primary-foreground hover:opacity-90">
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 border-t bg-primary-light" style={{ borderColor: "hsl(var(--primary-light))" }}>
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Constituencies", value: "290+" },
              { label: "Active MPs", value: "529" },
              { label: "Citizens Served", value: "46M+" },
              { label: "Districts", value: "146" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold font-display text-secondary">{s.value}</div>
                <div className="text-xs text-primary-foreground/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 bg-primary/10 text-primary">
            <Star size={12} /> Enterprise Government Platform
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Constituency Management</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Everything an MP and their office needs to serve constituents efficiently and transparently in 2026.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="gov-card p-6 group hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 rounded-xl w-fit mb-4 bg-primary/10 transition-colors">
                <f.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MP Profiles */}
      <section id="constituencies" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Professional MP Profiles</h2>
            <p className="text-muted-foreground">Complete profiles for every Member of Parliament in Uganda in 2026</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Hon. Muhammad Nsereko", constituency: "Kampala Central", party: "NRM", region: "Central" },
              { name: "Hon. Betty Nambooze", constituency: "Mukono Municipal", party: "NUP", region: "Central" },
              { name: "Hon. Norbert Mao", constituency: "Omoro", party: "DP", region: "Northern" },
            ].map(mp => (
              <div key={mp.name} className="gov-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-20 bg-primary" />
                <div className="px-5 pb-5 -mt-8">
                  <img src={mpPlaceholder} alt={mp.name} className="w-16 h-16 rounded-xl object-cover border-2 mb-3 border-secondary" />
                  <h3 className="font-semibold text-foreground">{mp.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{mp.constituency} Constituency</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{mp.party}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{mp.region}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Ready to Transform Constituency Management?</h2>
          <p className="text-muted-foreground mb-8">Join Uganda's national digital governance platform and deliver better services to your constituents in 2026.</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 bg-primary text-primary-foreground">
            Get Started <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t bg-primary text-primary-foreground">
        {/* Ugandan Flag Line */}
        <div className="absolute -top-2 left-0 w-full h-2 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-black" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & About */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={ncmpLogo} alt="NCMP" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-bold text-lg text-secondary">NCMP Uganda</div>
                <div className="text-xs text-primary-foreground/50">National Constituency Management Platform</div>
              </div>
            </div>
            <p className="text-xs text-primary-foreground/60">
              Empowering Members of Parliament to serve 46M+ citizens transparently and efficiently across 290+ constituencies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm text-foreground mb-2">Quick Links</h3>
            <ul className="flex flex-col gap-1 text-xs text-primary-foreground/60">
              <li><a href="#features" className="hover:text-secondary transition-colors">Features</a></li>
              <li><a href="#constituencies" className="hover:text-secondary transition-colors">Constituencies</a></li>
              <li><a href="#about" className="hover:text-secondary transition-colors">About NCMP</a></li>
              <li><a href="/reports" className="hover:text-secondary transition-colors">Reports & Analytics</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm text-foreground mb-2">Official & Contact</h3>
            <ul className="flex flex-col gap-1 text-xs text-primary-foreground/60">
              <li><a href="https://www.parliament.go.ug" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">Parliament of Uganda</a></li>
              <li><a href="https://www.gou.go.ug" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">Government of Uganda</a></li>
              <li><a href="mailto:reaganotemas@gmail.com" className="hover:text-secondary transition-colors">reaganotemas@gmail.com</a></li>
              <li><a href="tel:+256772514889" className="hover:text-secondary transition-colors">+256 772 514 889</a></li>
            </ul>
          </div>

          {/* Bottom copyright */}
          <div className="col-span-full mt-10 border-t pt-4 border-primary-light/30 text-center text-xs text-primary-foreground/50">
            <p>© 2026 Republic of Uganda. All rights reserved.</p>
            <p className="mt-1 text-xs">
              Designed & Built by <strong className="text-secondary"><a href="mailto:reaganotemas@gmail.com" className="hover:underline">Reagan Otema</a></strong> — Enterprise Government Solutions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}