import axios from "axios";

const API = axios.create({
  baseURL: "https://ncmp-uganda.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMPs = () => API.get("/mps");
export const getBeneficiaries = () => API.get("/beneficiaries");
export const createBeneficiary = (data) => API.post("/beneficiaries", data);
export const getProjects = () => API.get("/projects");
export const createProject = (data) => API.post("/projects", data);
export const getRequests = () => API.get("/requests");
export const createRequest = (data) => API.post("/requests", data);

export default API;