import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ncmpLogo from "@/assets/ncmp-logo.png";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth(); // make sure AuthContext supports register()
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState(""); // email or NIN
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"citizen" | "official">("citizen");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // NIN validation for citizens
    if (role === "citizen") {
      const ninPattern = /^[A-Z]{2}\d{7}[A-Z]{2}\d{0,2}$/i;
      if (!ninPattern.test(identifier)) {
        setError("Invalid NIN format.");
        return;
      }
    }

    setLoading(true);
    try {
      await register({
        full_name: fullName,
        password,
        role: role === "citizen" ? "citizen" : "staff",
        email: role === "official" ? identifier : undefined,
        nin: role === "citizen" ? identifier : undefined,
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-6">
        <div className="flex justify-center mb-6">
          <img src={ncmpLogo} alt="NCMP" className="w-16 h-16 rounded-full" />
        </div>
        <h2 className="text-2xl font-bold text-center text-foreground">Create Your Account</h2>
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full h-11 px-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {role === "citizen" ? "National ID (NIN)" : "Official Email"}
            </label>
            <input
              type={role === "citizen" ? "text" : "email"}
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder={role === "citizen" ? "e.g. CM9801910356YD" : "name@parliament.go.ug"}
              required
              className="w-full h-11 px-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 pr-11 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-11 px-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Role selector */}
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" checked={role === "official"} onChange={() => setRole("official")} className="accent-primary" />
              Official / Staff
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" checked={role === "citizen"} onChange={() => setRole("citizen")} className="accent-primary" />
              Citizen
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-60 bg-primary text-primary-foreground"
          >
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}