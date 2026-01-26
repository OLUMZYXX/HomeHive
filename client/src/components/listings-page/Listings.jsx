import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAPI } from "../../contexts/APIContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import {
  FaStar,
  FaHeart,
  FaShare,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaHome,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import { HiLocationMarker, HiHome, HiSparkles } from "react-icons/hi";
import HomeHiveLogo from "../../assets/HomeHiveLogo";
import Footer from "../Footer/Footer";
import { navigateToHome } from "../../utils/navigation";
import useScrollToTop from "../../hooks/useScrollToTop";
import { AnimatedButton } from "../common/AnimatedComponents";
import { truncateText } from "../../utils/textUtils";
import { motion, AnimatePresence } from "framer-motion";
import { FaCog, FaSignOutAlt, FaBook, FaCalendarCheck } from "react-icons/fa";
import { TokenManager } from "../../services/jwtAuthService";
import { toast } from "../../utils/toast.jsx";
import { PropertyCardSkeleton } from "../common/SkeletonLoaders";

const Listings = () => {
  // Use scroll to top hook
  useScrollToTop();

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, searchProperties } = useAPI();
  const {
    selectedCurrency,
    setSelectedCurrency,
    selectedCurrencyData,
    currencies,
    convertFromCurrency,
  } = useCurrency();

  // State declarations - moved to top to avoid initialization errors
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState(new Set());
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const profileMenuRef = useRef(null);
  const datePickerRef = useRef(null);
  const guestSelectorRef = useRef(null);

  // Smart home navigation handler
  const handleHomeNavigation = () => {
    navigateToHome(navigate, location);
  };

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCurrencyDropdown && !event.target.closest(".currency-selector")) {
        setShowCurrencyDropdown(false);
      }
      if (
        profileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
      if (
        showDatePicker &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
      if (
        showGuestSelector &&
        guestSelectorRef.current &&
        !guestSelectorRef.current.contains(event.target)
      ) {
        setShowGuestSelector(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [
    showCurrencyDropdown,
    profileMenuOpen,
    showDatePicker,
    showGuestSelector,
  ]);

  // Convert price based on property currency and selected currency
  // Ensure price and currency always have valid defaults
  const convertPrice = (price, fromCurrency = "NGN") => {
    const validPrice = typeof price === "number" && !isNaN(price) ? price : 0;
    const validCurrency = fromCurrency || "NGN";
    return convertFromCurrency(validPrice, validCurrency, selectedCurrency);
  };

  // Properties state from backend or search
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const fetchingRef = useRef(false);

  // Function to perform quick search based on type
  const performQuickSearch = async (quickSearchType) => {
    try {
      let searchCriteria = {};

      switch (quickSearchType) {
        case "lagos-apartments":
          searchCriteria = {
            location: "Lagos, Nigeria",
            propertyType: "apartment",
            minPrice: 150000,
            maxPrice: 300000,
            available: true,
          };
          break;
        case "luxury-villas":
          searchCriteria = {
            propertyType: "house|villa",
            minPrice: 500000,
            maxPrice: null,
            search: "luxury premium modern",
            searchFields: ["title", "description", "amenities", "category"],
            available: true,
          };
          break;
        case "budget-options":
          searchCriteria = {
            minPrice: 50000,
            maxPrice: 150000,
            search: "budget affordable",
            searchFields: ["title", "description"],
            available: true,
          };
          break;
        default:
          return;
      }

      setLoadingProperties(true);
      const searchResults = await searchProperties(searchCriteria);

      const results = Array.isArray(searchResults) ? searchResults : [];
      setProperties(results);
      setHasMore(false);
      setLoadingProperties(false);

      // Show toast message for quick search results
      if (results.length > 0) {
        toast.success("Quick Search Complete", {
          description: `Found ${results.length} properties`,
          duration: 3000,
        });
      } else {
        toast.info("No Results Found", {
          description:
            "No properties match this quick search. Try a different option.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Quick search error:", error);
      setLoadingProperties(false);
    }
  };

  // On mount, check for search results in location.state or URL parameters or URL parameters
  useEffect(() => {
    const handleInitialLoad = async () => {
      if (location.state && Array.isArray(location.state.searchResults)) {
        setProperties(location.state.searchResults);
        setHasMore(false);
        setLoadingProperties(false);
      } else {
        // Check for quick search parameter in URL
        const urlParams = new URLSearchParams(location.search);
        const quickSearchType = urlParams.get("quick");

        if (quickSearchType) {
          // Perform quick search based on URL parameter
          await performQuickSearch(quickSearchType);
        } else {
          // Fetch properties from backend API
          const fetchProperties = async () => {
            if (fetchingRef.current) {
              return;
            }
            fetchingRef.current = true;
            setLoadingProperties(true);
            try {
              const res = await fetch(`/api/properties?page=${page}&limit=12`);
              if (!res.ok) {
                if (res.status === 429) {
                  setTimeout(() => {
                    fetchingRef.current = false;
                    setLoadingProperties(false);
                  }, 2000);
                  return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              const data = await res.json();
              if (data && data.success && Array.isArray(data.properties)) {
                setProperties((prev) =>
                  page === 1 ? data.properties : [...prev, ...data.properties],
                );
                setHasMore(data.hasMore || false);
              } else {
                // Invalid data structure received
              }
            } catch (err) {
              // Failed to fetch properties
              if (err.message.includes("429")) {
                // Rate limit exceeded
              }
            } finally {
              fetchingRef.current = false;
              setLoadingProperties(false);
            }
          };
          const timeoutId = setTimeout(fetchProperties, 300);
          return () => clearTimeout(timeoutId);
        }
      }
    };

    handleInitialLoad();
  }, [location.state, location.search, page]);

  const filters = [
    { id: "all", name: "All", icon: HiHome },
    { id: "luxury", name: "Luxury", icon: HiSparkles },
    { id: "apartment", name: "Apartments", icon: HiHome },
    { id: "studio", name: "Studios", icon: HiHome },
  ];

  const handleClick = (listingId) => {
    // Validate the listing ID before navigation
    if (!listingId || listingId === "undefined" || listingId === "null") {
      return;
    }

    navigate(`/listing/${listingId}`);
  };

  // Add navigateToHost function for the "Become a Host" button
  const navigateToHost = () => {
    navigate("/host");
  };

  const handleLogout = async () => {
    try {
      // Listings page is for users, so logout as user (isHost = false)
      await logout(false);
      toast.success("Logged out successfully");
      setProfileMenuOpen(false);
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleFavoritesClick = () => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/favorites");
      toast.info("Please log in to view your favorites");
      navigate("/signin");
      return;
    }
    navigate("/favorites");
    setProfileMenuOpen(false);
  };

  const handleBookingsClick = () => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/my-bookings");
      toast.info("Please log in to view your bookings");
      navigate("/signin");
      return;
    }
    navigate("/my-bookings");
    setProfileMenuOpen(false);
  };

  const handleSettingsClick = () => {
    if (!user) {
      toast.info("Please log in to access settings");
      navigate("/signin");
      return;
    }
    navigate("/profile/settings");
    setProfileMenuOpen(false);
  };

  // Guest selector functions
  const updateGuests = (type, change) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + change),
    }));
  };

  const getTotalGuests = () => {
    return guests.adults + guests.children + guests.infants;
  };

  const formatGuestText = () => {
    const total = getTotalGuests();
    if (total === 0) return "Add guests";
    if (total === 1) return "1 guest";
    return `${total} guests`;
  };

  // Date handling functions
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatDateRange = () => {
    if (!checkInDate && !checkOutDate) return "Add dates";
    if (checkInDate && !checkOutDate) return formatDate(checkInDate);
    if (checkInDate && checkOutDate)
      return `${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`;
    return "Add dates";
  };

  const handleDateSelect = (date) => {
    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date);
      setCheckOutDate(null);
    } else if (date > checkInDate) {
      setCheckOutDate(date);
      setShowDatePicker(false);
    } else {
      setCheckInDate(date);
      setCheckOutDate(null);
    }
  };

  const toggleFavorite = (listingId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(listingId)) {
      newFavorites.delete(listingId);
    } else {
      newFavorites.add(listingId);
    }
    setFavorites(newFavorites);
  };

  // Filter properties by category
  const filteredListings =
    activeFilter === "all"
      ? properties
      : activeFilter === "luxury"
        ? properties.filter(
            (property) => property.category?.toLowerCase() === "luxury",
          )
        : activeFilter === "apartment"
          ? properties.filter(
              (property) => property.type?.toLowerCase() === "apartment",
            )
          : activeFilter === "studio"
            ? properties.filter(
                (property) => property.type?.toLowerCase() === "studio",
              )
            : properties;

  // Demo images fallback array
  const demoImages = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  ];

  return (
    <div className="bg-white min-h-screen overflow-x-hidden flex flex-col">
      {/* Enhanced Mobile-First Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-medium border-b border-primary-200 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-6">
            {/* Logo - Mobile Optimized */}
            <div
              className="flex items-center gap-2 sm:gap-4 cursor-pointer group flex-shrink-0"
              onClick={handleHomeNavigation}
            >
              <HomeHiveLogo
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain transition-transform duration-200 group-hover:scale-105"
                alt="Homehive Logo"
              />
              <h1 className="font-NotoSans text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 bg-clip-text text-transparent">
                Homehive
              </h1>
            </div>

            {/* Enhanced Search Bar - Desktop with glassmorphism */}
            <div className="hidden lg:flex items-center justify-center bg-white/95 backdrop-blur-md border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-400 max-w-3xl flex-1 mx-8">
              <div className="flex items-center flex-1">
                {/* Where Section */}
                <div className="flex-1 px-6 py-4 border-r border-gray-200 hover:bg-gray-50/80 transition-colors duration-300 rounded-l-full">
                  <div className="text-xs font-bold text-primary-700 mb-1 uppercase tracking-wide">
                    Where
                  </div>
                  <input
                    type="text"
                    placeholder="Search destinations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-primary-800 placeholder-primary-400 focus:outline-none text-sm font-medium"
                  />
                </div>

                {/* Check in Section */}
                <div
                  className="px-6 py-4 border-r border-gray-200 hover:bg-gray-50/80 transition-colors duration-300 min-w-0 flex-shrink-0 mr-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGuestSelector(false);
                    setShowDatePicker(!showDatePicker);
                  }}
                >
                  <div className="text-xs font-bold text-primary-700 mb-1 uppercase tracking-wide">
                    Check in
                  </div>
                  <div className="text-primary-500 text-sm font-medium whitespace-nowrap">
                    {checkInDate ? formatDate(checkInDate) : "Add date"}
                  </div>
                </div>

                {/* Guests Section */}
                <div
                  className="px-6 py-4 hover:bg-gray-50/80 transition-colors duration-300 rounded-r-full min-w-0 flex-shrink-0 ml-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDatePicker(false);
                    setShowGuestSelector(!showGuestSelector);
                  }}
                >
                  <div className="text-xs font-bold text-primary-700 mb-1 uppercase tracking-wide">
                    Guests
                  </div>
                  <div className="text-primary-500 text-sm font-medium whitespace-nowrap">
                    {formatGuestText()}
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="p-2">
                <button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                  <FaSearch className="text-lg" />
                </button>
              </div>
            </div>

            {/* Date Picker Dropdown */}
            <AnimatePresence>
              {showDatePicker && (
                <motion.div
                  ref={datePickerRef}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-96 bg-white border-2 border-gray-200 rounded-3xl shadow-xl z-50 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Select dates
                      </h3>
                      <button
                        onClick={() => {
                          setCheckInDate(null);
                          setCheckOutDate(null);
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    </div>

                    {/* Simple Date Picker */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-gray-500 py-2"
                        >
                          {day}
                        </div>
                      ))}

                      {/* Generate dates for current month */}
                      {Array.from({ length: 31 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const isSelected =
                          (checkInDate &&
                            date.toDateString() ===
                              checkInDate.toDateString()) ||
                          (checkOutDate &&
                            date.toDateString() ===
                              checkOutDate.toDateString());
                        const isInRange =
                          checkInDate &&
                          checkOutDate &&
                          date > checkInDate &&
                          date < checkOutDate;

                        return (
                          <button
                            key={i}
                            onClick={() => handleDateSelect(date)}
                            className={`text-center py-2 text-sm rounded-full transition-colors ${
                              isSelected
                                ? "bg-primary-600 text-white"
                                : isInRange
                                  ? "bg-primary-100 text-primary-700"
                                  : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        {checkInDate && `Check-in: ${formatDate(checkInDate)}`}
                        {checkInDate &&
                          checkOutDate &&
                          ` • Check-out: ${formatDate(checkOutDate)}`}
                      </div>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Guest Selector Dropdown */}
            <AnimatePresence>
              {showGuestSelector && (
                <motion.div
                  ref={guestSelectorRef}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/4 mt-3 w-80 bg-white border-2 border-gray-200 rounded-3xl shadow-xl z-50 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Guests
                    </h3>

                    {/* Adults */}
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div>
                        <div className="font-medium text-gray-900">Adults</div>
                        <div className="text-sm text-gray-500">
                          Ages 13 or above
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateGuests("adults", -1)}
                          disabled={guests.adults <= 1}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium">
                          {guests.adults}
                        </span>
                        <button
                          onClick={() => updateGuests("adults", 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div>
                        <div className="font-medium text-gray-900">
                          Children
                        </div>
                        <div className="text-sm text-gray-500">Ages 2-12</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateGuests("children", -1)}
                          disabled={guests.children <= 0}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium">
                          {guests.children}
                        </span>
                        <button
                          onClick={() => updateGuests("children", 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <div className="font-medium text-gray-900">Infants</div>
                        <div className="text-sm text-gray-500">Under 2</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateGuests("infants", -1)}
                          disabled={guests.infants <= 0}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium">
                          {guests.infants}
                        </span>
                        <button
                          onClick={() => updateGuests("infants", 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setShowGuestSelector(false)}
                        className="px-6 py-2 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Side - Mobile Optimized */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Become a Host - Hidden on small screens */}
              <AnimatedButton
                onClick={navigateToHost}
                className="hidden md:inline-block px-6 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 rounded-full transition-all duration-200"
              >
                Become a Host
              </AnimatedButton>

              {/* Enhanced Currency Selector - Mobile Optimized */}
              <div className="relative currency-selector">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="flex items-center gap-1 sm:gap-3 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-xl px-2 sm:px-4 py-2 sm:py-3 transition-all duration-300 shadow-soft hover:shadow-medium"
                >
                  <span className="font-bold text-primary-800 text-sm sm:text-lg">
                    {selectedCurrencyData?.symbol}
                  </span>
                  <span className="hidden sm:block text-sm font-semibold text-primary-700">
                    {selectedCurrency}
                  </span>
                  <FaChevronDown
                    className={`text-primary-600 text-xs transition-transform duration-300 ${
                      showCurrencyDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Enhanced Currency Dropdown with glassmorphism */}
                {showCurrencyDropdown && (
                  <div className="absolute top-full right-0 mt-3 w-48 sm:w-64 bg-white/95 backdrop-blur-md border-2 border-primary-200 rounded-2xl shadow-strong z-50 overflow-hidden animate-slideDown">
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setSelectedCurrency(currency.code);
                          setShowCurrencyDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 hover:bg-primary-50/80 transition-all duration-300 text-left border-b border-primary-100 last:border-b-0 ${
                          selectedCurrency === currency.code
                            ? "bg-primary-100/80 border-primary-200"
                            : ""
                        }`}
                      >
                        <span className="text-lg sm:text-xl font-bold text-primary-800 w-6 sm:w-8 text-center">
                          {currency.symbol}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-primary-900 text-sm">
                            {currency.code}
                          </div>
                          <div className="text-xs text-primary-600 font-medium">
                            {currency.name}
                          </div>
                        </div>
                        {selectedCurrency === currency.code && (
                          <div className="w-2 h-2 bg-primary-800 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced User Menu - Mobile Optimized */}
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="relative flex items-center gap-4">
                    <button
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 overflow-hidden relative focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileMenuOpen((open) => !open);
                      }}
                      aria-label="Profile menu"
                    >
                      {user.profilePicture || user.photoURL ? (
                        <img
                          src={user.profilePicture || user.photoURL}
                          alt="User Profile"
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-lg"
                        style={{
                          display:
                            user.profilePicture || user.photoURL
                              ? "none"
                              : "flex",
                        }}
                      >
                        {(
                          user.displayName ||
                          user.firstName ||
                          user.email ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      {/* Status indicator for authenticated users */}
                      <span className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white"></span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate("/signin")}
                      className="px-6 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 border-2 border-gray-800 rounded-full transition-all duration-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className="px-6 py-2.5 text-base font-medium bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-all duration-200"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Mobile Search Bar - Better Responsive Design */}
          <div className="lg:hidden mt-3 space-y-3">
            {/* Main Search Input */}
            <div className="flex items-center bg-white/95 backdrop-blur-md border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex-1 px-5 py-3">
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none font-medium"
                />
              </div>
              <button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white p-3 rounded-full m-2 transition-all duration-300">
                <FaSearch className="text-base" />
              </button>
            </div>

            {/* Quick Action Buttons - Mobile Only */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 transition-all duration-300 hover:shadow-md hover:bg-gray-50 whitespace-nowrap flex-shrink-0 cursor-pointer"
              >
                <FaCalendarAlt className="text-primary-600 text-sm" />
                <span className="text-sm font-medium text-gray-700">
                  {formatDateRange() === "Add dates"
                    ? "Dates"
                    : formatDateRange()}
                </span>
              </button>
              <button
                onClick={() => setShowGuestSelector(!showGuestSelector)}
                className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 transition-all duration-300 hover:shadow-md hover:bg-gray-50 whitespace-nowrap flex-shrink-0 cursor-pointer"
              >
                <FaUsers className="text-primary-600 text-sm" />
                <span className="text-sm font-medium text-gray-700">
                  {formatGuestText() === "Add guests"
                    ? "Guests"
                    : formatGuestText()}
                </span>
              </button>
              <button className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 transition-all duration-300 hover:shadow-md hover:bg-gray-50 whitespace-nowrap flex-shrink-0">
                <FaFilter className="text-primary-600 text-sm" />
                <span className="text-sm font-medium text-gray-700">
                  Filters
                </span>
              </button>
              {/* Mobile Currency Quick Access */}
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="sm:hidden flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-300 hover:shadow-md hover:bg-gray-50 whitespace-nowrap flex-shrink-0"
              >
                <span className="font-bold text-primary-800 text-sm">
                  {selectedCurrencyData?.symbol}
                </span>
                <span className="text-sm font-medium text-primary-700">
                  {selectedCurrency}
                </span>
              </button>
              {/* Mobile Host Button */}
              <button
                onClick={navigateToHost}
                className="md:hidden flex items-center gap-2 bg-primary-700 text-white rounded-full px-4 py-2 transition-all duration-300 hover:bg-primary-800 shadow-md whitespace-nowrap flex-shrink-0"
              >
                <FaHome className="text-sm" />
                <span className="text-sm font-medium">Host</span>
              </button>
            </div>
          </div>

          {/* Mobile Date Picker */}
          <AnimatePresence>
            {showDatePicker && (
              <motion.div
                ref={datePickerRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden mt-4 mx-4 bg-white border-2 border-gray-200 rounded-3xl shadow-xl z-50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Select dates
                    </h3>
                    <button
                      onClick={() => {
                        setCheckInDate(null);
                        setCheckOutDate(null);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Simple Date Picker */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 py-2"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Generate dates for current month */}
                    {Array.from({ length: 31 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      const isSelected =
                        (checkInDate &&
                          date.toDateString() === checkInDate.toDateString()) ||
                        (checkOutDate &&
                          date.toDateString() === checkOutDate.toDateString());
                      const isInRange =
                        checkInDate &&
                        checkOutDate &&
                        date > checkInDate &&
                        date < checkOutDate;

                      return (
                        <button
                          key={i}
                          onClick={() => handleDateSelect(date)}
                          className={`text-center py-2 text-sm rounded-full transition-colors ${
                            isSelected
                              ? "bg-primary-600 text-white"
                              : isInRange
                                ? "bg-primary-100 text-primary-700"
                                : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {checkInDate && `Check-in: ${formatDate(checkInDate)}`}
                      {checkInDate &&
                        checkOutDate &&
                        ` • Check-out: ${formatDate(checkOutDate)}`}
                    </div>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Guest Selector */}
          <AnimatePresence>
            {showGuestSelector && (
              <motion.div
                ref={guestSelectorRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden mt-4 mx-4 bg-white border-2 border-gray-200 rounded-3xl shadow-xl z-50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Guests
                  </h3>

                  {/* Adults */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">Adults</div>
                      <div className="text-sm text-gray-500">
                        Ages 13 or above
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests("adults", -1)}
                        disabled={guests.adults <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-medium">
                        {guests.adults}
                      </span>
                      <button
                        onClick={() => updateGuests("adults", 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">Children</div>
                      <div className="text-sm text-gray-500">Ages 2-12</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests("children", -1)}
                        disabled={guests.children <= 0}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-medium">
                        {guests.children}
                      </span>
                      <button
                        onClick={() => updateGuests("children", 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <div className="font-medium text-gray-900">Infants</div>
                      <div className="text-sm text-gray-500">Under 2</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests("infants", -1)}
                        disabled={guests.infants <= 0}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-medium">
                        {guests.infants}
                      </span>
                      <button
                        onClick={() => updateGuests("infants", 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowGuestSelector(false)}
                      className="px-6 py-2 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {profileMenuOpen && user && isAuthenticated && (
          <motion.div
            ref={profileMenuRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ right: "2.5rem", top: "4.5rem" }}
            className="absolute w-96 bg-white/95 backdrop-blur-md border border-neutral-200/50 rounded-3xl shadow-strong z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Header */}
            <div className="p-6 bg-gradient-to-r from-neutral-50 to-primary-50 border-b border-neutral-200/30">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {user.profilePicture || user.photoURL ? (
                    <img
                      src={user.profilePicture || user.photoURL}
                      alt="User Profile"
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-medium"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-white shadow-medium"
                    style={{
                      display:
                        user.profilePicture || user.photoURL ? "none" : "flex",
                    }}
                  >
                    {(user.displayName || user.firstName || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  {/* Enhanced status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white shadow-sm">
                    <div className="w-full h-full bg-success-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-neutral-800 text-lg truncate">
                    {user.displayName || user.firstName || "User"}
                  </div>
                  <div className="text-sm text-neutral-500 truncate">
                    {user.email}
                  </div>
                  <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-success-100 text-success-700 text-xs font-medium rounded-full">
                    <div className="w-1.5 h-1.5 bg-success-500 rounded-full"></div>
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {/* Account Section */}
              <div className="px-2 pb-2">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-4 py-2">
                  Account
                </div>
                <button
                  onClick={handleSettingsClick}
                  className="w-full group flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 rounded-2xl mx-2"
                >
                  <div className="flex items-center justify-center w-9 h-9 bg-neutral-100 group-hover:bg-primary-100 rounded-xl transition-colors duration-200">
                    <FaCog className="text-neutral-600 group-hover:text-primary-600 text-sm" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">Settings</div>
                    <div className="text-xs text-neutral-500">
                      Manage preferences
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleFavoritesClick}
                  className="w-full group flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 rounded-2xl mx-2"
                >
                  <div className="flex items-center justify-center w-9 h-9 bg-neutral-100 group-hover:bg-accent-red-100 rounded-xl transition-colors duration-200">
                    <FaHeart className="text-neutral-600 group-hover:text-accent-red-500 text-sm" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">Favorites</div>
                    <div className="text-xs text-neutral-500">
                      Saved properties
                    </div>
                  </div>
                </button>
              </div>

              {/* Divider */}
              <div className="my-2 mx-6 border-t border-neutral-200/50"></div>

              {/* Quick Actions */}
              <div className="px-2 pb-2">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-4 py-2">
                  Quick Actions
                </div>
                <button
                  onClick={handleBookingsClick}
                  className="w-full group flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 rounded-2xl mx-2"
                >
                  <div className="flex items-center justify-center w-9 h-9 bg-neutral-100 group-hover:bg-primary-100 rounded-xl transition-colors duration-200">
                    <FaCalendarCheck className="text-neutral-600 group-hover:text-primary-600 text-sm" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">My Bookings</div>
                    <div className="text-xs text-neutral-500">
                      View your reservations
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 rounded-2xl mx-2"
                >
                  <div className="flex items-center justify-center w-9 h-9 bg-red-100 group-hover:bg-red-200 rounded-xl transition-colors duration-200">
                    <FaSignOutAlt className="text-red-600 text-sm" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">Sign Out</div>
                    <div className="text-xs text-red-500">End your session</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col">
            {/* Left Content */}
            <div className="flex-1 min-w-0">
              {/* Header with Filters */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 mb-1">
                      Available Properties
                    </h1>
                    <p className="text-sm sm:text-base text-primary-600">
                      {filteredListings.length} amazing places to stay
                    </p>
                  </div>

                  <button className="flex items-center gap-2 border border-primary-200 rounded-full px-3 py-2 hover:border-primary-300 transition-colors duration-300 text-sm">
                    <FaFilter className="text-primary-600 text-xs" />
                    <span className="font-medium text-primary-700">
                      Filters
                    </span>
                  </button>
                </div>

                {/* Category Filters - No Horizontal Scroll */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 text-xs sm:text-sm font-medium min-w-0 ${
                        activeFilter === filter.id
                          ? "bg-primary-800 text-white shadow-md"
                          : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                      }`}
                    >
                      <filter.icon className="text-sm flex-shrink-0" />
                      <span className="truncate">{filter.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loadingProperties && properties.length === 0
                  ? // Show skeleton loaders while loading initial properties
                    Array(8)
                      .fill(0)
                      .map((_, idx) => (
                        <PropertyCardSkeleton key={`skeleton-${idx}`} />
                      ))
                  : // Show actual properties
                    filteredListings.map((property, idx) => (
                      <div
                        key={property._id}
                        className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-500 transform hover:-translate-y-1"
                      >
                        <div className="flex flex-col">
                          {/* Image */}
                          <div className="relative group h-48 overflow-hidden">
                            <img
                              src={
                                property.images &&
                                property.images.length > 0 &&
                                property.images[0]
                                  ? typeof property.images[0] === "object" &&
                                    property.images[0].data
                                    ? property.images[0].data
                                    : property.images[0]
                                  : demoImages[idx % demoImages.length]
                              }
                              alt={property.title}
                              className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                              onClick={() => handleClick(property._id)}
                            />

                            {/* Badge */}
                            {property.badge && (
                              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-primary-800 shadow-md">
                                {property.badge}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute top-3 right-3 flex gap-2">
                              <button
                                onClick={() => toggleFavorite(property._id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                                  favorites.has(property._id)
                                    ? "bg-red-500 text-white"
                                    : "bg-white/90 text-primary-600 hover:bg-white"
                                }`}
                              >
                                <FaHeart className="text-sm" />
                              </button>
                              <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-600 hover:bg-white transition-all duration-300">
                                <FaShare className="text-sm" />
                              </button>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4 flex flex-col justify-between flex-1">
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <HiLocationMarker className="text-primary-500 text-sm" />
                                  <span className="text-primary-600 font-medium text-sm">
                                    {property.address?.city ||
                                      property.location}
                                  </span>
                                </div>
                                <h2
                                  className="text-lg font-bold text-primary-900 cursor-pointer hover:text-primary-800 transition-colors duration-300 leading-tight"
                                  onClick={() => handleClick(property._id)}
                                >
                                  {property.title}
                                </h2>
                              </div>

                              <p className="text-primary-600 text-sm leading-relaxed">
                                {truncateText(property.description, 100)}
                              </p>
                            </div>

                            {/* Bottom Row */}
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-primary-100">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <FaStar className="text-amber-400 text-sm" />
                                  <span className="font-bold text-primary-900 text-sm">
                                    {property.averageRating || "New"}
                                  </span>
                                </div>
                                <span className="text-primary-600 text-xs">
                                  ({property.totalReviews || 0} reviews)
                                </span>
                              </div>

                              <div className="text-right">
                                <div className="text-lg font-black text-primary-900">
                                  {selectedCurrencyData?.symbol}
                                  {convertPrice(
                                    typeof property.price === "number" &&
                                      !isNaN(property.price)
                                      ? property.price
                                      : 0,
                                    property.currency || "NGN",
                                  )}
                                </div>
                                <div className="text-primary-600 text-xs">
                                  per night
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8 sm:mt-12">
                  <button
                    className="bg-primary-800 hover:bg-primary-900 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={loadingProperties}
                  >
                    {loadingProperties ? "Loading..." : "Load More Properties"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Listings;
