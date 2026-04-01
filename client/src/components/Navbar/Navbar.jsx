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
  FaCalendarCheck,
  FaBook,
  FaChevronDown,
} from "react-icons/fa";
import { navigateToHome } from "../../utils/navigation";
import { useAPI } from "../../contexts/APIContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { TokenManager } from "../../services/jwtAuthService";
import { toast } from "../../utils/toast.jsx";

const Navbar = () => {
  const { user, isAuthenticated, logout: apiLogout, loading, error, clearError } = useAPI();
  const { selectedCurrency, setSelectedCurrency, selectedCurrencyData, currencies } = useCurrency();

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

  useEffect(() => { TokenManager.initialize(); }, []);

  useEffect(() => {
    if (error) { toast.error(error); clearError(); }
  }, [error, clearError]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
      if (!e.target.closest(".currency-dropdown")) {
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
      const y = window.scrollY;
      setScrolled(y > 60);
      if (y > lastScrollY && y > 80) { setVisible(false); setMenuOpen(false); }
      else setVisible(true);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleHomeNavigation = () => { navigateToHome(navigate, location); setMenuOpen(false); };
  const navigateToHost = () => navigate("/Host");

  const handleLogout = async () => {
    try {
      await apiLogout(false);
      toast.success("Logged out successfully");
      setMenuOpen(false); setProfileMenuOpen(false);
      navigate("/");
    } catch { toast.error("Logout failed. Please try again."); }
  };

  const handleBookingClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/listings");
      toast.info("Please log in to view your bookings");
      navigate("/signin"); return;
    }
    navigate("/listings", { state: { smoothScroll: true } });
    setMenuOpen(false);
  };

  const handleFavoritesClick = () => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/favorites");
      toast.info("Please log in to view your favorites");
      navigate("/signin"); return;
    }
    navigate("/favorites"); setMenuOpen(false); setProfileMenuOpen(false);
  };

  const handleBookingsClick = () => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/my-bookings");
      toast.info("Please log in to view your bookings");
      navigate("/signin"); return;
    }
    navigate("/my-bookings"); setMenuOpen(false); setProfileMenuOpen(false);
  };

  const handleSettingsClick = () => {
    if (!isAuthenticated) { toast.info("Please log in to access settings"); navigate("/signin"); return; }
    navigate("/profile/settings"); setMenuOpen(false); setProfileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearching(false); setSearchQuery(""); setMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Explore",     action: handleHomeNavigation },
    { name: "Listings",    action: handleBookingClick   },
    { name: "My Bookings", action: handleBookingsClick  },
  ];

  const isTransparent = isHome && !scrolled && !menuOpen;
  const textColor = isTransparent ? "text-white" : "text-neutral-900";
  const mutedColor = isTransparent ? "text-white/70" : "text-neutral-500";

  // Avatar initial
  const initial = (user?.displayName || user?.firstName || user?.email || "U").charAt(0).toUpperCase();

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        isTransparent
          ? "bg-transparent"
          : "bg-white border-b border-neutral-200"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-[70px]">

          {/* ── Logo ─────────────────────────────────────────── */}
          <button
            onClick={handleHomeNavigation}
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className={isTransparent ? "brightness-0 invert" : ""}>
              <HomeHiveLogo className="w-9 h-9 object-contain" alt="HomeHive" />
            </div>
            <span className={`font-Cormorant text-2xl font-semibold tracking-wide ${textColor}`}>
              HomeHive
            </span>
          </button>

          {/* ── Desktop Centre: Nav or Search ────────────────── */}
          <div className="hidden lg:flex items-center flex-1 justify-center mx-10">
            {isSearching ? (
              <form
                onSubmit={handleSearch}
                className={`flex items-center gap-2 border px-5 py-2 min-w-[420px] ${
                  isTransparent
                    ? "bg-white/10 backdrop-blur-sm border-white/30"
                    : "bg-white border-neutral-300"
                }`}
              >
                <CiSearch className={`text-lg flex-shrink-0 ${mutedColor}`} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search accommodations…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 bg-transparent focus:outline-none text-sm ${
                    isTransparent ? "text-white placeholder-white/50" : "text-neutral-800 placeholder-neutral-400"
                  }`}
                />
                <button type="button" onClick={() => { setIsSearching(false); setSearchQuery(""); }}>
                  <IoClose className={`text-lg ${mutedColor} hover:opacity-70`} />
                </button>
              </form>
            ) : (
              <ul className="flex items-center gap-9">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={link.action}
                      className={`text-xs font-semibold tracking-[0.15em] uppercase transition-opacity duration-200 hover:opacity-60 ${textColor}`}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
                {isHome && (
                  <li>
                    <button
                      onClick={navigateToHost}
                      className={`text-xs font-semibold tracking-[0.15em] uppercase transition-opacity duration-200 hover:opacity-60 ${textColor}`}
                    >
                      Become a Host
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* ── Desktop Right ─────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
            {/* Search icon */}
            {!isSearching && (
              <button
                onClick={() => setIsSearching(true)}
                className={`transition-opacity hover:opacity-60 ${textColor}`}
                aria-label="Search"
              >
                <CiSearch className="text-[22px]" />
              </button>
            )}

            {user && isAuthenticated ? (
              <>
                {/* Currency */}
                <div className="relative currency-dropdown">
                  <button
                    onClick={() => setCurrencyDropdownOpen((o) => !o)}
                    className={`flex items-center gap-1 text-xs font-semibold tracking-wide uppercase transition-opacity hover:opacity-60 ${textColor}`}
                  >
                    <span>{selectedCurrencyData?.symbol}</span>
                    <span>{selectedCurrency}</span>
                    <FaChevronDown className={`text-[9px] transition-transform duration-200 ${currencyDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {currencyDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-3 w-52 bg-white border border-neutral-200 shadow-xl z-50 overflow-hidden"
                      >
                        {currencies.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => { setSelectedCurrency(c.code); setCurrencyDropdownOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 hover:bg-neutral-50 ${
                              selectedCurrency === c.code ? "bg-neutral-50 border-l-2 border-neutral-900" : ""
                            }`}
                          >
                            <span className="w-6 text-center font-bold text-neutral-800 text-base">{c.symbol}</span>
                            <div>
                              <div className="text-xs font-semibold text-neutral-900">{c.code}</div>
                              <div className="text-[11px] text-neutral-400">{c.name}</div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Avatar button */}
                <button
                  onClick={() => setProfileMenuOpen((o) => !o)}
                  className={`relative w-9 h-9 rounded-full border overflow-hidden flex-shrink-0 focus:outline-none ${
                    isTransparent ? "border-white/40" : "border-neutral-300"
                  }`}
                  aria-label="Profile menu"
                >
                  {user.profilePicture || user.photoURL ? (
                    <img
                      src={user.profilePicture || user.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full bg-neutral-900 flex items-center justify-center text-white text-sm font-semibold"
                    style={{ display: user.profilePicture || user.photoURL ? "none" : "flex" }}
                  >
                    {initial}
                  </div>
                  {/* Online dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/signin">
                  <span className={`text-xs font-semibold tracking-[0.15em] uppercase transition-opacity hover:opacity-60 ${textColor}`}>
                    Login
                  </span>
                </Link>
                <Link to="/signup">
                  <span
                    className={`px-5 py-2 text-xs font-semibold tracking-[0.15em] uppercase border transition-colors duration-200 ${
                      isTransparent
                        ? "border-white text-white hover:bg-white hover:text-neutral-900"
                        : "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    Sign Up
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ──────────────────────────────── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden p-1.5 transition-opacity hover:opacity-70 ${textColor}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <IoClose className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* ── Profile Dropdown ──────────────────────────────────── */}
      <AnimatePresence>
        {profileMenuOpen && user && isAuthenticated && (
          <motion.div
            ref={profileMenuRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-8 top-[74px] w-72 bg-white border border-neutral-200 shadow-2xl z-50 overflow-hidden"
          >
            {/* User info */}
            <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-900 text-sm truncate">
                  {user.displayName || user.firstName || "User"}
                </p>
                <p className="text-xs text-neutral-400 truncate">{user.email}</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              {[
                { icon: FaCog,           label: "Settings",   action: handleSettingsClick },
                { icon: FaHeart,         label: "Favorites",  action: handleFavoritesClick },
                { icon: FaCalendarCheck, label: "My Bookings",action: handleBookingsClick },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full flex items-center gap-3 px-5 py-3 text-neutral-700 hover:bg-neutral-50 transition-colors duration-150 text-left"
                >
                  <Icon className="text-neutral-400 text-sm flex-shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
              <div className="mx-5 my-1 border-t border-neutral-100" />
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 transition-colors duration-150 text-left"
              >
                <FaSignOutAlt className="text-sm flex-shrink-0" />
                <span className="text-sm font-medium">{loading ? "Logging out…" : "Sign Out"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Menu ───────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-t border-neutral-200 overflow-hidden"
          >
            <div className="px-6 py-5 space-y-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 border border-neutral-300 px-4 py-2.5">
                <CiSearch className="text-neutral-400 text-lg flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search accommodations…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none"
                />
                <button type="submit" className="text-neutral-500 hover:text-neutral-900">
                  <CiSearch className="text-base" />
                </button>
              </form>

              {/* Nav links */}
              <nav className="space-y-0.5">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={link.action}
                    className="w-full text-left px-3 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
                  >
                    {link.name}
                  </button>
                ))}
                <button
                  onClick={() => { navigateToHost(); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
                >
                  Become a Host
                </button>
              </nav>

              {/* Divider */}
              <div className="border-t border-neutral-100" />

              {/* Auth / User section */}
              {user && isAuthenticated ? (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-3 px-3 py-3 bg-neutral-50">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {user.displayName || user.firstName || "User"}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  {[
                    { icon: FaCog,           label: "Settings",    action: handleSettingsClick  },
                    { icon: FaHeart,         label: "Favorites",   action: handleFavoritesClick },
                    { icon: FaCalendarCheck, label: "My Bookings", action: handleBookingsClick  },
                  ].map(({ icon: Icon, label, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      className="w-full flex items-center gap-3 px-3 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
                    >
                      <Icon className="text-neutral-400 text-sm" /> {label}
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150"
                  >
                    <FaSignOutAlt className="text-sm" /> {loading ? "Logging out…" : "Sign Out"}
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <Link to="/signin" onClick={() => setMenuOpen(false)} className="block">
                    <span className="block w-full py-3 text-center text-xs font-semibold tracking-[0.15em] uppercase border border-neutral-900 text-neutral-900 hover:bg-neutral-50 transition-colors">
                      Login
                    </span>
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="block">
                    <span className="block w-full py-3 text-center text-xs font-semibold tracking-[0.15em] uppercase bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
                      Sign Up
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
