import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Base URL resolution ───────────────────────────────────────────────────────
// Priority: EXPO_PUBLIC_API_URL env var → production Render URL
// To override locally, create a .env file in /mobile:
//   Android emulator : EXPO_PUBLIC_API_URL=http://10.0.2.2:3001/api
//   iOS simulator    : EXPO_PUBLIC_API_URL=http://localhost:3001/api
//   Physical device  : EXPO_PUBLIC_API_URL=http://<local-ip>:3001/api
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://homehive-twx2.onrender.com/api';

const TOKEN_KEY = '@homehive_access_token';
const REFRESH_TOKEN_KEY = '@homehive_refresh_token';
const USER_KEY = '@homehive_user';

// ─── Token store (AsyncStorage) ───────────────────────────────────────────────
export const TokenStore = {
  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },
  async setTokens(access: string, refresh: string): Promise<void> {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, access],
      [REFRESH_TOKEN_KEY, refresh],
    ]);
  },
  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
  },
  async getUser(): Promise<object | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  async setUser(user: object): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

// ─── Axios instance ───────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request — attach token
axiosInstance.interceptors.request.use(async (config) => {
  const token = await TokenStore.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response — silent token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // No network connection
    if (!error.response) {
      error.isNetworkError = true;
      error.userMessage = 'No connection. Please check your internet and try again.';
      return Promise.reject(error);
    }

    // Token expired — try refresh once
    if (
      error.response?.status === 401 &&
      !original._retry &&
      (error.response?.data?.message?.includes('expired') ||
        error.response?.data?.message?.includes('Invalid token'))
    ) {
      original._retry = true;
      try {
        const refreshToken = await TokenStore.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        if (res.data?.accessToken) {
          await TokenStore.setTokens(
            res.data.accessToken,
            res.data.refreshToken || refreshToken,
          );
          original.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return axiosInstance(original);
        }
        throw new Error('Refresh failed');
      } catch {
        await TokenStore.clearTokens();
        return Promise.reject(error);
      }
    }

    // Friendly message for other errors
    error.userMessage =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    return Promise.reject(error);
  },
);

// ─── API surface ──────────────────────────────────────────────────────────────

const api = {
  /** Check if server is reachable */
  health: {
    ping: () =>
      axiosInstance.get('/health', { timeout: 8000 }).then((r) => r.data),
  },

  auth: {
    login: (credentials: { email: string; password: string }) =>
      axiosInstance.post('/auth/login', credentials).then((r) => r.data),
    register: (data: { email: string; password: string; name?: string; firstName?: string; lastName?: string }) =>
      axiosInstance.post('/auth/register', data).then((r) => r.data),
    logout: () =>
      axiosInstance.post('/auth/logout').then((r) => r.data),
    getProfile: () =>
      axiosInstance.get('/auth/profile').then((r) => r.data),
    updateProfile: (data: object) =>
      axiosInstance.put('/auth/profile', data).then((r) => r.data),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      axiosInstance.put('/auth/change-password', data).then((r) => r.data),
  },

  properties: {
    getAll: (params?: object) =>
      axiosInstance.get('/properties', { params }).then((r) => {
        const d = r.data;
        return { properties: d.properties || d.data || [], total: d.total || 0 };
      }),
    getById: (id: string) =>
      axiosInstance.get(`/properties/${id}`).then((r) => r.data),
    getFeatured: (limit = 6) =>
      axiosInstance.get(`/properties/featured?limit=${limit}`).then((r) => r.data),
    getTopRated: (limit = 3) =>
      axiosInstance.get(`/properties/top-rated?limit=${limit}`).then((r) => r.data),
    search: (criteria: object) =>
      axiosInstance.post('/properties/search', criteria).then((r) => {
        const d = r.data;
        return d.properties || d.data || [];
      }),
    getPremiumImages: () =>
      axiosInstance.get('/premium/featured-images').then((r) => r.data).catch(() => ({ images: [] })),
  },

  bookings: {
    getMyBookings: () =>
      axiosInstance.get('/bookings').then((r) => r.data),
    getById: (id: string) =>
      axiosInstance.get(`/bookings/${id}`).then((r) => r.data),
    create: (data: object) =>
      axiosInstance.post('/bookings', data).then((r) => r.data),
    checkAvailability: (data: { propertyId: string; checkIn: string; checkOut: string }) =>
      axiosInstance.post('/bookings/check-availability', data).then((r) => r.data),
    cancel: (id: string) =>
      axiosInstance.put(`/bookings/${id}/status`, { status: 'cancelled' }).then((r) => r.data),
  },

  favorites: {
    get: () =>
      axiosInstance.get('/favorites').then((r) => r.data),
    add: (propertyId: string) =>
      axiosInstance.post(`/favorites/${propertyId}`).then((r) => r.data),
    remove: (propertyId: string) =>
      axiosInstance.delete(`/favorites/${propertyId}`).then((r) => r.data),
  },

  testimonials: {
    getAll: (limit = 12) =>
      axiosInstance.get(`/testimonials?limit=${limit}`).then((r) => r.data),
    create: (data: object) =>
      axiosInstance.post('/testimonials', data).then((r) => r.data),
  },
};

export default api;
