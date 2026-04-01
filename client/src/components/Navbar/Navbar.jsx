import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HomeHiveLogo from "../../assets/HomeHiveLogo";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";
import {
  FaCog,
  FaSignOutAlt,
  FaHeart,
  FaHome,
  FaBook,
  FaCalendarCheck,
} from "react-icons/fa";
import { navigateToHome } from "../../utils/navigation";
import { AnimatedButton } from "../common/AnimatedComponents";
import { useAPI } from "../../contexts/APIContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { TokenManager } from "../../services/jwtAuthService";
import { toast } from "../../utils/toast.jsx";

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    logout: apiLogout,
    loading,
    error,
    clearError,
  } = useAPI();
  const {
    selectedCurrency,
    setSelectedCurrency,
    selectedCurrencyData,
    currencies,
  } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleHomeNavigation = () => {
    navigateToHome(navigate, location);
    setMenuOpen(false);
  };

  useEffect(() => {
    TokenManager.initialize();
    if (error) clearError();
  }, [error, clearError]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
      if (!event.target.closest(".currency-dropdown")) {
        setCurrencyDropdownOpen(false);
      }
    }
    if (profileMenuOpen || currencyDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen, currencyDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 60);
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setVisible(false);
        setMenuOpen(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navigateToHost = () => navigate("/Host");

  const handleLogout = async () => {
    try {
      await apiLogout(false);
      toast.success("Logged out successfully");
      setMenuOpen(false);
      setProfileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleBookingClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/listings");
      toast.info("Please log in to view your bookings");
      navigate("/signin");
      return;
    }
    navigate("/listings", { state: { smoothScroll: true } });
    setMenuOpen(false);
  };

  const handleFavoritesClick = () => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/favorites");
      toast.info("Please log in to view your favorites");
      navigate("/signin");
      return;
    }
    navigate("/favorites");
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleBookingsClick = () => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/my-bookings");
      toast.info("Please log in to view your bookings");
      navigate("/signin");
      return;
    }
    navigate("/my-bookings");
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleSettingsClick = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to access settings");
      navigate("/signin");
      return;
    }
    navigate("/profile/settings");
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearching(false);
        setSearchQuery("");
        setMenuOpen(false);
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Search failed. Please try again.");
      }
    }
  };

  const closeSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
  };

  const navLinks = [
    { name: "Explore", icon: <FaHome />, action: handleHomeNavigation },
    { name: "Listings", icon: <FaBook />, action: handleBookingClick },
    { name: "My Bookings", icon: <FaCalendarCheck />, action: handleBookingsClick },
  ];

  // Transparent on home hero, white when scrolled or on other pages
  const isTransparent = isHome && !scrolled && !menuOpen;
  const textColor = isTransparent ? "text-white" : "text-neutral-800";
  const borderColor = isTransparent ? "border-white/30" : "border-neutral-200";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-navbar border-b border-neutral-100"
      }`}
    >
      <div className="container mx-auto px-6 md:px-10 lg:px-12 max-w-screen-xl">
        <div className="flex items-center justify-between py-5">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            onClick={handleHomeNavigation}
          >
            <div className={`flex-shrink-0 ${isTransparent ? "brightness-0 invert" : ""}`}>
              <HomeHiveLogo
                className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105"
                alt="HomeHive Logo"
              />
            </div>
            <span
              className={`font-Cormorant text-2xl font-semibold tracking-wide transition-colors duration-300 ${textColor}`}
            >
              HomeHive
            </span>
          </div>

          {/* Desktop Nav Links — centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-10">
            {isSearching ? (
              <form
                onSubmit={handleSearch}
                className={`flex items-center rounded-full border px-6 py-2.5 min-w-[480px] max-w-[640px] ${
                  isTransparent
                    ? "bg-white/15 backdrop-blur-sm border-white/40"
                    : "bg-neutral-50 border-neutral-200"
                }`}
              >
                <input
                  type="text"
                  placeholder="Search accommodations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 bg-transparent focus:outline-none text-base ${
                    isTransparent
                      ? "text-white placeholder-white/60"
                      : "text-neutral-700 placeholder-neutral-400"
                  }`}
                  autoFocus
                />
                <button type="submit" className="ml-2">
                  <CiSearch className={`text-xl ${isTransparent ? "text-white/80" : "text-neutral-500"}`} />
                </button>
                <button type="button" onClick={closeSearch} className="ml-2">
                  <IoClose className={`text-xl ${isTransparent ? "text-white/80" : "text-neutral-500"}`} />
                </button>
              </form>
            ) : (
              <ul className="flex items-center gap-10">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={link.action}
                      className={`text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-70 ${textColor}`}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <IoClose className={`text-2xl ${textColor}`} />
            ) : (
              <HiMenu className={`text-2xl ${textColor}`} />
            )}
          </button>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {/* Search icon */}
            {!isSearching && (
              <button
                onClick={() => setIsSearching(true)}
                className={`p-1 transition-opacity duration-200 hover:opacity-70 ${textColor}`}
              >
                <CiSearch className="text-xl" />
              </button>
            )}

            {/* Become a Host — always shown on home */}
            {isHome && (
              <button
                onClick={navigateToHost}
                className={`text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-70 ${textColor}`}
              >
                Become a Host
              </button>
            )}

            {user && isAuthenticated ? (
              <div className="relative flex items-center gap-4">
                {/* Currency Selector */}
                <div className="relative currency-dropdown">
                  <button
                    onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-opacity duration-200 hover:opacity-70 ${textColor}`}
                  >
                    <span>{selectedCurrencyData?.symbol}</span>
                    <span className="hidden sm:block tracking-wide">{selectedCurrency}</span>
                  </button>

                  <AnimatePresence>
                    {currencyDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-2xl shadow-strong z-50 overflow-hidden"
                      >
                        {currencies.map((currency) => (
                          <button
                            key={currency.code}
                            onClick={() => {
                              setSelectedCurrency(currency.code);
                              setCurrencyDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-all duration-200 text-left ${
                              selectedCurrency === currency.code
                                ? "bg-neutral-50 border-r-4 border-primary-800"
                                : ""
                            }`}
                          >
                            <span className="text-lg font-bold text-neutral-800 w-8 text-center">
                              {currency.symbol}
                            </span>
                            <div className="flex-1">
                              <div className="font-semibold text-neutral-900 text-sm">{currency.code}</div>
                              <div className="text-xs text-neutral-500">{currency.name}</div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Avatar */}
                <button
                  className={`w-10 h-10 rounded-full border-2 overflow-hidden relative focus:outline-none ${
                    isTransparent ? "border-white/50" : "border-neutral-200"
                  }`}
                  onClick={() => setProfileMenuOpen((open) => !open)}
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
                    className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-semibold"
                    style={{ display: user.profilePicture || user.photoURL ? "none" : "flex" }}
                  >
                    {(user.displayName || user.firstName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/signin" className="inline-block">
                  <button
                    className={`text-sm font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-70 ${textColor}`}
                  >
                    Login
                  </button>
                </Link>
                <Link to="/signup" className="inline-block">
                  <button
                    className={`px-5 py-2 text-sm font-medium tracking-widest uppercase rounded-none border transition-all duration-300 ${
                      isTransparent
                        ? "border-white/70 text-white hover:bg-white hover:text-neutral-900"
                        : "border-neutral-800 text-neutral-800 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Profile Dropdown */}
        <AnimatePresence>
          {profileMenuOpen && user && isAuthenticated && (
            <motion.div
              ref={profileMenuRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ right: "2rem", top: "4.5rem" }}
              className="absolute w-80 bg-white border border-neutral-200 rounded-2xl shadow-strong z-50 overflow-hidden"
            >
              <div className="p-5 bg-neutral-50 border-b border-neutral-100">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-semibold text-base">
                      {(user.displayName || user.firstName || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-neutral-800 truncate">
                      {user.displayName || user.firstName || "User"}
                    </div>
                    <div className="text-sm text-neutral-500 truncate">{user.email}</div>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <button
                  onClick={handleSettingsClick}
                  className="w-full flex items-center gap-3 px-5 py-3 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 text-left"
                >
                  <FaCog className="text-neutral-400" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
                <button
                  onClick={handleFavoritesClick}
                  className="w-full flex items-center gap-3 px-5 py-3 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 text-left"
                >
                  <FaHeart className="text-neutral-400" />
                  <span className="text-sm font-medium">Favorites</span>
                </button>
                <div className="my-1 mx-5 border-t border-neutral-100"></div>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 transition-colors duration-200 text-left"
                >
                  <FaSignOutAlt className="text-red-400" />
                  <span className="text-sm font-medium">{loading ? "Logging out..." : "Sign Out"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-neutral-100 shadow-lg overflow-hidden"
            >
              <div className="px-6 py-5 space-y-5">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search accommodations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-full text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <button type="submit" className="p-3 bg-primary-800 hover:bg-primary-900 text-white rounded-full transition-colors">
                    <CiSearch className="text-lg" />
                  </button>
                </form>

                {/* Nav links */}
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={link.action}
                      className="w-full flex items-center gap-3 px-3 py-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors text-sm font-medium tracking-wide uppercase"
                    >
                      {link.icon}
                      {link.name}
                    </button>
                  ))}
                  {isHome && (
                    <button
                      onClick={navigateToHost}
                      className="w-full flex items-center gap-3 px-3 py-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors text-sm font-medium tracking-wide uppercase"
                    >
                      <FaHome />
                      Become a Host
                    </button>
                  )}
                </div>

                {/* Auth */}
                <div className="pt-4 border-t border-neutral-100">
                  {user && isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-3 py-3 bg-neutral-50 rounded-xl">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-semibold text-sm">
                          {(user.displayName || user.firstName || user.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-neutral-900 text-sm truncate">
                            {user.displayName || user.firstName || "User"}
                          </div>
                          <div className="text-xs text-neutral-500 truncate">{user.email}</div>
                        </div>
                      </div>
                      <button onClick={handleSettingsClick} className="w-full flex items-center gap-3 px-3 py-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors text-sm">
                        <FaCog /> Settings
                      </button>
                      <button onClick={handleFavoritesClick} className="w-full flex items-center gap-3 px-3 py-3 text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors text-sm">
                        <FaHeart /> Favorites
                      </button>
                      <button onClick={handleLogout} disabled={loading} className="w-full flex items-center gap-3 px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm">
                        <FaSignOutAlt /> {loading ? "Logging out..." : "Sign Out"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/signin" className="block">
                        <button onClick={() => setMenuOpen(false)} className="w-full py-3 border border-neutral-800 text-neutral-800 rounded-full text-sm font-medium tracking-wide uppercase">
                          Login
                        </button>
                      </Link>
                      <Link to="/signup" className="block">
                        <button onClick={() => setMenuOpen(false)} className="w-full py-3 bg-neutral-800 text-white rounded-full text-sm font-medium tracking-wide uppercase hover:bg-neutral-900 transition-colors">
                          Sign Up
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
