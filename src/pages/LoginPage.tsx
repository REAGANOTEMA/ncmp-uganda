import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ncmpLogo from "@/assets/ncmp-logo.png";
import parliamentHero from "@/assets/parliament-hero.png";
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const { login } = useAuth(); // Optional: auto-login after registration
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState(""); // email or NIN
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"official" | "citizen">("citizen");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Regex for Uganda NIN: 2 letters, 10 digits, 2 letters
  const NIN_REGEX = /^[A-Z]{2}\d{10}[A-Z]{2}$/;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // NIN validation for citizens
    if (role === "citizen" && !NIN_REGEX.test(identifier)) {
      setError("Invalid NIN format. Example: CM9801910356YD");
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        full_name: fullName,
        password,
        role,
      };

      if (role === "citizen") payload.nin = identifier;
      else payload.email = identifier;

      // Call backend registration API
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed.");

      // Optional: Auto-login after registration
      await login(identifier, password, role);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Hero */}
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

      {/* Right - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 bg-background">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Secure Government Portal
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Register Your Account</h2>
          <p className="text-muted-foreground text-sm mb-8">Create a new account to access your workspace.</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-6">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-60"
              style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Already have an account?{" "}
            <a href="/login" className="font-semibold hover:underline" style={{ color: "hsl(var(--primary))" }}>
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}