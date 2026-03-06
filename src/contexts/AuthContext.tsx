import { createContext, useContext, useState, ReactNode } from "react";
import API from "@/services/api";

interface User {
  id: string;
  full_name: string;
  email?: string;
  nin?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string, role: "official" | "citizen") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = async (identifier: string, password: string, role: "official" | "citizen") => {
    const payload: any = { password };
    if (role === "citizen") payload.nin = identifier;
    else payload.email = identifier;

    const res = await API.post("/auth/login", payload);
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);