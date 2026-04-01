import axios from "axios";
import { TokenManager, HostTokenManager } from "../services/jwtAuthService";

// Resolve base URL — dev falls back to localhost, prod uses Render
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Determine route context
const isHostRoute = () => {
  const path = window.location.pathname.toLowerCase();
  return path.includes("/host") || path.includes("/host-");
};

// ── Request interceptor ───────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = isHostRoute()
      ? HostTokenManager.getAccessToken()
      : TokenManager.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network failure (no response at all)
    if (!error.response) {
      error.isNetworkError = true;
      error.userMessage =
        "Unable to connect to the server. Please check your internet connection.";
      return Promise.reject(error);
    }

    // Token expired — attempt silent refresh once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (error.response?.data?.message?.includes("expired") ||
        error.response?.data?.message?.includes("Invalid token"))
    ) {
      originalRequest._retry = true;

      try {
        const manager = isHostRoute() ? HostTokenManager : TokenManager;
        const refreshToken = manager.getRefreshToken();

        if (!refreshToken) throw new Error("No refresh token");

        const res = await fetch(`${baseURL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.accessToken) {
            manager.setTokens(data.accessToken, data.refreshToken || refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return axiosInstance(originalRequest);
          }
        }

        throw new Error("Refresh failed");
      } catch {
        if (isHostRoute()) {
          HostTokenManager.clearTokens();
          window.location.href = "/host-login";
        } else {
          TokenManager.clearTokens();
          window.location.href = "/signin";
        }
        return Promise.reject(error);
      }
    }

    // Attach user-friendly messages for common status codes
    if (error.response?.status === 403) {
      error.userMessage = "You don't have permission to perform this action.";
    } else if (error.response?.status === 404) {
      error.userMessage = "The requested resource was not found.";
    } else if (error.response?.status === 429) {
      error.userMessage = "Too many requests. Please wait a moment and try again.";
    } else if (error.response?.status >= 500) {
      error.userMessage = "The server encountered an error. Please try again later.";
    } else {
      error.userMessage =
        error.response?.data?.message || error.message || "Something went wrong.";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
