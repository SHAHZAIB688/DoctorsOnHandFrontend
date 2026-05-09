import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://perscriptobackend-production.up.railway.app/api";

const backendBaseUrl = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("backend-status", { detail: { online: true } }));
    }
    return response;
  },
  (error) => {
    const isNetworkError = !error?.response;
    if (isNetworkError && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("backend-status", { detail: { online: false } }));
    }
    return Promise.reject(error);
  }
);

export const buildBackendAssetUrl = (path = "") => {
  if (!path) return backendBaseUrl;
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${backendBaseUrl}${normalizedPath}`;
};

export default client;
