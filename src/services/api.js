// src/services/api.ts
import axios from "axios";

// Base URL points to your Render backend
const API = axios.create({
  baseURL: "https://ncmp-uganda.onrender.com/api",
});

// Add JWT token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

/*
========================
AUTH
========================
*/
export const registerUser = (data: any) => API.post("/auth/register", data);
export const loginUser = (data: any) => API.post("/auth/login", data);

/*
========================
MP
========================
*/
export const getMPs = () => API.get("/mps");
export const createMP = (data: any) => API.post("/mps", data);

/*
========================
STAFF
========================
*/
export const getStaff = () => API.get("/staff");
export const createStaff = (data: any) => API.post("/staff", data);

/*
========================
BENEFICIARIES
========================
*/
export const getBeneficiaries = () => API.get("/beneficiaries");
export const createBeneficiary = (data: any) => API.post("/beneficiaries", data);

/*
========================
PROJECTS
========================
*/
export const getProjects = () => API.get("/projects");
export const createProject = (data: any) => API.post("/projects", data);

/*
========================
REQUESTS
========================
*/
export const getRequests = () => API.get("/requests");
export const createRequest = (data: any) => API.post("/requests", data);

/*
========================
REPORTS
========================
*/
export const getReports = () => API.get("/reports");
export const createReport = (data: any) => API.post("/reports", data);

/*
========================
COMMUNICATIONS / ANNOUNCEMENTS
========================
*/
export const getAnnouncements = () => API.get("/communications");
export const createAnnouncement = (data: any) => API.post("/communications", data);

export default API;