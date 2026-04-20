import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HomeHiveLogo from "../../assets/HomeHiveLogo";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import {
  FaCog,
  FaSignOutAlt,
  FaHeart,
  FaCalendarCheck,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { navigateToHome } from "../../utils/navigation";
import { useAPI } from "../../contexts/APIContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { TokenManager } from "../../services/jwtAuthService";
import { toast } from "../../utils/toast.jsx";

/* ─── Animation variants ────────────────────────────────────────────────── */
const drawerVariants = {
  hidden:  { x: "100%", opacity: 0.6 },
  visible: { x: 0,       opacity: 1,   transition: { type: "spring", damping: 28, stiffness: 280 } },
  exit:    { x: "100%",  opacity: 0,   transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
};

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: 24 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.055, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
};

const dropdownVariants = {
  hidden:  { opacity: 0, scaleY: 0.92, y: -6, originY: 0 },
  visible: { opacity: 1, scaleY: 1,    y: 0,   transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scaleY: 0.92, y: -6,   transition: { duration: 0.13 } },
};

/* ─── Hamburger Icon (animates to X) ────────────────────────────────────── */
function Hamburger({ open }) {
  const cls = "block h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center";
  return (
    <div className="w-5 flex flex-col gap-[5px]">
      <span className={`${cls} ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
      <span className={`${cls} ${open ? "opacity-0 scale-x-0" : ""}`} />
      <span className={`${cls} ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
const Navbar = () => {
  const { user, isAuthenticated, logout: apiLogout, loading, error, clearError } = useAPI();
  const { selectedCurrency, setSelectedCurrency, selectedCurrencyData, currencies } = useCurrency();

  const [menuOpen,           setMenuOpen]           = useState(false);
  const [isSearching,        setIsSearching]        = useState(false);
  const [searchQuery,        setSearchQuery]        = useState("");
  const [scrolled,           setScrolled]           = useState(false);
  const [lastScrollY,        setLastScrollY]        = useState(0);
  const [visible,            setVisible]            = useState(true);
  const [profileMenuOpen,    setProfileMenuOpen]    = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [mobileCurrencyOpen, setMobileCurrencyOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const navigate  = useNavigate();
  const location  = useLocation();
  const isHome    = location.pathname === "/";
  const isHostRoute = /^\/(host|hostlogin|host-signup|host-dashboard)/i.test(location.pathname);
  const signInPath  = isHostRoute ? "/hostlogin"   : "/signin";
  const signUpPath  = isHostRoute ? "/host-signup" : "/signup";

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => { TokenManager.initialize(); }, []);
  useEffect(() => { if (error) { toast.error(error); clearError(); } }, [error, clearError]);

  useEffect(() => {
    const handler = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setProfileMenuOpen(false);
      if (!e.target.closest(".currency-dropdown")) setCurrencyDropdownOpen(false);
    };
    if (profileMenuOpen || currencyDropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenuOpen, currencyDropdownOpen]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      if (y > lastScrollY && y > 80) { setVisible(false); setMenuOpen(false); }
      else setVisible(true);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  /* ── handlers ── */
  const closeMenu = () => setMenuOpen(false);

  const go = (path, opts) => { navigate(path, opts); closeMenu(); };

  const handleHomeNavigation  = () => { navigateToHome(navigate, location); closeMenu(); };
  const navigateToHost        = () => go("/Host");

  const handleBookingClick = (e) => {
    e?.preventDefault();
    if (!isAuthenticated) { localStorage.setItem("redirectAfterLogin", "/listings"); toast.info("Please log in"); go("/signin"); return; }
    go("/listings", { state: { smoothScroll: true } });
  };
  const handleFavoritesClick = () => {
    if (!isAuthenticated) { localStorage.setItem("redirectAfterLogin", "/favorites"); toast.info("Please log in"); go("/signin"); return; }
    go("/favorites"); setProfileMenuOpen(false);
  };
  const handleBookingsClick = () => {
    if (!isAuthenticated) { localStorage.setItem("redirectAfterLogin", "/my-bookings"); toast.info("Please log in"); go("/signin"); return; }
    go("/my-bookings"); setProfileMenuOpen(false);
  };
  const handleSettingsClick = () => {
    if (!isAuthenticated) { toast.info("Please log in"); go("/signin"); return; }
    go("/profile/settings"); setProfileMenuOpen(false);
  };
  const handleLogout = async () => {
    try { await apiLogout(false); toast.success("Logged out"); closeMenu(); setProfileMenuOpen(false); navigate("/"); }
    catch { toast.error("Logout failed."); }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setIsSearching(false); setSearchQuery(""); closeMenu(); }
  };

  const isTransparent = isHome && !scrolled && !menuOpen;
  const textColor     = isTransparent ? "text-white" : "text-neutral-900";
  const initial       = (user?.displayName || user?.firstName || user?.email || "U").charAt(0).toUpperCase();

  const navLinks = [
    { label: "Explore",      action: handleHomeNavigation },
    { label: "Listings",     action: handleBookingClick   },
    { label: "My Bookings",  action: handleBookingsClick  },
    { label: "Become a Host",action: navigateToHost       },
  ];

  const profileActions = [
    { icon: FaCog,           label: "Settings",    action: handleSettingsClick  },
    { icon: FaHeart,         label: "Favourites",  action: handleFavoritesClick },
    { icon: FaCalendarCheck, label: "My Bookings", action: handleBookingsClick  },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${
          isTransparent
            ? "bg-transparent"
            : "bg-white border-b border-neutral-200"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">

            {/* ── Logo ─────────────────────────────────────────── */}
            <button onClick={handleHomeNavigation} className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className={isTransparent ? "brightness-0 invert" : ""}>
                <HomeHiveLogo className="w-9 h-9 object-contain" alt="HomeHive" />
              </div>
              <span className={`font-Cormorant text-[1.4rem] font-semibold tracking-wide ${textColor}`}>
                HomeHive
              </span>
            </button>

            {/* ── Desktop centre ────────────────────────────────── */}
            <div className="hidden lg:flex items-center flex-1 justify-center mx-10">
              {isSearching ? (
                <form onSubmit={handleSearch}
                  className={`flex items-center gap-2 border px-5 py-2.5 min-w-[420px] ${
                    isTransparent ? "bg-white/10 backdrop-blur-sm border-white/30" : "bg-white border-neutral-300"
                  }`}
                >
                  <CiSearch className={`text-lg flex-shrink-0 ${isTransparent ? "text-white/70" : "text-neutral-400"}`} />
                  <input
                    autoFocus type="text" placeholder="Search accommodations…"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className={`flex-1 bg-transparent focus:outline-none text-sm ${
                      isTransparent ? "text-white placeholder-white/50" : "text-neutral-800 placeholder-neutral-400"
                    }`}
                  />
                  <button type="button" onClick={() => { setIsSearching(false); setSearchQuery(""); }}>
                    <IoClose className={`text-lg ${isTransparent ? "text-white/70" : "text-neutral-400"} hover:opacity-70`} />
                  </button>
                </form>
              ) : (
                <ul className="flex items-center gap-9">
                  {navLinks.map((l) => (
                    <li key={l.label}>
                      <button
                        onClick={l.action}
                        className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-opacity hover:opacity-60 ${textColor}`}
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Desktop right ─────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
              {!isSearching && (
                <button onClick={() => setIsSearching(true)} className={`transition-opacity hover:opacity-60 ${textColor}`} aria-label="Search">
                  <CiSearch className="text-[22px]" />
                </button>
              )}

              {user && isAuthenticated ? (
                <>
                  {/* Currency */}
                  <div className="relative currency-dropdown">
                    <button
                      onClick={() => setCurrencyDropdownOpen((o) => !o)}
                      className={`flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase transition-opacity hover:opacity-60 ${textColor}`}
                    >
                      <span>{selectedCurrencyData?.symbol}</span>
                      <span>{selectedCurrency}</span>
                      <FaChevronDown className={`text-[9px] ml-0.5 transition-transform duration-200 ${currencyDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {currencyDropdownOpen && (
                        <motion.div
                          variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                          className="absolute top-full right-0 mt-3 w-52 bg-white border border-neutral-200 shadow-xl z-50 overflow-hidden origin-top"
                        >
                          {currencies.map((c) => (
                            <button key={c.code} onClick={() => { setSelectedCurrency(c.code); setCurrencyDropdownOpen(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-neutral-50 ${
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

                  {/* Avatar */}
                  <button
                    onClick={() => setProfileMenuOpen((o) => !o)}
                    className={`relative w-9 h-9 rounded-full border overflow-hidden flex-shrink-0 focus:outline-none ${
                      isTransparent ? "border-white/40" : "border-neutral-300"
                    }`}
                    aria-label="Profile menu"
                  >
                    {user.profilePicture || user.photoURL ? (
                      <img src={user.profilePicture || user.photoURL} alt="Profile"
                        className="w-full h-full object-cover" loading="lazy"
                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white text-sm font-semibold"
                      style={{ display: user.profilePicture || user.photoURL ? "none" : "flex" }}>
                      {initial}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to={signInPath}>
                    <span className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-opacity hover:opacity-60 ${textColor}`}>
                      {isHostRoute ? "Host Login" : "Login"}
                    </span>
                  </Link>
                  <Link to={signUpPath}>
                    <span className={`px-5 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase border transition-colors duration-200 ${
                      isTransparent
                        ? "border-white text-white hover:bg-white hover:text-neutral-900"
                        : "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                    }`}>
                      {isHostRoute ? "Host Sign Up" : "Sign Up"}
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile: right side ───────────────────────────── */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Search icon */}
              <button
                onClick={() => { setIsSearching(true); setMenuOpen(true); }}
                className={`p-1.5 transition-opacity hover:opacity-60 ${textColor}`}
                aria-label="Search"
              >
                <CiSearch className="text-[22px]" />
              </button>

              {/* Avatar (mobile, shown when logged in) */}
              {user && isAuthenticated && (
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className={`relative w-8 h-8 rounded-full border overflow-hidden flex-shrink-0 ${
                    isTransparent ? "border-white/40" : "border-neutral-300"
                  }`}
                >
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white text-xs font-semibold">
                    {initial}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-amber-400 rounded-full border border-white" />
                </button>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className={`p-1.5 transition-opacity hover:opacity-60 ${textColor}`}
                aria-label="Toggle menu"
              >
                <Hamburger open={menuOpen} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop: Profile dropdown ─────────────────────────── */}
        <AnimatePresence>
          {profileMenuOpen && user && isAuthenticated && (
            <motion.div
              ref={profileMenuRef}
              variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
              className="absolute right-8 top-[74px] w-72 bg-white border border-neutral-200 shadow-2xl z-50 overflow-hidden origin-top"
            >
              <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 text-sm truncate">{user.displayName || user.firstName || "User"}</p>
                  <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                </div>
              </div>
              <div className="py-1.5">
                {profileActions.map(({ icon: Icon, label, action }) => (
                  <button key={label} onClick={action}
                    className="w-full flex items-center gap-3 px-5 py-3 text-neutral-700 hover:bg-neutral-50 transition-colors text-left">
                    <Icon className="text-neutral-400 text-sm flex-shrink-0" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
                <div className="mx-5 my-1 border-t border-neutral-100" />
                <button onClick={handleLogout} disabled={loading}
                  className="w-full flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 transition-colors text-left">
                  <FaSignOutAlt className="text-sm flex-shrink-0" />
                  <span className="text-sm font-medium">{loading ? "Logging out…" : "Sign Out"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              variants={backdropVariants} initial="hidden" animate="visible" exit="exit"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
              onClick={closeMenu}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              variants={drawerVariants} initial="hidden" animate="visible" exit="exit"
              className="fixed top-0 right-0 bottom-0 z-50 w-[82vw] max-w-sm bg-white flex flex-col lg:hidden shadow-2xl"
            >
              {/* ── Drawer header ─────────────────────────────── */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-100 flex-shrink-0">
                <span className="font-Cormorant text-xl font-semibold text-neutral-900 tracking-wide">Menu</span>
                <button
                  onClick={closeMenu}
                  className="w-9 h-9 flex items-center justify-center border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                  aria-label="Close menu"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>

              {/* ── Drawer body (scrollable) ───────────────────── */}
              <div className="flex-1 overflow-y-auto overscroll-contain">

                {/* Search bar */}
                <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="px-6 pt-6 pb-4">
                  <form onSubmit={handleSearch} className="flex items-center gap-2 border border-neutral-200 px-4 py-3 bg-neutral-50">
                    <CiSearch className="text-neutral-400 text-lg flex-shrink-0" />
                    <input
                      type="text" placeholder="Search accommodations…"
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none"
                      autoFocus={isSearching}
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery("")}>
                        <IoClose className="text-neutral-400 text-base" />
                      </button>
                    )}
                  </form>
                </motion.div>

                {/* Nav links */}
                <div className="px-3 pb-2">
                  {navLinks.map((link, i) => (
                    <motion.button
                      key={link.label}
                      custom={i + 1} variants={itemVariants} initial="hidden" animate="visible"
                      onClick={link.action}
                      className="w-full flex items-center justify-between px-4 py-4 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-150 group"
                    >
                      <span className="text-[13px] font-semibold tracking-[0.12em] uppercase">{link.label}</span>
                      <FaChevronRight className="text-[10px] text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                    </motion.button>
                  ))}
                </div>

                {/* Divider */}
                <motion.div custom={navLinks.length + 1} variants={itemVariants} initial="hidden" animate="visible"
                  className="mx-6 border-t border-neutral-100 my-2" />

                {/* ── Auth section ───────────────────────────── */}
                {user && isAuthenticated ? (
                  <>
                    {/* User card */}
                    <motion.div custom={navLinks.length + 2} variants={itemVariants} initial="hidden" animate="visible"
                      className="mx-6 mb-3 flex items-center gap-3 p-4 bg-neutral-50 border border-neutral-100">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 truncate">
                          {user.displayName || user.firstName || "User"}
                        </p>
                        <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                      </div>
                      <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                    </motion.div>

                    {/* Profile actions */}
                    <div className="px-3">
                      {profileActions.map(({ icon: Icon, label, action }, i) => (
                        <motion.button
                          key={label}
                          custom={navLinks.length + 3 + i} variants={itemVariants} initial="hidden" animate="visible"
                          onClick={action}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-150 group"
                        >
                          <Icon className="text-neutral-400 text-sm flex-shrink-0 group-hover:text-neutral-600 transition-colors" />
                          <span className="text-sm font-medium">{label}</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Currency in mobile */}
                    <motion.div custom={navLinks.length + 6} variants={itemVariants} initial="hidden" animate="visible"
                      className="mx-6 mt-2">
                      <button
                        onClick={() => setMobileCurrencyOpen((o) => !o)}
                        className="w-full flex items-center justify-between px-4 py-3.5 text-neutral-700 hover:bg-neutral-50 transition-colors border border-neutral-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-800">{selectedCurrencyData?.symbol}</span>
                          <span className="text-sm font-medium">{selectedCurrency} — {selectedCurrencyData?.name}</span>
                        </div>
                        <FaChevronDown className={`text-[10px] text-neutral-400 transition-transform duration-200 ${mobileCurrencyOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileCurrencyOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                            exit={{ height: 0, opacity: 0, transition: { duration: 0.18 } }}
                            className="overflow-hidden border border-t-0 border-neutral-100"
                          >
                            {currencies.map((c) => (
                              <button
                                key={c.code}
                                onClick={() => { setSelectedCurrency(c.code); setMobileCurrencyOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 ${
                                  selectedCurrency === c.code ? "bg-neutral-50 border-l-2 border-neutral-900" : ""
                                }`}
                              >
                                <span className="font-bold text-neutral-800 w-5 text-center">{c.symbol}</span>
                                <span className="text-sm text-neutral-700">{c.code}</span>
                                <span className="text-xs text-neutral-400 ml-1">{c.name}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </>
                ) : (
                  <motion.div custom={navLinks.length + 2} variants={itemVariants} initial="hidden" animate="visible"
                    className="px-6 space-y-3">
                    <Link to={signInPath} onClick={closeMenu} className="block">
                      <span className="block w-full py-3.5 text-center text-[11px] font-semibold tracking-[0.15em] uppercase border border-neutral-900 text-neutral-900 hover:bg-neutral-50 transition-colors">
                        {isHostRoute ? "Host Login" : "Login"}
                      </span>
                    </Link>
                    <Link to={signUpPath} onClick={closeMenu} className="block">
                      <span className="block w-full py-3.5 text-center text-[11px] font-semibold tracking-[0.15em] uppercase bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
                        {isHostRoute ? "Host Sign Up" : "Sign Up"}
                      </span>
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* ── Drawer footer ─────────────────────────────── */}
              {user && isAuthenticated && (
                <div className="flex-shrink-0 px-6 py-5 border-t border-neutral-100 bg-white">
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors duration-150 disabled:opacity-50"
                  >
                    <FaSignOutAlt className="text-xs" />
                    {loading ? "Logging out…" : "Sign Out"}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
