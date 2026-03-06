// src/services/api.ts
import axios, { AxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "https://ncmp-uganda.onrender.com/api", // your backend URL
});

// Add JWT token to every request if available
API.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// TypeScript Types
// ===============================
export interface IUserRegister {
  full_name: string;
  email?: string;
  password: string;
  role?: "citizen" | "mp" | "staff" | "admin";
  nin?: string;
  phone?: string;
}

export interface IUserLogin {
  identifier: string; // email or NIN
  password: string;
  role: "official" | "citizen";
}

export interface IUserResponse {
  id: string;
  full_name: string;
  email?: string;
  role: string;
  nin?: string;
  phone?: string;
}

export interface ITokenResponse {
  token: string;
  user: IUserResponse;
}

// ===============================
// Auth API
// ===============================
export const registerUser = (data: IUserRegister) =>
  API.post<IUserResponse>("/auth/register", data);

export const loginUser = (data: IUserLogin) =>
  API.post<ITokenResponse>("/auth/login", data);

// ===============================
// MPs API
// ===============================
export const getMPs = () => API.get("/mps");

// ===============================
// Beneficiaries API
// ===============================
export const getBeneficiaries = () => API.get("/beneficiaries");
export const createBeneficiary = (data: any) =>
  API.post("/beneficiaries", data);

// ===============================
// Projects API
// ===============================
export const getProjects = () => API.get("/projects");
export const createProject = (data: any) => API.post("/projects", data);

// ===============================
// Requests API
// ===============================
export const getRequests = () => API.get("/requests");
export const createRequest = (data: any) => API.post("/requests", data);

// ===============================
// Default export
// ===============================
export default API;