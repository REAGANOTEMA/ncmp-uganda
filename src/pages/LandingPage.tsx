// src/pages/AuthFlow.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import API from "@/services/api";
import ncmpLogo from "@/assets/ncmp-logo.png";
import parliamentHero from "@/assets/parliament-hero.png";
import { Eye, EyeOff, AlertCircle, Shield } from "lucide-react";

const DEMO_CREDS = [
  { label: "Super Admin / President", email: "admin@ncmp.go.ug", role: "super_admin" },
  { label: "Member of Parliament", email: "mp@ncmp.go.ug", role: "mp" },
  { label: "Office Staff", email: "staff@ncmp.go.ug", role: "staff" },
  { label: "Citizen", email: "citizen@ncmp.go.ug", role: "citizen" },
];

export default function AuthFlow() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState(""); // email or NIN
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"official" | "citizen">("citizen");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Uganda NIN format: e.g., CM9801910356YD
  const NIN_REGEX = /^[A-Z]{2}\d{10}[A-Z]{2}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        // LOGIN
        await login(identifier, password, role);
      } else {
        // REGISTER
        if (role === "citizen" && !NIN_REGEX.test(identifier)) {
          setError("Invalid NIN format. Example: CM9801910356YD");
          setLoading(false);
          return;
        }

        const payload: any = { full_name: fullName, password, role };
        if (role === "citizen") payload.nin = identifier;
        else payload.email = identifier;

        // Axios handles JSON automatically
        const res = await API.post("/auth/register", payload);

        if (!res.data.user) throw new Error(res.data.message || "Registration failed");

        // Auto-login after registration
        await login(identifier, password, role);
      }

      // Redirect based on role
      const roleRedirects: Record<string, string> = {
        super_admin: "/dashboard",
        speaker: "/dashboard",
        mp: "/dashboard",
        staff: "/dashboard",
        data_entry: "/dashboard",
        citizen: "/dashboard",
      };

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      navigate(roleRedirects[user.role] || "/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string) => {
    setError("");
    setLoading(true);
    try {
      await login(demoEmail, "demo1234");
      navigate("/dashboard");
    } catch {
      setError("Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12" style={{ background: "hsl(var(--primary))" }}>
        <img src={parliamentHero} alt="Uganda Parliament" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <img src={ncmpLogo} alt="NCMP" className="w-14 h-14 rounded-full object-cover border-2 border-secondary/50" />
            <div>
              <div className="font-bold text-lg text-secondary">NCMP</div>
              <div className="text-xs text-primary-foreground/70">Republic of Uganda</div>
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold text-primary-foreground leading-tight mb-4">
            National Constituency<br />Management Platform
          </h1>
          <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-md">
            Empowering Members of Parliament and constituency offices to deliver transparent, efficient, and accountable service to citizens of Uganda.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 bg-background">
        <div className="max-w-md w-full mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            {mode === "login" ? "Sign in to NCMP" : "Register Your Account"}
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            {mode === "login"
              ? "Enter your credentials to access your workspace."
              : "Create a new account to access your workspace."}
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-6">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full h-11 px-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}

            {/* Role selector */}
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" checked={role === "official"} onChange={() => setRole("official")} className="accent-primary" />
                Official / Staff
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" checked={role === "citizen"} onChange={() => setRole("citizen")} className="accent-primary" />
                Citizen (NIN)
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                {role === "citizen" ? "National ID (NIN)" : "Official Email Address"}
              </label>
              <input
                type={role === "citizen" ? "text" : "email"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === "citizen" ? "e.g. CM9801910356YD" : "name@parliament.go.ug"}
                required
                className="w-full h-11 px-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-4 pr-11 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-60"
              style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
            >
              {loading ? (mode === "login" ? "Authenticating..." : "Registering...") : (mode === "login" ? "Sign In Securely" : "Create Account")}
            </button>
          </form>

          <p
            className="text-center text-xs text-muted-foreground mt-6 cursor-pointer hover:underline"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login"
              ? "Don't have an account? Register here"
              : "Already have an account? Sign In"}
          </p>

          {/* Demo login */}
          {mode === "login" && (
            <div className="mt-8 grid grid-cols-2 gap-2">
              {DEMO_CREDS.map((d) => (
                <button
                  key={d.email}
                  onClick={() => quickLogin(d.email)}
                  className="text-left px-3 py-2.5 rounded-lg border text-xs transition-all hover:border-primary/40 hover:bg-muted"
                >
                  <div className="font-semibold text-foreground">{d.label}</div>
                  <div className="text-muted-foreground mt-0.5">{d.email}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}