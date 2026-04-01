import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import api, { TokenStore } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium?: boolean;
}

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  rating?: number;
  reviewCount?: number;
  category?: string;
  bedrooms?: number;
  bathrooms?: number;
  guests?: number;
  amenities?: string[];
  description?: string;
  host?: { name: string; avatar?: string };
}

interface Booking {
  _id: string;
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface State {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  properties: Property[];
  featuredProperties: Property[];
  favorites: string[];
  bookings: Booking[];
  error: string | null;
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROPERTIES'; payload: Property[] }
  | { type: 'SET_FEATURED'; payload: Property[] }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'SET_BOOKINGS'; payload: Booking[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'LOGOUT' };

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState: State = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  properties: [],
  featuredProperties: [],
  favorites: [],
  bookings: [],
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload };
    case 'SET_FEATURED':
      return { ...state, featuredProperties: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface APIContextValue extends State {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchProperties: (params?: object) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
}

const APIContext = createContext<APIContextValue | null>(null);

export function APIProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const token = await TokenStore.getAccessToken();
        if (token) {
          const profile = await api.auth.getProfile();
          if (profile?.user) {
            dispatch({ type: 'SET_USER', payload: profile.user });
            return;
          }
        }
      } catch {
        await TokenStore.clearTokens();
      }
      dispatch({ type: 'SET_USER', payload: null });
    })();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const data = await api.auth.login({ email, password });
        const accessToken = data.tokens?.accessToken;
        const refreshToken = data.tokens?.refreshToken;
        if (accessToken) {
          await TokenStore.setTokens(accessToken, refreshToken ?? '');
          await TokenStore.setUser(data.user);
          dispatch({ type: 'SET_USER', payload: data.user });
          return true;
        }
        dispatch({ type: 'SET_ERROR', payload: data.message || 'Login failed' });
        return false;
      } catch (err: any) {
        dispatch({
          type: 'SET_ERROR',
          payload: err?.userMessage || err?.response?.data?.message || 'Login failed',
        });
        return false;
      }
    },
    [],
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const data = await api.auth.register({ name, email, password });
        const accessToken = data.tokens?.accessToken;
        const refreshToken = data.tokens?.refreshToken;
        if (accessToken) {
          await TokenStore.setTokens(accessToken, refreshToken ?? '');
          await TokenStore.setUser(data.user);
          dispatch({ type: 'SET_USER', payload: data.user });
          return true;
        }
        dispatch({ type: 'SET_ERROR', payload: data.message || 'Registration failed' });
        return false;
      } catch (err: any) {
        dispatch({
          type: 'SET_ERROR',
          payload: err?.userMessage || err?.response?.data?.message || 'Registration failed',
        });
        return false;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {}
    await TokenStore.clearTokens();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const fetchProperties = useCallback(async (params?: object) => {
    try {
      const data = await api.properties.getAll(params);
      dispatch({
        type: 'SET_PROPERTIES',
        payload: data.properties || data || [],
      });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load properties' });
    }
  }, []);

  const fetchFeatured = useCallback(async () => {
    try {
      const data = await api.properties.getFeatured();
      dispatch({
        type: 'SET_FEATURED',
        payload: data.properties || data || [],
      });
    } catch {
      dispatch({ type: 'SET_FEATURED', payload: [] });
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await api.bookings.getMyBookings();
      dispatch({ type: 'SET_BOOKINGS', payload: data.bookings || data || [] });
    } catch {
      dispatch({ type: 'SET_BOOKINGS', payload: [] });
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!state.isAuthenticated) return;
    try {
      const data = await api.favorites.get();
      const ids = (data.favorites || data || []).map(
        (f: any) => f.property?._id || f._id || f,
      );
      dispatch({ type: 'SET_FAVORITES', payload: ids });
    } catch {}
  }, [state.isAuthenticated]);

  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      if (!state.isAuthenticated) return;
      const isFav = state.favorites.includes(propertyId);
      dispatch({ type: 'TOGGLE_FAVORITE', payload: propertyId });
      try {
        if (isFav) await api.favorites.remove(propertyId);
        else await api.favorites.add(propertyId);
      } catch {
        dispatch({ type: 'TOGGLE_FAVORITE', payload: propertyId });
      }
    },
    [state.isAuthenticated, state.favorites],
  );

  return (
    <APIContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        fetchProperties,
        fetchFeatured,
        fetchBookings,
        fetchFavorites,
        toggleFavorite,
      }}
    >
      {children}
    </APIContext.Provider>
  );
}

export function useAPI() {
  const ctx = useContext(APIContext);
  if (!ctx) throw new Error('useAPI must be used within APIProvider');
  return ctx;
}
