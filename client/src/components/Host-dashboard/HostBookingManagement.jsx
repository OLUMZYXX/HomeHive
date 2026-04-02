import React, { useState, useEffect } from "react";
import { useAPI } from "../../contexts/APIContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaFilter,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PageLoader } from "../common/Loader";

// Booking status component
const BookingStatus = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          icon: FaCheckCircle,
          text: "Confirmed",
          color: "text-success-600",
          bgColor: "bg-success-100",
          borderColor: "border-success-200",
        };
      case "cancelled":
        return {
          icon: FaTimesCircle,
          text: "Cancelled",
          color: "text-error-600",
          bgColor: "bg-error-100",
          borderColor: "border-error-200",
        };
      case "pending":
        return {
          icon: FaHourglassHalf,
          text: "Pending",
          color: "text-warning-600",
          bgColor: "bg-warning-100",
          borderColor: "border-warning-200",
        };
      default:
        return {
          icon: FaClock,
          text: status || "Unknown",
          color: "text-neutral-600",
          bgColor: "bg-neutral-100",
          borderColor: "border-neutral-200",
        };
    }
  };

  const { icon: Icon, text, color, bgColor, borderColor } = getStatusConfig();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${bgColor} ${borderColor} ${color}`}
    >
      <Icon className="text-sm" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

// Individual booking card for hosts
const HostBookingCard = ({
  booking,
  onUpdateStatus,
  onViewProperty,
  onContactGuest,
}) => {
  const { convertFromCurrency, selectedCurrencyData } = useCurrency();
  const [isUpdating, setIsUpdating] = useState(false);

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
    } catch (error) {
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
    } catch (error) {
      return 0;
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(booking.id, newStatus);
      toast.success(`Booking ${newStatus} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${newStatus} booking`);
    } finally {
      setIsUpdating(false);
    }
  };

  const nights = calculateNights();
  const rawAmount = booking.totalAmount || booking.amount || 0;
  const convertedResult =
    rawAmount && !isNaN(Number(rawAmount))
      ? convertFromCurrency(Number(rawAmount), booking.currency || "NGN")
      : 0;

  // Handle both string (with commas) and number returns from convertFromCurrency
  const parseAmount = (val) => {
    if (typeof val === "string") {
      return parseInt(val.replace(/,/g, ""), 10) || 0;
    }
    return Number(val) || 0;
  };

  // Ensure we have a valid number for display
  const displayAmount = parseAmount(convertedResult);

  const canConfirm = booking.status === "pending";
  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-primary-100 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300 group"
    >
      {/* Top Accent Bar based on status */}
      <div
        className={`h-1 w-full ${
          booking.status === "confirmed"
            ? "bg-gradient-to-r from-success-400 to-emerald-500"
            : booking.status === "pending"
              ? "bg-gradient-to-r from-warning-400 to-amber-500"
              : booking.status === "cancelled"
                ? "bg-gradient-to-r from-error-400 to-red-500"
                : "bg-gradient-to-r from-primary-400 to-primary-500"
        }`}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-primary-800 mb-2 group-hover:text-primary-900 transition-colors">
              {booking.propertyTitle || "Property Booking"}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-primary-600">
              <div className="flex items-center gap-1.5 bg-primary-50 px-2.5 py-1 rounded-full">
                <FaMapMarkerAlt className="text-xs text-primary-500" />
                <span className="font-medium">
                  {booking.propertyLocation || "Location"}
                </span>
              </div>
              {booking.guestName && (
                <div className="flex items-center gap-1.5 bg-primary-50 px-2.5 py-1 rounded-full">
                  <FaUsers className="text-xs text-primary-500" />
                  <span className="font-medium">
                    Guest: {booking.guestName}
                  </span>
                </div>
              )}
            </div>
          </div>
          <BookingStatus status={booking.status} />
        </div>

        {/* Booking Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 bg-neutral-50 rounded-xl p-4">
          {/* Check-in */}
          <div className="text-center md:text-left">
            <div className="text-xs text-primary-500 font-semibold mb-1 uppercase tracking-wider">
              Check-in
            </div>
            <div className="text-sm font-semibold text-primary-800">
              {formatDate(booking.checkIn)}
            </div>
          </div>

          {/* Check-out */}
          <div className="text-center md:text-left">
            <div className="text-xs text-primary-500 font-semibold mb-1 uppercase tracking-wider">
              Check-out
            </div>
            <div className="text-sm font-semibold text-primary-800">
              {formatDate(booking.checkOut)}
            </div>
          </div>

          {/* Guests */}
          <div className="text-center md:text-left">
            <div className="text-xs text-primary-500 font-semibold mb-1 uppercase tracking-wider">
              Guests
            </div>
            <div className="text-sm font-semibold text-primary-800">
              {booking.guests || 1}{" "}
              {(booking.guests || 1) > 1 ? "guests" : "guest"}
            </div>
          </div>

          {/* Nights */}
          <div className="text-center md:text-left">
            <div className="text-xs text-primary-500 font-semibold mb-1 uppercase tracking-wider">
              Duration
            </div>
            <div className="text-sm font-semibold text-primary-800">
              {nights > 0
                ? `${nights} ${nights > 1 ? "nights" : "night"}`
                : "N/A"}
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-gradient-to-r from-success-50 to-emerald-50 rounded-xl p-4 mb-4 border border-success-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                <span className="text-success-600 text-sm font-bold">₦</span>
              </div>
              <span className="text-sm text-success-700 font-semibold">
                Total Earnings
              </span>
            </div>
            <span className="text-xl font-bold text-success-800">
              {selectedCurrencyData?.symbol || "₦"}
              {displayAmount.toLocaleString()}
            </span>
          </div>
          {nights > 0 && displayAmount > 0 && (
            <div className="text-xs text-success-600 mt-2 pl-10">
              {selectedCurrencyData?.symbol || "₦"}
              {Math.round(displayAmount / nights).toLocaleString()} per night ×{" "}
              {nights} nights
            </div>
          )}
        </div>

        {/* Guest Contact Info */}
        {(booking.guestEmail || booking.guestPhone) && (
          <div className="bg-neutral-50 rounded-lg p-3 mb-4">
            <div className="text-xs text-primary-500 font-medium mb-2">
              Guest Contact
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {booking.guestEmail && (
                <div className="flex items-center gap-1 text-primary-700">
                  <FaEnvelope className="text-xs" />
                  <span>{booking.guestEmail}</span>
                </div>
              )}
              {booking.guestPhone && (
                <div className="flex items-center gap-1 text-primary-700">
                  <FaPhone className="text-xs" />
                  <span>{booking.guestPhone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Date */}
        <div className="flex items-center justify-between text-xs text-primary-500 mb-4">
          <span>Booked on: {formatDate(booking.createdAt)}</span>
          {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
            <span>Updated: {formatDate(booking.updatedAt)}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {/* Confirm/Reject for pending bookings */}
          {canConfirm && (
            <>
              <button
                onClick={() => handleStatusUpdate("confirmed")}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-success-600 hover:bg-success-700 disabled:opacity-50 rounded-lg transition-colors duration-300"
              >
                <FaCheck className="text-xs" />
                {isUpdating ? "Processing..." : "Confirm"}
              </button>
              <button
                onClick={() => handleStatusUpdate("cancelled")}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-error-600 hover:bg-error-700 disabled:opacity-50 rounded-lg transition-colors duration-300"
              >
                <FaTimes className="text-xs" />
                Reject
              </button>
            </>
          )}

          {/* Cancel for confirmed bookings */}
          {booking.status === "confirmed" && canCancel && (
            <button
              onClick={() => handleStatusUpdate("cancelled")}
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 text-sm text-error-600 bg-error-50 hover:bg-error-100 disabled:opacity-50 rounded-lg transition-colors duration-300"
            >
              <FaTimes className="text-xs" />
              Cancel Booking
            </button>
          )}

          {/* View Property */}
          {booking.propertyId && (
            <button
              onClick={() => onViewProperty(booking.propertyId)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-accent-blue-600 bg-accent-blue-50 hover:bg-accent-blue-100 rounded-lg transition-colors duration-300"
            >
              <FaEye className="text-xs" />
              View Property
            </button>
          )}

          {/* Contact Guest */}
          {booking.guestEmail && (
            <button
              onClick={() => onContactGuest(booking)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors duration-300"
            >
              <FaEnvelope className="text-xs" />
              Contact Guest
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const HostBookingManagement = () => {
  const { user, getBookings, updateBookingStatus } = useAPI();
  const { convertFromCurrency, selectedCurrencyData } = useCurrency();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'confirmed', 'cancelled'

  // Fetch host bookings on mount
  useEffect(() => {
    const fetchHostBookings = async () => {
      console.log("🔍 HostBookingManagement - Checking user object:", {
        user: user,
        userExists: !!user,
        userId: user?.id,
        userUid: user?.uid,
        userKeys: user ? Object.keys(user) : [],
        userRole: user?.role,
      });

      if (!user || !user._id) {
        console.log("❌ No user or user._id found, skipping booking fetch");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("📋 HostBookingManagement - Fetching bookings for user:", {
          _id: user._id,
          role: user.role,
          email: user.email,
        });
        const fetchedBookings = await getBookings();

        console.log("✅ HostBookingManagement - Bookings received:", {
          count: fetchedBookings?.length || 0,
          bookings: fetchedBookings,
        });
        setBookings(fetchedBookings || []);
      } catch (err) {
        console.error("❌ Error fetching host bookings:", err);
        setError(err.message || "Failed to load bookings");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHostBookings();
  }, [user, getBookings]);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status?.toLowerCase() === filter.toLowerCase();
  });

  // Handle booking status updates
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          (booking._id || booking.id) === bookingId
            ? {
                ...booking,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : booking,
        ),
      );

      toast.success(
        `Booking ${newStatus === "confirmed" ? "confirmed" : "cancelled"} successfully`,
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error(error.message || "Failed to update booking");
      throw error;
    }
  };

  // Handle view property
  const handleViewProperty = (propertyId) => {
    window.open(`/listing/${propertyId}`, "_blank");
  };

  // Handle contact guest
  const handleContactGuest = (booking) => {
    if (booking.guestEmail) {
      const subject = `Regarding your booking at ${booking.propertyTitle}`;
      const body = `Dear ${
        booking.guestName || "Guest"
      },\n\nI hope this message finds you well. I wanted to reach out regarding your upcoming stay at ${
        booking.propertyTitle
      } from ${booking.checkIn} to ${
        booking.checkOut
      }.\n\nBest regards,\nYour Host`;

      window.open(
        `mailto:${booking.guestEmail}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`,
      );
    }
  };

  // Get filter counts
  const getFilterCount = (status) => {
    if (status === "all") return bookings.length;
    return bookings.filter(
      (b) => b.status?.toLowerCase() === status.toLowerCase(),
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 mb-2 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              📋 Booking Management
            </h2>
            <p className="text-primary-100 mt-2 text-sm md:text-base">
              Manage your property bookings and guest communications
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <div className="text-2xl font-bold text-white">
                {bookings.length}
              </div>
              <div className="text-xs text-primary-200">Total Bookings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-md border border-primary-100 flex flex-wrap gap-2">
        {[
          {
            key: "all",
            label: "All",
            icon: "📊",
            count: getFilterCount("all"),
          },
          {
            key: "pending",
            label: "Pending",
            icon: "⏳",
            count: getFilterCount("pending"),
            color: "warning",
          },
          {
            key: "confirmed",
            label: "Confirmed",
            icon: "✅",
            count: getFilterCount("confirmed"),
            color: "success",
          },
          {
            key: "cancelled",
            label: "Cancelled",
            icon: "❌",
            count: getFilterCount("cancelled"),
            color: "error",
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              filter === tab.key
                ? "bg-primary-600 text-white shadow-lg scale-[1.02]"
                : "text-primary-600 hover:text-primary-800 hover:bg-primary-50 hover:scale-[1.01]"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                filter === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-primary-100 text-primary-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <PageLoader label="Loading bookings" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-error-50 border border-error-200 text-error-600 p-4 rounded-lg">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-error-600 hover:text-error-800 underline text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        filteredBookings.length === 0 &&
        bookings.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-white to-primary-50 rounded-2xl border border-primary-100 shadow-soft">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="text-primary-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-primary-800 mb-3">
              No bookings yet
            </h3>
            <p className="text-primary-600 max-w-md mx-auto leading-relaxed">
              Your booking requests will appear here once guests start booking
              your properties. Make sure your listings are active!
            </p>
          </div>
        )}

      {/* No Results for Filter */}
      {!loading &&
        !error &&
        filteredBookings.length === 0 &&
        bookings.length > 0 && (
          <div className="text-center py-8 bg-white rounded-xl">
            <FaFilter className="text-neutral-400 text-4xl mx-auto mb-3" />
            <h3 className="text-lg font-medium text-primary-800 mb-2">
              No {filter !== "all" ? filter : ""} bookings found
            </h3>
            <p className="text-primary-600">
              Try changing the filter to see your other bookings.
            </p>
          </div>
        )}

      {/* Bookings List */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredBookings.map((booking, index) => (
            <HostBookingCard
              key={booking._id || booking.id || index}
              booking={booking}
              onUpdateStatus={handleUpdateBookingStatus}
              onViewProperty={handleViewProperty}
              onContactGuest={handleContactGuest}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HostBookingManagement;
