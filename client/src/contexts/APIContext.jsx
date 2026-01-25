import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../config/axios";
import { TokenManager, HostTokenManager } from "../services/jwtAuthService";

// ================================
// CONTEXT STATE MANAGEMENT
// ================================

// Helper to determine if current path is a host route
const isHostPath = (pathname) => {
  const path = pathname?.toLowerCase() || "";
  return path.includes("/host") || path.includes("/host-");
};

// Helper to get user based on current route
const getUserForRoute = (pathname) => {
  if (isHostPath(pathname)) {
    return HostTokenManager.getCurrentUser();
  } else {
    return TokenManager.getCurrentUser();
  }
};

// Helper to check if authenticated for current route
const isAuthenticatedForRoute = (pathname) => {
  if (isHostPath(pathname)) {
    return HostTokenManager.isLoggedIn();
  } else {
    return TokenManager.isLoggedIn();
  }
};

// Initial state - will be synced on route changes
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  properties: [],
  favorites: [],
  bookings: [],
  hostProperties: [],
};

// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_USER: "SET_USER",
  CLEAR_USER: "CLEAR_USER",
  SYNC_AUTH_STATE: "SYNC_AUTH_STATE",
  SET_PROPERTIES: "SET_PROPERTIES",
  SET_FAVORITES: "SET_FAVORITES",
  SET_BOOKINGS: "SET_BOOKINGS",
  SET_HOST_PROPERTIES: "SET_HOST_PROPERTIES",
  ADD_PROPERTY: "ADD_PROPERTY",
  UPDATE_PROPERTY: "UPDATE_PROPERTY",
  REMOVE_PROPERTY: "REMOVE_PROPERTY",
  ADD_FAVORITE: "ADD_FAVORITE",
  REMOVE_FAVORITE: "REMOVE_FAVORITE",
  ADD_BOOKING: "ADD_BOOKING",
  UPDATE_BOOKING: "UPDATE_BOOKING",
};

// Reducer
const apiReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case actionTypes.CLEAR_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        favorites: [],
        bookings: [],
        hostProperties: [],
      };

    case actionTypes.SYNC_AUTH_STATE:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
      };

    case actionTypes.SET_PROPERTIES:
      return { ...state, properties: action.payload, loading: false };

    case actionTypes.SET_FAVORITES:
      return { ...state, favorites: action.payload, loading: false };

    case actionTypes.SET_BOOKINGS:
      return { ...state, bookings: action.payload, loading: false };

    case actionTypes.SET_HOST_PROPERTIES:
      return { ...state, hostProperties: action.payload, loading: false };

    case actionTypes.ADD_PROPERTY:
      return {
        ...state,
        properties: [...state.properties, action.payload],
        hostProperties:
          state.user?.role === "host"
            ? [...state.hostProperties, action.payload]
            : state.hostProperties,
      };

    case actionTypes.UPDATE_PROPERTY:
      return {
        ...state,
        properties: state.properties.map((p) => {
          const propId = p._id || p.id;
          const payloadId = action.payload._id || action.payload.id;
          return propId === payloadId ? { ...p, ...action.payload } : p;
        }),
        hostProperties: state.hostProperties.map((p) => {
          const propId = p._id || p.id;
          const payloadId = action.payload._id || action.payload.id;
          return propId === payloadId ? { ...p, ...action.payload } : p;
        }),
      };

    case actionTypes.REMOVE_PROPERTY:
      return {
        ...state,
        properties: state.properties.filter((p) => {
          const propId = p._id || p.id;
          return propId !== action.payload;
        }),
        hostProperties: state.hostProperties.filter((p) => {
          const propId = p._id || p.id;
          return propId !== action.payload;
        }),
      };

    case actionTypes.ADD_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case actionTypes.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(
          (f) => f.propertyId !== action.payload,
        ),
      };

    case actionTypes.ADD_BOOKING:
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      };

    case actionTypes.UPDATE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map((b) => {
          const bookingId = b._id || b.id;
          const payloadId = action.payload._id || action.payload.id;
          return bookingId === payloadId ? { ...b, ...action.payload } : b;
        }),
      };

    default:
      return state;
  }
};

// ================================
// CONTEXT CREATION
// ================================

const APIContext = createContext();

// ================================
// API CONTEXT PROVIDER
// ================================

export const APIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apiReducer, initialState);
  const location = useLocation();

  // ================================
  // SYNC AUTH STATE ON ROUTE CHANGE
  // ================================
  useEffect(() => {
    // Sync authentication state based on current route
    const pathname = location.pathname;
    const user = getUserForRoute(pathname);
    const isAuthenticated = isAuthenticatedForRoute(pathname);

    dispatch({
      type: actionTypes.SYNC_AUTH_STATE,
      payload: { user, isAuthenticated },
    });
  }, [location.pathname]);

  // ================================
  // HELPER FUNCTIONS
  // ================================

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  // ================================
  // AUTHENTICATION API CALLS
  // ================================

  const register = useCallback(
    async (userData) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.post("/auth/register", userData);
        const { user, tokens } = response.data;

        // Store tokens in localStorage
        if (tokens) {
          TokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
          TokenManager.setUserData(user);
        }

        dispatch({ type: actionTypes.SET_USER, payload: user });
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [setLoading, setError, clearError],
  );

  const registerHost = useCallback(
    async (hostData) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.post(
          "/auth/register-host",
          hostData,
        );
        const { host, tokens } = response.data;

        // Store tokens in localStorage using HostTokenManager
        if (tokens) {
          HostTokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
          HostTokenManager.setUserData(host);
        }

        dispatch({ type: actionTypes.SET_USER, payload: host });
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [setLoading, setError, clearError],
  );

  const login = useCallback(
    async (email, password, isHost = false) => {
      try {
        setLoading(true);
        clearError();

        // Use different endpoint for host login
        const endpoint = isHost ? "/auth/host-login" : "/auth/login";
        const requestData = isHost
          ? { email, password }
          : { email, password, isHost };

        const response = await axiosInstance.post(endpoint, requestData);

        const { user, tokens } = response.data;

        // Store tokens in localStorage using appropriate manager
        if (tokens) {
          if (isHost) {
            HostTokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
            HostTokenManager.setUserData(user);
          } else {
            TokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
            TokenManager.setUserData(user);
          }
        }

        dispatch({ type: actionTypes.SET_USER, payload: user });
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [setLoading, setError, clearError],
  );

  const googleAuth = useCallback(
    async (idToken, userData) => {
      try {
        setLoading(true);
        clearError();

        // Use different endpoint for host Google auth
        const endpoint = userData.isHost ? "/auth/google-host" : "/auth/google";

        const response = await axiosInstance.post(endpoint, {
          idToken,
          userData,
        });
        const { user, tokens } = response.data;

        // Store tokens in localStorage using appropriate manager
        if (tokens) {
          if (userData.isHost) {
            HostTokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
            HostTokenManager.setUserData(user);
          } else {
            TokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
            TokenManager.setUserData(user);
          }
        }

        dispatch({ type: actionTypes.SET_USER, payload: user });
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [setLoading, setError, clearError],
  );

  const logout = useCallback(
    async (isHost = false) => {
      try {
        setLoading(true);
        await axiosInstance.post("/auth/logout");

        // Clear appropriate tokens based on user type
        if (isHost) {
          HostTokenManager.clearTokens();
        } else {
          TokenManager.clearTokens();
        }

        dispatch({ type: actionTypes.CLEAR_USER });
        return { success: true };
      } catch (error) {
        // Even if API call fails, clear local state
        if (isHost) {
          HostTokenManager.clearTokens();
        } else {
          TokenManager.clearTokens();
        }
        dispatch({ type: actionTypes.CLEAR_USER });
        setError(error);
        throw error;
      }
    },
    [setLoading, setError],
  );

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      const response = await axiosInstance.get("/auth/me");
      const { user } = response.data;

      // Update user data in the appropriate token manager based on route
      const pathname = location.pathname;
      if (isHostPath(pathname)) {
        HostTokenManager.setUserData(user);
      } else {
        TokenManager.setUserData(user);
      }

      dispatch({ type: actionTypes.SET_USER, payload: user });
      return user;
    } catch (error) {
      setError(error);
      throw error;
    }
  }, [setLoading, setError, clearError, location.pathname]);

  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.put("/auth/change-password", {
          currentPassword,
          newPassword,
        });

        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  const resetPassword = useCallback(
    async (email, isHost = false) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.post("/auth/reset-password", {
          email,
          isHost,
        });

        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  const updateProfile = useCallback(
    async (profileData) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.put("/profile", profileData);

        // Update user in state
        const updatedUser = { ...state.user, ...profileData };
        dispatch({ type: actionTypes.SET_USER, payload: updatedUser });

        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [state.user, setLoading, setError, clearError],
  );

  // ================================
  // PROPERTIES API CALLS
  // ================================

  const getProperties = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.get("/properties", {
          params: filters,
        });
        const { properties } = response.data;

        dispatch({ type: actionTypes.SET_PROPERTIES, payload: properties });
        return properties;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [setLoading, setError, clearError],
  );

  const getProperty = useCallback(
    async (id) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.get(`/properties/${id}`);
        return response.data.property;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  const createProperty = useCallback(
    async (propertyData) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.post(
          "/auth/host/properties",
          propertyData,
        );
        const { data } = response.data;

        dispatch({ type: actionTypes.ADD_PROPERTY, payload: data });
        return data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  const updateProperty = useCallback(
    async (id, propertyData) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.put(
          `/auth/host/properties/${id}`,
          propertyData,
        );
        const { data } = response.data;

        dispatch({
          type: actionTypes.UPDATE_PROPERTY,
          payload: { id, ...data },
        });
        return data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  const deleteProperty = useCallback(
    async (id) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.delete(
          `/auth/host/properties/${id}`,
        );

        dispatch({ type: actionTypes.REMOVE_PROPERTY, payload: id });
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  const getHostProperties = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      const response = await axiosInstance.get("/auth/host/properties");

      const { data } = response.data; // The server returns { success, data, count, message }

      dispatch({ type: actionTypes.SET_HOST_PROPERTIES, payload: data || [] });
      return data || [];
    } catch (error) {
      setError(new Error(`Endpoint not found: ${error.config?.url}`));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, clearError]);

  const getHostStats = useCallback(
    async (hostId) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.get(
          `/bookings/host/${hostId}/stats`,
        );

        return response.data;
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch host statistics",
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  const checkBookingAvailability = useCallback(
    async (propertyId, checkIn, checkOut) => {
      try {
        const response = await axiosInstance.post(
          "/bookings/check-availability",
          {
            propertyId,
            checkIn,
            checkOut,
          },
        );

        return response.data;
      } catch (error) {
        throw error;
      }
    },
    [],
  );

  const createBookingWithValidation = useCallback(
    async (bookingData) => {
      try {
        setLoading(true);
        clearError();

        // First check availability
        const availabilityCheck = await checkBookingAvailability(
          bookingData.propertyId,
          bookingData.checkIn,
          bookingData.checkOut,
        );

        if (!availabilityCheck.available) {
          throw new Error(
            availabilityCheck.message ||
              "Property is not available for the selected dates",
          );
        }

        // Create the booking
        const response = await axiosInstance.post("/bookings", bookingData);

        const newBooking = {
          id: response.data.bookingId,
          ...bookingData,
          status: "pending",
          createdAt: new Date(),
        };

        dispatch({ type: actionTypes.ADD_BOOKING, payload: newBooking });
        return response.data;
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to create booking",
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError, checkBookingAvailability],
  );

  const searchProperties = useCallback(
    async (searchCriteria) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.post(
          "/properties/search",
          searchCriteria,
        );
        const { properties } = response.data;

        dispatch({ type: actionTypes.SET_PROPERTIES, payload: properties });
        return properties;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  const getFeaturedProperties = useCallback(
    async (limit = 10) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.get(
          `/properties/featured?limit=${limit}`,
        );
        const { properties } = response.data;

        dispatch({ type: actionTypes.SET_PROPERTIES, payload: properties });
        return properties;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  // Premium plan methods
  const getPremiumImages = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/premium/featured-images");
      return response.data;
    } catch (error) {
      return { images: [] }; // Return empty array on error
    }
  }, []);

  const getWeeklyHeaderImages = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/featured/header-images");
      return response.data;
    } catch (error) {
      return {
        success: false,
        images: [],
        useLocal: true,
        message: "Using fallback images",
      };
    }
  }, []);

  const getRandomFeaturedImages = useCallback(async (limit = 6) => {
    try {
      const response = await axiosInstance.get(
        `/featured/featured-random?limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        images: [],
        useLocal: true,
      };
    }
  }, []);

  const getPremiumShowcase = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/featured/premium-showcase");
      return response.data;
    } catch (error) {
      return {
        success: false,
        showcase: [],
        useLocal: true,
      };
    }
  }, []);

  const getHeroImages = useCallback(async (limit = 6) => {
    try {
      const response = await axiosInstance.get(
        `/featured/hero-images?limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        images: [],
        useLocal: true,
        excludedHeaderDuplicates: false,
      };
    }
  }, []);

  const upgradeToPremium = useCallback(
    async (planData) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.post("/premium/upgrade", planData);
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  const getPremiumStatus = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/premium/status");
      return response.data;
    } catch (error) {
      return { isPremium: false };
    }
  }, []);

  // ================================
  // ADDITIONAL BOOKING METHODS
  // ================================

  // Get booking by ID
  const getBookingById = useCallback(async (bookingId) => {
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  // Cancel booking
  const cancelBooking = useCallback(async (bookingId) => {
    try {
      const response = await axiosInstance.put(
        `/bookings/${bookingId}/status`,
        {
          status: "cancelled",
        },
      );

      dispatch({ type: actionTypes.UPDATE_BOOKING, payload: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  // Send booking confirmation email
  const sendBookingEmail = useCallback(async (bookingId) => {
    try {
      const response = await axiosInstance.post(
        `/bookings/${bookingId}/send-email`,
      );
      return response.data;
    } catch (error) {
      // Don't throw error for email sending failures
      return null;
    }
  }, []);

  // ================================
  // FAVORITES API CALLS
  // ================================

  const getFavorites = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      const response = await axiosInstance.get("/favorites");
      const { favorites } = response.data;

      dispatch({ type: actionTypes.SET_FAVORITES, payload: favorites });
      return favorites;
    } catch (error) {
      setError(error);
      throw error;
    }
  }, [setLoading, setError, clearError]);

  const addToFavorites = useCallback(
    async (propertyId) => {
      try {
        const response = await axiosInstance.post(`/favorites/${propertyId}`);

        const favoriteData = {
          propertyId,
          userId: state.user?.userId,
          savedAt: new Date(),
        };

        dispatch({ type: actionTypes.ADD_FAVORITE, payload: favoriteData });
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [state.user, setError],
  );

  const removeFromFavorites = useCallback(
    async (propertyId) => {
      try {
        const response = await axiosInstance.delete(`/favorites/${propertyId}`);

        dispatch({ type: actionTypes.REMOVE_FAVORITE, payload: propertyId });
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [setError],
  );

  const isFavorite = useCallback(
    (propertyId) => {
      return state.favorites.some((fav) => fav.propertyId === propertyId);
    },
    [state.favorites],
  );

  // ================================
  // BOOKINGS API CALLS
  // ================================

  const getBookings = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      const response = await axiosInstance.get("/bookings");
      const { bookings } = response.data;

      dispatch({ type: actionTypes.SET_BOOKINGS, payload: bookings });
      return bookings;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, clearError]);

  const createBooking = useCallback(
    async (bookingData) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.post("/bookings", bookingData);

        const newBooking = {
          ...bookingData,
          _id: response.data.bookingId,
          id: response.data.bookingId,
          status: "pending",
        };

        dispatch({ type: actionTypes.ADD_BOOKING, payload: newBooking });
        return newBooking;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  const updateBookingStatus = useCallback(
    async (bookingId, status) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.put(
          `/bookings/${bookingId}/status`,
          { status },
        );

        dispatch({
          type: actionTypes.UPDATE_BOOKING,
          payload: { id: bookingId, status },
        });
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  const confirmBooking = useCallback(
    async (bookingId, paymentIntentId) => {
      try {
        setLoading(true);
        clearError();

        const response = await axiosInstance.post(
          `/bookings/${bookingId}/confirm`,
          { paymentIntentId },
        );

        dispatch({
          type: actionTypes.UPDATE_BOOKING,
          payload: {
            id: bookingId,
            status: "confirmed",
            paymentStatus: "paid",
          },
        });
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError],
  );

  // ================================
  // CONTEXT VALUE
  // ================================

  const contextValue = {
    // State
    ...state,

    // Helper functions
    clearError,

    // Authentication
    register,
    registerHost,
    login,
    googleAuth,
    logout,
    getCurrentUser,
    changePassword,
    resetPassword,
    updateProfile,

    // Properties
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    getHostProperties,
    getHostStats,
    searchProperties,
    getFeaturedProperties,
    getPremiumImages,
    getWeeklyHeaderImages,
    getRandomFeaturedImages,
    getPremiumShowcase,
    getHeroImages,
    upgradeToPremium,
    getPremiumStatus,

    // Favorites
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,

    // Bookings
    getBookings,
    createBooking,
    createBookingWithValidation,
    checkBookingAvailability,
    updateBookingStatus,
    confirmBooking,
    getUserBookings: getBookings, // Alias for consistency
    getBookingById,
    cancelBooking,
    sendBookingEmail,
  };

  return (
    <APIContext.Provider value={contextValue}>{children}</APIContext.Provider>
  );
};

// ================================
// CUSTOM HOOK TO USE CONTEXT
// ================================

export const useAPI = () => {
  const context = useContext(APIContext);

  if (!context) {
    throw new Error("useAPI must be used within an APIProvider");
  }

  return context;
};

export default APIContext;
