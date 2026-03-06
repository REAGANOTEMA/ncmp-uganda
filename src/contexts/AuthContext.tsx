import { createContext, useContext, useState, ReactNode } from "react";
import API from "@/services/api";

/*
================================
User Type
================================
*/
interface User {
  id: string;
  full_name: string;
  email?: string;
  nin?: string;
  role: string;
}

/*
================================
Context Type
================================
*/
interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string, role: "official" | "citizen") => Promise<void>;
  logout: () => void;
  register: (data: { full_name: string; email?: string; password: string; role: string; nin?: string }) => Promise<void>;
}

/*
================================
Create Context
================================
*/
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/*
================================
Safe LocalStorage Reader
================================
*/
const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return null;
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    localStorage.removeItem("user");
    return null;
  }
};

/*
================================
Auth Provider
================================
*/
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());

  /*
  ================================
  LOGIN
  ================================
  */
  const login = async (identifier: string, password: string, role: "official" | "citizen") => {
    try {
      const payload: any = { password };
      if (role === "citizen") payload.nin = identifier;
      else payload.email = identifier;

      const res = await API.post("/auth/login", payload);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  /*
  ================================
  REGISTER
  ================================
  */
  const register = async (data: { full_name: string; email?: string; password: string; role: string; nin?: string }) => {
    try {
      const res = await API.post("/auth/register", data);

      const newUser = res.data.user;
      const token = `demo-token-${Date.now()}`; // temporary token for demo

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw new Error(error?.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  /*
  ================================
  LOGOUT
  ================================
  */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

/*
================================
Custom Hook
================================
*/
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};