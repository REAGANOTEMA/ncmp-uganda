import axios, { AxiosRequestConfig } from "axios";

// ✅ Live Backend URL
const API = axios.create({
  baseURL: "https://ncmp-backend.onrender.com/api", // your live backend API
});

// Attach JWT to every request
API.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// Types
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
  API.post<ITokenResponse>("/auth/register", data);

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

export default API;