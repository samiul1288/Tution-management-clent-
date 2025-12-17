import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const axiosPublic = axios.create({
  baseURL,
  withCredentials: true,
});

export const axiosSecure = axios.create({
  baseURL,
  withCredentials: true,
});

axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosSecure.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // token invalid/expired
      localStorage.removeItem("access-token");
      localStorage.removeItem("user-role");
    }
    return Promise.reject(err);
  }
);
