import { createContext, useContext, useState, ReactNode } from "react";
import API, { IUserLogin, IUserRegister, IUserResponse, ITokenResponse } from "@/services/api";

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
  register: (data: IUserRegister) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());

  const login = async (identifier: string, password: string, role: "official" | "citizen") => {
    try {
      const payload: any = { password };
      if (role === "citizen") payload.nin = identifier;
      else payload.email = identifier;

      const res = await API.post<ITokenResponse>("/auth/login", payload);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const register = async (data: IUserRegister) => {
    try {
      const res = await API.post<ITokenResponse>("/auth/register", data);

      const { token, user: newUser } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw new Error(error?.response?.data?.message || "Registration failed. Please try again.");
    }
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};