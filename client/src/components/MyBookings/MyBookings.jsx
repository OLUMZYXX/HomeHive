import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../../contexts/APIContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEye,
  FaHome,
  FaFilter,
  FaExclamationTriangle,
  FaCreditCard,
} from "react-icons/fa";
import { HiArrowLeft, HiArrowRight, HiRefresh } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  FloatingElement,
} from "../common/AnimatedComponents";

// Cancel Booking Modal Component
const CancelBookingModal = ({ isOpen, onClose, onConfirm, bookingTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-md w-full mx-auto shadow-2xl border border-primary-100"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaExclamationTriangle className="text-red-500 text-3xl" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Cancel Booking?
              </h3>

              <p className="text-gray-600 text-lg mb-2 leading-relaxed">
                Are you sure you want to cancel your booking for:
              </p>

              <p className="text-gray-800 font-semibold mb-6 bg-primary-50 px-4 py-2 rounded-xl">
                {bookingTitle}
              </p>

              <p className="text-red-600 text-sm mb-8 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                This action cannot be undone. You may be subject to cancellation
                fees.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Keep Booking
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

CancelBookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  bookingTitle: PropTypes.string.isRequired,
};

// Booking status component
const BookingStatus = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          icon: FaCheckCircle,
          text: "Confirmed",
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-300",
        };
      case "cancelled":
        return {
          icon: FaTimesCircle,
          text: "Cancelled",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-300",
        };
      case "pending":
        return {
          icon: FaHourglassHalf,
          text: "Pending",
          bgColor: "bg-amber-100",
          textColor: "text-amber-700",
          borderColor: "border-amber-300",
        };
      default:
        return {
          icon: FaClock,
          text: status || "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-300",
        };
    }
  };

  const {
    icon: Icon,
    text,
    bgColor,
    textColor,
    borderColor,
  } = getStatusConfig();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${bgColor} ${borderColor} ${textColor} font-semibold text-sm`}
    >
      <Icon className="text-xs" />
      <span>{text}</span>
    </div>
  );
};

BookingStatus.propTypes = {
  status: PropTypes.string,
};

// Individual booking card component
const BookingCard = ({ booking, onViewProperty, onCancelBooking, index }) => {
  const { convertFromCurrency, selectedCurrencyData } = useCurrency();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const calculateNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    try {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return 0;
      return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  const nights = calculateNights();
  let amount = Number(booking.totalAmount);
  if (isNaN(amount) || amount < 0) amount = 0;
  const currency = booking.currency || "NGN";
  let convertedAmount = convertFromCurrency(amount, currency);
  if (isNaN(convertedAmount) || convertedAmount < 0) convertedAmount = 0;

  return (
    <StaggerItem index={index}>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
      >
        {/* Property Image Header */}
        <div className="relative h-52 overflow-hidden">
          {booking.propertyImages && booking.propertyImages.length > 0 ? (
            <img
              src={booking.propertyImages[0]}
              alt={booking.propertyTitle || "Property"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center"
            style={{
              display:
                booking.propertyImages && booking.propertyImages.length > 0
                  ? "none"
                  : "flex",
            }}
          >
            <FaHome className="text-6xl text-primary-400" />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <BookingStatus status={booking.status} />
          </div>

          {/* Property Info on Image */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
              {booking.propertyTitle ||
                `Booking #${booking._id?.substring(0, 8) || booking.id?.substring(0, 8) || "N/A"}`}
            </h3>
            {booking.propertyLocation && (
              <div className="flex items-center gap-2 text-white/90">
                <FaMapMarkerAlt className="text-sm flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {booking.propertyLocation}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-5">
          {/* Booking Details Grid */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <FaCalendarAlt className="text-blue-500 mx-auto mb-1" />
              <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                Check-in
              </div>
              <div className="text-xs font-bold text-blue-900 mt-1">
                {formatDate(booking.checkIn)}
              </div>
            </div>

            <div className="text-center p-3 bg-emerald-50 rounded-xl">
              <FaCalendarAlt className="text-emerald-500 mx-auto mb-1" />
              <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">
                Check-out
              </div>
              <div className="text-xs font-bold text-emerald-900 mt-1">
                {formatDate(booking.checkOut)}
              </div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <FaUsers className="text-purple-500 mx-auto mb-1" />
              <div className="text-[10px] font-semibold text-purple-600 uppercase tracking-wide">
                Guests
              </div>
              <div className="text-xs font-bold text-purple-900 mt-1">
                {booking.guests || 1}
              </div>
            </div>

            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <FaClock className="text-amber-500 mx-auto mb-1" />
              <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">
                Nights
              </div>
              <div className="text-xs font-bold text-amber-900 mt-1">
                {nights > 0 ? nights : "N/A"}
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-xl p-4 mb-5 border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">
                  Total Amount
                </div>
                <div className="text-2xl font-bold text-primary-900">
                  {selectedCurrencyData.symbol}
                  {Math.round(convertedAmount).toLocaleString()}
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">💰</span>
              </div>
            </div>
          </div>

          {/* Booking Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-5 px-2">
            <div className="flex items-center gap-1.5">
              <FaClock className="text-[10px]" />
              <span>Booked: {formatDate(booking.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {booking.propertyId && (
              <button
                onClick={() => onViewProperty(booking.propertyId)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-xl hover:bg-primary-100 hover:border-primary-300 transition-all duration-300"
              >
                <FaEye className="text-sm" />
                View
              </button>
            )}

            {booking.status === "pending" &&
              booking.paymentStatus !== "paid" && (
                <>
                  <button
                    onClick={() => onCancelBooking(booking)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-300"
                  >
                    <FaTimesCircle className="text-sm" />
                    Cancel
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:shadow-lg"
                    onClick={() =>
                      navigate("/checkout", { state: { bookingData: booking } })
                    }
                  >
                    <FaCreditCard className="text-sm" />
                    Pay
                  </button>
                </>
              )}
          </div>
        </div>
      </motion.div>
    </StaggerItem>
  );
};

BookingCard.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    status: PropTypes.string,
    paymentStatus: PropTypes.string,
    propertyTitle: PropTypes.string,
    propertyLocation: PropTypes.string,
    propertyId: PropTypes.string,
    propertyImages: PropTypes.array,
    checkIn: PropTypes.string,
    checkOut: PropTypes.string,
    guests: PropTypes.number,
    totalAmount: PropTypes.number,
    currency: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onViewProperty: PropTypes.func.isRequired,
  onCancelBooking: PropTypes.func.isRequired,
  index: PropTypes.number,
};

// Filter Tab Component
const FilterTab = ({ tab, isActive, onClick, count }) => {
  const Icon = tab.icon;
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-200"
          : "text-gray-600 hover:text-primary-700 hover:bg-primary-50"
      }`}
    >
      <Icon
        className={`text-sm ${isActive ? "text-white" : "text-gray-400 group-hover:text-primary-500"}`}
      />
      <span>{tab.label}</span>
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
};

FilterTab.propTypes = {
  tab: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

const MyBookings = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    getBookings,
    cancelBooking,
    bookings: contextBookings,
  } = useAPI();

  const [localBookings, setLocalBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // Use context bookings or local bookings
  const bookings =
    contextBookings && contextBookings.length > 0
      ? contextBookings
      : localBookings;

  console.log("📊 MyBookings - contextBookings:", contextBookings);
  console.log("📊 MyBookings - localBookings:", localBookings);
  console.log("📊 MyBookings - final bookings:", bookings);

  // Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const handleCancelBookingClick = (booking) => {
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      setCancelModalOpen(false);
      setLoading(true);

      const bookingIdToCancel = bookingToCancel._id || bookingToCancel.id;
      await cancelBooking(bookingIdToCancel);

      // Refetch bookings to get the updated list from the server
      await getBookings();

      toast.success("Booking cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      let errorMessage = "Failed to cancel booking. Please try again.";
      if (error.response?.status === 403) {
        errorMessage = "You do not have permission to cancel this booking.";
      } else if (error.response?.status === 404) {
        errorMessage = "Booking not found.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setBookingToCancel(null);
    }
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setBookingToCancel(null);
  };

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) {
        console.log("❌ User not authenticated, redirecting to signin");
        navigate("/signin");
        return;
      }

      if (!user || (!user.id && !user.uid && !user.email)) {
        console.log("❌ No valid user data:", user);
        toast.error("Unable to load user data. Please try logging in again.");
        navigate("/signin");
        return;
      }

      try {
        console.log("🔄 Fetching bookings for user:", user);
        setLoading(true);
        setError(null);
        const userBookings = await getBookings();
        console.log("✅ Bookings received:", userBookings);
        setLocalBookings(userBookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load bookings";
        setError(errorMessage);

        if (err.response?.status === 401) {
          toast.error("Authentication expired. Please log in again.");
          navigate("/signin");
        } else if (err.response?.status === 403) {
          toast.error("Access denied. Please check your permissions.");
        } else if (err.response?.status >= 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, user, navigate, getBookings]);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status?.toLowerCase() === filter.toLowerCase();
  });

  const handleViewProperty = (propertyId) => {
    navigate(`/listing/${propertyId}`);
  };

  const getFilterCount = (status) => {
    if (status === "all") return bookings.length;
    return bookings.filter(
      (b) => b.status?.toLowerCase() === status.toLowerCase(),
    ).length;
  };

  const filterTabs = [
    { key: "all", label: "All", icon: FaHome },
    { key: "pending", label: "Pending", icon: FaHourglassHalf },
    { key: "confirmed", label: "Confirmed", icon: FaCheckCircle },
    { key: "cancelled", label: "Cancelled", icon: FaTimesCircle },
  ];

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="overflow-x-hidden bg-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <FaHome className="text-primary-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary-800 mb-2">
              Please Login
            </h2>
            <p className="text-primary-600 mb-6">
              You need to be logged in to view your bookings.
            </p>
            <button
              onClick={() => navigate("/signin")}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-300"
            >
              Go to Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-50 via-white to-neutral-50 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <FloatingElement
              direction="y"
              distance={20}
              duration={6}
              className="absolute -top-20 -right-20 w-72 h-72 bg-primary-100 rounded-full opacity-40 blur-3xl"
            />
            <FloatingElement
              direction="x"
              distance={15}
              duration={8}
              className="absolute -bottom-20 -left-20 w-80 h-80 bg-neutral-100 rounded-full opacity-40 blur-3xl"
            />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 pt-20 pb-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Left: Back Button & Title */}
                <div>
                  <button
                    onClick={() => navigate("/listings")}
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-3 group"
                  >
                    <HiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                    Back to Listings
                  </button>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    My{" "}
                    <span className="text-transparent bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text">
                      Bookings
                    </span>
                  </h1>
                  <p className="text-base text-gray-600">
                    Manage your reservations and track your upcoming stays
                  </p>
                </div>

                {/* Right: Stats */}
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4 text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {bookings.length}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      Total Bookings
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4 text-center">
                    <div className="text-3xl font-bold text-emerald-600">
                      {getFilterCount("confirmed")}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      Confirmed
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-gradient-to-b from-white to-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl">
            {/* Filter Tabs */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="flex flex-wrap items-center gap-3 mb-10 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
                {filterTabs.map((tab) => (
                  <FilterTab
                    key={tab.key}
                    tab={tab}
                    isActive={filter === tab.key}
                    onClick={() => setFilter(tab.key)}
                    count={getFilterCount(tab.key)}
                  />
                ))}
              </div>
            </ScrollReveal>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-20"
              >
                <div className="text-center bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-primary-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Loading Your Bookings
                  </h3>
                  <p className="text-gray-500">
                    Please wait while we fetch your reservations...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
              <ScrollReveal direction="up">
                <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaTimesCircle className="text-red-500 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-800 mb-2">
                        Unable to Load Bookings
                      </h3>
                      <p className="text-red-600 mb-4">{error}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300"
                      >
                        <HiRefresh />
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Empty State - No Bookings */}
            {!loading &&
              !error &&
              filteredBookings.length === 0 &&
              bookings.length === 0 && (
                <ScrollReveal direction="up">
                  <div className="text-center py-16">
                    <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 max-w-xl mx-auto">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCalendarAlt className="text-primary-500 text-4xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        No Bookings Yet
                      </h3>
                      <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                        Ready to discover amazing places? Start exploring our
                        curated collection of properties!
                      </p>
                      <button
                        onClick={() => navigate("/listings")}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:shadow-lg group"
                      >
                        <FaHome />
                        Explore Properties
                        <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              )}

            {/* Empty State - No Results for Filter */}
            {!loading &&
              !error &&
              filteredBookings.length === 0 &&
              bookings.length > 0 && (
                <ScrollReveal direction="up">
                  <div className="text-center py-16">
                    <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaFilter className="text-gray-400 text-2xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        No {filter !== "all" ? filter : ""} bookings found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Try changing the filter to see other bookings.
                      </p>
                      <button
                        onClick={() => setFilter("all")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary-700 font-semibold rounded-xl hover:bg-primary-100 transition-all duration-300"
                      >
                        Show All Bookings
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              )}

            {/* Bookings Grid */}
            {!loading && !error && filteredBookings.length > 0 && (
              <StaggerContainer staggerDelay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBookings.map((booking, index) => (
                    <BookingCard
                      key={booking._id || booking.id || index}
                      booking={booking}
                      onViewProperty={handleViewProperty}
                      onCancelBooking={handleCancelBookingClick}
                      index={index}
                    />
                  ))}
                </div>
              </StaggerContainer>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={cancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={confirmCancelBooking}
        bookingTitle={
          bookingToCancel?.propertyTitle ||
          `Booking #${bookingToCancel?._id?.substring(0, 8) || bookingToCancel?.id?.substring(0, 8) || "N/A"}`
        }
      />
    </div>
  );
};

export default MyBookings;
