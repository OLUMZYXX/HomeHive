import axios from "axios";
import { TokenManager, HostTokenManager } from "../services/jwtAuthService";

// Create axios instance with base configuration
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds timeout - increased from 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to determine if current route is for host
const isHostRoute = () => {
  const path = window.location.pathname.toLowerCase();
  return path.includes("/host") || path.includes("/host-");
};

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Use HostTokenManager for host routes, TokenManager for user routes
    const token = isHostRoute()
      ? HostTokenManager.getAccessToken()
      : TokenManager.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to expired token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (error.response?.data?.message?.includes("expired") ||
        error.response?.data?.message?.includes("Invalid token"))
    ) {
      originalRequest._retry = true;

      try {
        // Use appropriate token manager based on route
        const manager = isHostRoute() ? HostTokenManager : TokenManager;
        const refreshToken = manager.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Try to refresh the token
        const response = await fetch(`${baseURL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.accessToken) {
            manager.setTokens(
              data.accessToken,
              data.refreshToken || refreshToken,
            );

            // Update the authorization header with new token
            const newToken = manager.getAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Retry the original request
            return axiosInstance(originalRequest);
          }
        }

        throw new Error("Token refresh failed");
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        if (isHostRoute()) {
          HostTokenManager.clearTokens();
          window.location.href = "/host-login";
        } else {
          TokenManager.clearTokens();
          window.location.href = "/signin";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
