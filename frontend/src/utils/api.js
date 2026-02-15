import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "https://mern-book-store-e5nz.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
