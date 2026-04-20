import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAPI } from "../../contexts/APIContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import {
  FaStar,
  FaHeart,
  FaShare,
  FaMapMarkerAlt,
  FaUsers,
  FaBed,
  FaBath,
  FaWifi,
  FaTv,
  FaCar,
  FaSwimmingPool,
  FaUtensils,
  FaSnowflake,
  FaDumbbell,
  FaPaw,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaCheck,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaShieldAlt,
  FaGamepad,
} from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { toast } from "sonner";
import PropTypes from "prop-types";
import MapboxMap from "../common/MapboxMap";
import { PropertyDetailSkeleton } from "../common/SkeletonLoaders";

// Date picker component — editorial
const DatePicker = ({ label, value, onChange, min, disabled, error }) => {
  return (
    <div className="flex flex-col">
      <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-2">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        disabled={disabled}
        className={`w-full px-3 py-3 border bg-white text-neutral-800 text-sm transition-colors duration-200 focus:outline-none ${
          error
            ? "border-red-400 focus:border-red-500 bg-red-50"
            : disabled
              ? "border-neutral-200 bg-neutral-100 text-neutral-400"
              : "border-neutral-200 hover:border-neutral-400 focus:border-neutral-800"
        }`}
      />
      {error && (
        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1.5 font-medium border-l-2 border-red-400 pl-2">
          <FaExclamationTriangle className="text-xs" />
          {error}
        </p>
      )}
    </div>
  );
};

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
};

// Guest counter component
const GuestCounter = ({ guests, onGuestsChange, maxGuests = 10 }) => {
  const decrementGuests = () => {
    if (guests > 1) {
      onGuestsChange(guests - 1);
    }
  };

  const incrementGuests = () => {
    if (guests < maxGuests) {
      onGuestsChange(guests + 1);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-2">
        Guests
      </label>
      <div className="flex items-center justify-between px-3 py-2.5 border border-neutral-200 bg-white">
        <button
          type="button"
          onClick={decrementGuests}
          disabled={guests <= 1}
          aria-label="Decrease guests"
          className={`w-8 h-8 flex items-center justify-center text-base transition-colors duration-200 ${
            guests <= 1
              ? "text-neutral-300 cursor-not-allowed"
              : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          −
        </button>
        <span className="font-medium text-neutral-800 text-sm">
          {guests} {guests === 1 ? "Guest" : "Guests"}
        </span>
        <button
          type="button"
          onClick={incrementGuests}
          disabled={guests >= maxGuests}
          aria-label="Increase guests"
          className={`w-8 h-8 flex items-center justify-center text-base transition-colors duration-200 ${
            guests >= maxGuests
              ? "text-neutral-300 cursor-not-allowed"
              : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          +
        </button>
      </div>
    </div>
  );
};

GuestCounter.propTypes = {
  guests: PropTypes.number.isRequired,
  onGuestsChange: PropTypes.func.isRequired,
  maxGuests: PropTypes.number,
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getProperty,
    isAuthenticated,
    user,
    createBooking,
    checkBookingAvailability,
  } = useAPI();
  const { convertFromCurrency, selectedCurrencyData } = useCurrency();

  // Property state
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });
  const [bookingErrors, setBookingErrors] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  // Calculate booking details
  const calculateBookingDetails = () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut || !property) {
      return { nights: 0, totalAmount: 0, pricePerNight: 0 };
    }

    const checkIn = new Date(bookingForm.checkIn);
    const checkOut = new Date(bookingForm.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // Get base price - handle multiple possible field names
    let basePrice = 0;
    if (property.pricePerNight) basePrice = property.pricePerNight;
    else if (property.price) basePrice = property.price;
    else if (property.nightlyRate) basePrice = property.nightlyRate;
    else basePrice = 0;

    // Convert price to selected currency - get numeric value
    const convertedPrice = convertFromCurrency(
      basePrice,
      property.currency || "NGN",
    );

    // Parse the converted price to handle comma formatting
    const pricePerNight =
      typeof convertedPrice === "string"
        ? parseFloat(convertedPrice.replace(/,/g, ""))
        : convertedPrice;

    const totalAmount = nights * pricePerNight;

    return { nights, totalAmount, pricePerNight };
  };

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add validation for property ID
        if (!id || id === "undefined" || id === "null") {
          throw new Error("Invalid property ID");
        }

        const propertyData = await getProperty(id);

        if (!propertyData) {
          throw new Error("Property not found");
        }

        setProperty(propertyData);
      } catch (err) {
        const errorMessage = err.message || "Failed to load property";
        setError(errorMessage);

        // If it's a timeout error, provide specific message
        if (err.message?.includes("timeout")) {
          setError(
            "Request timed out. Please check your connection and try again.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    } else {
      setError("No property ID provided");
      setLoading(false);
    }
  }, [id, getProperty]);

  // Validate booking form
  const validateBookingForm = () => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!bookingForm.checkIn) {
      errors.checkIn = "Check-in date is required";
    } else if (bookingForm.checkIn < today) {
      errors.checkIn = "Check-in date cannot be in the past";
    }

    if (!bookingForm.checkOut) {
      errors.checkOut = "Check-out date is required";
    } else if (bookingForm.checkOut <= bookingForm.checkIn) {
      errors.checkOut = "Check-out date must be after check-in date";
    }

    if (bookingForm.guests < 1) {
      errors.guests = "At least 1 guest is required";
    } else if (
      property &&
      bookingForm.guests > (property.maxGuests || property.guests || 10)
    ) {
      errors.guests = `Maximum ${
        property.maxGuests || property.guests || 10
      } guests allowed`;
    }

    return errors;
  };

  // Check availability
  const handleCheckAvailability = async () => {
    // Check if required information is filled
    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      toast.error(
        "Check availability cannot be checked now, all information hasn't been filled",
      );
      return;
    }

    const validationErrors = validateBookingForm();
    setBookingErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the form errors before checking availability");
      return;
    }

    try {
      setAvailabilityLoading(true);
      setBookingErrors({}); // Clear previous errors

      const response = await checkBookingAvailability(
        property._id || property.id,
        bookingForm.checkIn,
        bookingForm.checkOut,
      );

      if (response && response.available === true) {
        toast.success("Property is available for these dates! ✅");
        setBookingErrors({}); // Clear errors on success
      } else {
        const errorMessage =
          response?.message || "Property is not available for these dates";
        toast.error(errorMessage);
        setBookingErrors({ general: errorMessage });
      }
    } catch (err) {
      let errorMessage = "Failed to check availability";

      if (err.response?.status === 400) {
        errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Invalid request parameters";
      } else if (err.response?.status === 404) {
        errorMessage = "Property not found";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to check availability";
      }

      toast.error(errorMessage);
      setBookingErrors({ general: errorMessage });
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Handle Book Now - Navigate to checkout
  const handleBookNow = () => {
    // Check if required information is filled
    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      toast.error(
        "Booking cannot be checked now, all information hasn't been filled",
      );
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to continue booking");
      navigate("/signin");
      return;
    }

    // Validate form before proceeding to checkout
    const validationErrors = validateBookingForm();
    if (Object.keys(validationErrors).length > 0) {
      setBookingErrors(validationErrors);
      toast.error("Please fix the form errors before proceeding");
      return;
    }

    const { nights, totalAmount, pricePerNight } = calculateBookingDetails();

    if (!pricePerNight || pricePerNight <= 0) {
      toast.error("Unable to calculate booking price. Please try again.");
      return;
    }

    // Create booking data for checkout
    const checkoutBookingData = {
      propertyId: property._id || property.id,
      propertyTitle: property.title,
      propertyImage: property.images?.[0],
      propertyLocation: `${
        property.address?.city || property.location?.city
      }, ${property.address?.state || property.location?.state}`,
      checkIn: bookingForm.checkIn,
      checkOut: bookingForm.checkOut,
      guests: bookingForm.guests,
      nights,
      pricePerNight: Math.round(pricePerNight),
      totalAmount: Math.round(totalAmount),
      currency: selectedCurrencyData?.code || "NGN",
      currencySymbol: selectedCurrencyData?.symbol || "\u20a6",
    };

    // Navigate to checkout with booking data
    navigate("/checkout", {
      state: {
        bookingData: checkoutBookingData,
        fromProperty: property._id || property.id,
      },
    });
  };

  // Handle booking submission
  const handleBooking = async () => {
    // Check if required information is filled
    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      toast.error(
        "Reservation cannot be checked now, all information hasn't been filled",
      );
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to make a booking");
      navigate("/signin");
      return;
    }

    // Debugging: Log booking form values

    // Validate form fields
    const validationErrors = validateBookingForm();
    if (Object.keys(validationErrors).length > 0) {
      setBookingErrors(validationErrors);
      toast.error("Please fix the form errors before proceeding");
      return;
    }

    // Ensure `checkIn` and `checkOut` are populated
    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      toast.error("Check-in and Check-out dates are required");
      setBookingErrors({
        checkIn: !bookingForm.checkIn ? "Check-in date is required" : undefined,
        checkOut: !bookingForm.checkOut
          ? "Check-out date is required"
          : undefined,
      });
      return;
    }

    try {
      setBookingLoading(true);
      setBookingErrors({}); // Clear previous errors

      // Show user that we're checking availability
      toast.loading("Checking availability...", { id: "availability-check" });

      let availabilityCheck;
      try {
        availabilityCheck = await checkBookingAvailability(
          property._id || property.id,
          bookingForm.checkIn,
          bookingForm.checkOut,
        );
      } catch {
        toast.dismiss("availability-check");
        toast.error("Failed to check availability. Please try again.");
        setBookingErrors({
          general: "Failed to check availability. Please try again.",
        });
        setBookingLoading(false);
        return;
      }

      // Dismiss the loading toast
      toast.dismiss("availability-check");

      if (!availabilityCheck || !availabilityCheck.available) {
        const errorMessage =
          availabilityCheck?.message ||
          "Property is not available for these dates";
        toast.error(errorMessage);
        setBookingErrors({ general: errorMessage });
        setBookingLoading(false); // Reset loading state
        return;
      }

      // Show success for availability
      toast.success("Dates available! Processing booking...", {
        duration: 2000,
      });

      const { nights, totalAmount, pricePerNight } = calculateBookingDetails();

      if (!pricePerNight || pricePerNight <= 0) {
        toast.error("Unable to calculate booking price. Please try again.");
        setBookingErrors({ general: "Invalid price calculation" });
        setBookingLoading(false); // Reset loading state
        return;
      }

      const bookingData = {
        propertyId: property._id || property.id,
        propertyTitle: property.title,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guests: bookingForm.guests,
        totalAmount: Math.round(totalAmount),
        nights,
        status: "pending", // Set as pending until payment
        userEmail: user?.email, // Include user email
      };

      // Create pending booking
      await createBooking(bookingData);

      toast.success("Booking reserved! You can pay later from My Bookings.", {
        duration: 3000,
      });

      // Reset form on success
      setBookingForm({
        checkIn: "",
        checkOut: "",
        guests: 1,
      });
      setBookingErrors({}); // Clear any remaining errors

      // Navigate to My Bookings page
      navigate("/my-bookings");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create booking";

      toast.error(errorMessage);
      setBookingErrors({ general: errorMessage });
    } finally {
      setBookingLoading(false);
    }
  };

  // Image navigation
  const nextImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1,
      );
    }
  };

  // Amenity icons mapping — case/format-insensitive
  const amenityIconMap = {
    wifi: FaWifi,
    "wi-fi": FaWifi,
    tv: FaTv,
    parking: FaCar,
    pool: FaSwimmingPool,
    kitchen: FaUtensils,
    ac: FaSnowflake,
    "air conditioning": FaSnowflake,
    gym: FaDumbbell,
    pets: FaPaw,
    "pet-friendly": FaPaw,
    "pet friendly": FaPaw,
    security: FaShieldAlt,
    hottub: FaSwimmingPool,
    "hot tub": FaSwimmingPool,
    gaming: FaGamepad,
  };
  const getAmenityIcon = (a) => amenityIconMap[String(a).toLowerCase().trim()] || FaCheck;
  const formatAmenity = (a) =>
    String(a)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
        <div className="text-center max-w-md w-full">
          <div className="bg-white border border-neutral-200 p-10">
            <div className="flex items-center gap-3 justify-center mb-5">
              <div className="w-6 h-px bg-amber-500" />
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
                Not Found
              </span>
              <div className="w-6 h-px bg-amber-500" />
            </div>
            <h2 className="font-Cormorant text-3xl sm:text-4xl font-light text-neutral-900 mb-3 leading-tight">
              Property <span className="italic">unavailable</span>
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed mb-8">
              {error ||
                "We couldn't find the property you're looking for. It may have been removed or the link might be incorrect."}
            </p>
            <div className="space-y-2.5">
              <button
                onClick={() => navigate("/listings")}
                className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200"
              >
                View All Properties
                <HiArrowRight className="text-base" />
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full border border-neutral-200 hover:border-neutral-400 text-neutral-700 px-6 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { nights, totalAmount, pricePerNight } = calculateBookingDetails();

  // Base display price — shown in the header even before dates are picked
  const baseNightlyPrice = (() => {
    const raw =
      property.pricePerNight ?? property.price ?? property.nightlyRate ?? 0;
    const converted = convertFromCurrency(raw, property.currency || "NGN");
    const num =
      typeof converted === "string"
        ? parseFloat(converted.replace(/,/g, ""))
        : converted;
    return Number.isFinite(num) ? num : 0;
  })();
  const displayPricePerNight =
    pricePerNight > 0 ? pricePerNight : baseNightlyPrice;

  const cityState = `${property.location?.city || property.address?.city || ""}${
    (property.location?.state || property.address?.state)
      ? `, ${property.location?.state || property.address?.state}`
      : ""
  }`;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Editorial Sticky Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/listings")}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors duration-200 group"
            >
              <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase">
                Back to Properties
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                aria-label="Share property"
                className="w-10 h-10 border border-neutral-200 hover:border-neutral-400 flex items-center justify-center transition-colors duration-200"
              >
                <FaShare className="text-neutral-600 text-sm" />
              </button>
              <button
                aria-label="Save to favorites"
                className="w-10 h-10 border border-neutral-200 hover:border-neutral-400 flex items-center justify-center transition-colors duration-200 group"
              >
                <FaHeart className="text-neutral-400 group-hover:text-red-500 text-sm transition-colors duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10 lg:space-y-12">
            {/* Property Header — editorial */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-amber-500" />
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
                  {property.propertyType || property.type || "Property"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-neutral-500 mb-3">
                <FaMapMarkerAlt className="text-xs flex-shrink-0" />
                <span className="text-sm">
                  {property.location?.address ||
                    property.address?.street ||
                    cityState ||
                    "Location available"}
                </span>
              </div>

              <h1 className="font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 mb-5 leading-[1.05] tracking-tight">
                {property.title}
              </h1>

              <div className="flex items-center gap-x-6 gap-y-2 flex-wrap pb-5 border-b border-neutral-200">
                <div className="flex items-center gap-1.5">
                  <FaStar className="text-amber-500 text-sm" />
                  <span className="font-semibold text-neutral-900 text-sm">
                    {property.averageRating || "New"}
                  </span>
                  {property.totalReviews ? (
                    <span className="text-neutral-500 text-sm">
                      · {property.totalReviews} reviews
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-x-5 gap-y-2 flex-wrap text-sm text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <FaUsers className="text-xs text-neutral-400" />
                    {property.maxGuests || property.guests || 4} Guests
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaBed className="text-xs text-neutral-400" />
                    {property.bedrooms} Beds
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaBath className="text-xs text-neutral-400" />
                    {property.bathrooms} Baths
                  </span>
                </div>
              </div>
            </div>

            {/* Image Gallery — full-bleed editorial */}
            <div>
              <div className="relative bg-neutral-100 overflow-hidden group aspect-[4/3] sm:aspect-[16/10]">
                <img
                  src={
                    property.images?.[currentImageIndex] ||
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                  loading="eager"
                  decoding="async"
                />
                {property.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/85 hover:bg-white backdrop-blur-sm flex items-center justify-center transition-colors duration-200"
                    >
                      <FaChevronLeft className="text-neutral-700 text-sm" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/85 hover:bg-white backdrop-blur-sm flex items-center justify-center transition-colors duration-200"
                    >
                      <FaChevronRight className="text-neutral-700 text-sm" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900/85 backdrop-blur-sm text-white text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5">
                  {currentImageIndex + 1} / {property.images?.length || 1}
                </div>
              </div>

              {/* Thumbnails */}
              {property.images?.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {property.images.slice(0, 6).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                      className={`flex-shrink-0 w-20 h-20 overflow-hidden transition-opacity duration-200 ${
                        currentImageIndex === index
                          ? "ring-2 ring-amber-500 ring-offset-2"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                  {property.images.length > 6 && (
                    <div className="flex-shrink-0 w-20 h-20 bg-neutral-900 text-white flex items-center justify-center">
                      <span className="font-Cormorant text-xl font-light">
                        +{property.images.length - 6}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* About */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-amber-500" />
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
                  Overview
                </span>
              </div>
              <h3 className="font-Cormorant text-3xl sm:text-4xl font-light text-neutral-900 mb-4 leading-tight">
                About this <span className="italic">place</span>
              </h3>
              <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                {property.description || "No description available for this property."}
              </p>
            </section>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-px bg-amber-500" />
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
                    Amenities
                  </span>
                </div>
                <h3 className="font-Cormorant text-3xl sm:text-4xl font-light text-neutral-900 mb-6 leading-tight">
                  What this place <span className="italic">offers</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-neutral-200">
                  {property.amenities.map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-4 border-r border-b border-neutral-200 bg-white"
                      >
                        <Icon className="text-neutral-700 text-base flex-shrink-0" />
                        <span className="text-neutral-800 text-sm capitalize">
                          {formatAmenity(amenity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Property Features */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-amber-500" />
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
                  At a Glance
                </span>
              </div>
              <h3 className="font-Cormorant text-3xl sm:text-4xl font-light text-neutral-900 mb-6 leading-tight">
                Property <span className="italic">features</span>
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-neutral-200 border border-neutral-200 bg-white">
                {[
                  { icon: FaUsers, value: property.maxGuests || property.guests || "N/A", label: "Guests" },
                  { icon: FaBed, value: property.bedrooms || "N/A", label: "Bedrooms" },
                  { icon: FaBath, value: property.bathrooms || "N/A", label: "Bathrooms" },
                  { icon: FaMapMarkerAlt, value: property.propertyType || property.type || "N/A", label: "Type" },
                ].map((feat, i) => (
                  <div key={i} className={`p-5 sm:p-6 ${i >= 2 ? "border-t lg:border-t-0 border-neutral-200" : ""}`}>
                    <feat.icon className="text-neutral-300 text-lg mb-3" />
                    <div className="font-Cormorant text-2xl sm:text-3xl font-light text-neutral-900 leading-none capitalize">
                      {feat.value}
                    </div>
                    <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-600 mt-2">
                      {feat.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Location */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-amber-500" />
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
                  Where You&apos;ll Be
                </span>
              </div>
              <h3 className="font-Cormorant text-3xl sm:text-4xl font-light text-neutral-900 mb-6 leading-tight">
                <span className="italic">Location</span>
              </h3>

              <div className="flex items-start gap-3 mb-5 pb-5 border-b border-neutral-200">
                <FaMapMarkerAlt className="text-amber-600 text-base mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">
                    {property.location?.address ||
                      property.address?.street ||
                      "Address not available"}
                  </div>
                  <div className="text-neutral-500 text-sm mt-0.5">
                    {property.location?.city || property.address?.city},{" "}
                    {property.location?.state || property.address?.state}{" "}
                    {property.location?.country || property.address?.country || "Nigeria"}
                  </div>
                </div>
              </div>

              <div className="w-full h-64 sm:h-80 overflow-hidden border border-neutral-200">
                <MapboxMap
                  center={[
                    property.location?.lng || property.address?.lng || 3.3792,
                    property.location?.lat || property.address?.lat || 6.5244,
                  ]}
                  zoom={14}
                  markers={[
                    {
                      coordinates: [
                        property.location?.lng || property.address?.lng || 3.3792,
                        property.location?.lat || property.address?.lat || 6.5244,
                      ],
                      popup: `<div><strong>${property.title}</strong><br/>${property.location?.address || property.address?.street || "Property Location"}</div>`,
                    },
                  ]}
                />
              </div>
            </section>
          </div>

          {/* Right Column — Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-neutral-200 sticky top-24">
              {/* Price header */}
              <div className="px-6 py-6 border-b border-neutral-200">
                <div className="flex items-baseline gap-2">
                  <span className="font-Cormorant text-4xl font-light text-neutral-900 leading-none">
                    {selectedCurrencyData?.symbol || "₦"}
                    {displayPricePerNight > 0
                      ? Math.round(displayPricePerNight).toLocaleString()
                      : "0"}
                  </span>
                  <span className="text-xs font-medium text-neutral-500 tracking-wider uppercase">
                    /night
                  </span>
                </div>
              </div>

              <div className="px-6 py-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <DatePicker
                    label="Check-in"
                    value={bookingForm.checkIn}
                    onChange={(value) =>
                      setBookingForm((prev) => ({ ...prev, checkIn: value }))
                    }
                    min={new Date().toISOString().split("T")[0]}
                    error={bookingErrors.checkIn}
                  />
                  <DatePicker
                    label="Check-out"
                    value={bookingForm.checkOut}
                    onChange={(value) =>
                      setBookingForm((prev) => ({ ...prev, checkOut: value }))
                    }
                    min={
                      bookingForm.checkIn ||
                      new Date().toISOString().split("T")[0]
                    }
                    error={bookingErrors.checkOut}
                  />
                </div>

                <GuestCounter
                  guests={bookingForm.guests}
                  onGuestsChange={(value) =>
                    setBookingForm((prev) => ({ ...prev, guests: value }))
                  }
                  maxGuests={property.maxGuests || property.guests || 10}
                />

                {/* Booking Summary */}
                {nights > 0 && pricePerNight > 0 && (
                  <div className="border border-neutral-200 px-4 py-3 space-y-2.5">
                    <div className="flex justify-between text-neutral-600 text-sm">
                      <span>
                        {selectedCurrencyData?.symbol || "₦"}
                        {Math.round(pricePerNight).toLocaleString()} × {nights} nights
                      </span>
                      <span className="text-neutral-800">
                        {selectedCurrencyData?.symbol || "₦"}
                        {Math.round(nights * pricePerNight).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-neutral-200 pt-2.5 flex justify-between items-baseline">
                      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-500">
                        Total
                      </span>
                      <span className="font-Cormorant text-2xl font-light text-neutral-900">
                        {selectedCurrencyData?.symbol || "₦"}
                        {Math.round(totalAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {bookingErrors.general && (
                  <div className="border-l-2 border-red-500 bg-red-50 text-red-700 px-3 py-2.5 text-xs flex items-start gap-2">
                    <FaExclamationTriangle className="text-xs mt-0.5 flex-shrink-0" />
                    <span>{bookingErrors.general}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckAvailability}
                    disabled={availabilityLoading}
                    className="w-full border border-neutral-300 hover:border-neutral-900 text-neutral-800 hover:text-neutral-900 py-3.5 px-6 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {availabilityLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-neutral-700 border-t-transparent rounded-full animate-spin" />
                        Checking…
                      </>
                    ) : (
                      <>
                        <FaCalendarAlt className="text-xs" />
                        Check Availability
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-900 py-3.5 px-6 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                        Reserving…
                      </>
                    ) : (
                      <>
                        <FaCheck className="text-xs" />
                        Reserve Now
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBookNow}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-3.5 px-6 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Book Now
                    <HiArrowRight className="text-base" />
                  </button>
                </div>

                {!isAuthenticated && (
                  <p className="text-center text-xs text-neutral-500 pt-2">
                    <button
                      onClick={() => navigate("/signin")}
                      className="text-neutral-900 font-semibold hover:text-amber-600 transition-colors duration-200"
                    >
                      Login
                    </button>
                    {" or "}
                    <button
                      onClick={() => navigate("/signup")}
                      className="text-neutral-900 font-semibold hover:text-amber-600 transition-colors duration-200"
                    >
                      Register
                    </button>
                    {" to book this property"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
