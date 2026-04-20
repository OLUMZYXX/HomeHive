import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import {
  FaCheck,
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ButtonLoader } from "../common/Loader";
import image from "../../assets/Apt2.webp";
import { useNavigate, useLocation } from "react-router-dom";
import useScrollToTop from "../../hooks/useScrollToTop";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useAPI } from "../../contexts/APIContext";
import FlutterwaveCheckoutForm from "./FlutterwaveCheckoutForm";

const Checkout = () => {
  useScrollToTop();

  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice, selectedCurrency } = useCurrency();
  const { createBooking, confirmBooking } = useAPI();

  const [selectedPayment, setSelectedPayment] = useState({ name: "Flutterwave" });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const bookingData = location.state?.bookingData;
  const [checkIn, setCheckIn] = useState(bookingData?.checkIn || "");
  const [checkOut, setCheckOut] = useState(bookingData?.checkOut || "");
  const [guest, setGuest] = useState(bookingData?.guests || 1);
  const [home] = useState({
    name: bookingData?.propertyTitle || "Accommodation",
    image: bookingData?.propertyImage || image,
    location: bookingData?.propertyLocation || "Location",
  });

  const originalPrice = bookingData?.pricePerNight || 20000;
  const userSelectedCurrency = selectedCurrency;
  const nights = bookingData?.nights || 1;
  const totalAmount = bookingData?.totalAmount || originalPrice * nights;
  const pricePerNight = originalPrice;

  useEffect(() => {
    if (!bookingData) {
      toast.error("No booking data found");
      navigate("/listings");
    }
  }, [bookingData, navigate]);

  const [editOpt, setEditOpt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("full");
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Missing Dates", {
        description: "Please select check-in and check-out dates",
        duration: 4000,
      });
      return;
    }

    if (!selectedPayment?.name) {
      toast.error("Payment Method Required", {
        description: "Please select a payment provider",
        duration: 4000,
      });
      return;
    }

    if (!termsAccepted) {
      toast.error("Terms & Conditions", {
        description: "Please accept the terms and conditions",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      if (selectedPayment.name === "Stripe" || selectedPayment.name === "Flutterwave") {
        const bookingPayload = {
          ...bookingData,
          checkIn,
          checkOut,
          guests: guest,
          totalAmount:
            pricing.total || bookingData?.totalAmount || originalPrice * nights,
        };
        const bookingRes = await createBooking(bookingPayload);

        if (bookingRes && (bookingRes._id || bookingRes.id)) {
          setCreatedBooking(bookingRes);
          setShowStripePayment(true);
          toast.success("Booking created! Proceed to payment.");
        } else {
          toast.error("Failed to create booking. Please try again.");
        }
        setIsLoading(false);
        return;
      }
    } catch {
      toast.error("Booking Failed", {
        description: "Unable to process your booking. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    setShowStripePayment(false);
    setIsLoading(true);

    try {
      const bookingId = createdBooking._id || createdBooking.id;

      await confirmBooking(
        bookingId,
        paymentResponse.id || paymentResponse.transaction_id,
      );

      toast.success("Booking Confirmed!", {
        description: "Payment processed successfully",
        duration: 4000,
      });

      navigate("/booking-confirmation", {
        state: {
          bookingId: bookingId,
          bookingData: {
            ...createdBooking,
            status: "confirmed",
            paymentStatus: "paid",
          },
        },
      });
    } catch {
      toast.error("Failed to confirm booking. Please contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  const paymentOption = (method) => {
    setShowStripePayment(false);
    toast.info("Payment Method", {
      description: `${method} selected. Click 'Confirm & Pay' to proceed.`,
      duration: 3000,
    });
  };

  const handleSelectPayment = (option) => {
    setSelectedPayment(option);
    paymentOption(option.name);
  };

  const calculatePricing = () => {
    if (!checkIn || !checkOut) return { nights: 0, basePrice: 0, total: 0 };

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const computedNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (computedNights <= 0) return { nights: 0, basePrice: 0, total: 0 };

    const basePrice = totalAmount || pricePerNight * computedNights;
    const cleaningFee = 5000;
    const serviceFee = 15000;
    const taxes = 210;
    const total = basePrice + cleaningFee + serviceFee + taxes;

    return {
      nights: computedNights,
      basePrice,
      cleaningFee,
      serviceFee,
      taxes,
      total,
      pricePerNight,
    };
  };

  const pricing = calculatePricing();

  const paymentOptions = [
    { name: "Stripe" },
    { name: "Flutterwave" },
    { name: "PayPal" },
    { name: "Paystack" },
  ];

  const formatDateRange = (a, b) => {
    if (!a || !b) return "Select dates";
    const fmt = (d) =>
      new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(a)} – ${fmt(b)}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        {/* Editorial Header */}
        <div className="py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-amber-500" />
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
              Checkout
            </span>
          </div>
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate(-1)}
              className="mt-2 w-10 h-10 border border-neutral-300 hover:border-neutral-900 flex items-center justify-center transition-colors duration-200 flex-shrink-0"
              aria-label="Go back"
            >
              <FaArrowLeft className="text-xs text-neutral-700" />
            </button>
            <h1 className="font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.05]">
              Complete your <span className="italic">booking</span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 pb-16">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Details */}
            <section className="bg-white border border-neutral-200">
              <div className="px-6 py-5 border-b border-neutral-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-px bg-amber-500" />
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
                    Step 01
                  </span>
                </div>
                <h2 className="font-Cormorant text-2xl sm:text-3xl font-light text-neutral-900">
                  Your trip <span className="italic">details</span>
                </h2>
              </div>

              <div className="divide-y divide-neutral-200">
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-4">
                    <FaCalendarAlt className="text-amber-600 text-base" />
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-neutral-500 mb-1">
                        Dates
                      </p>
                      <p className="text-sm font-medium text-neutral-900">
                        {formatDateRange(checkIn, checkOut)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditOpt(!editOpt)}
                    className="text-xs font-semibold tracking-widest uppercase text-neutral-700 hover:text-amber-600 border-b border-neutral-300 hover:border-amber-500 pb-0.5 transition-colors"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-4">
                    <FaUsers className="text-amber-600 text-base" />
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-neutral-500 mb-1">
                        Guests
                      </p>
                      <p className="text-sm font-medium text-neutral-900">
                        {guest} {guest === 1 ? "guest" : "guests"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditOpt(!editOpt)}
                    className="text-xs font-semibold tracking-widest uppercase text-neutral-700 hover:text-amber-600 border-b border-neutral-300 hover:border-amber-500 pb-0.5 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {editOpt && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-neutral-200 bg-neutral-50/50"
                  >
                    <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-neutral-500 mb-2">
                          Check-in
                        </label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-neutral-800 focus:outline-none transition-colors"
                          style={{ fontSize: "14px" }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-neutral-500 mb-2">
                          Check-out
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={checkIn || new Date().toISOString().split("T")[0]}
                          className="w-full border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-neutral-800 focus:outline-none transition-colors"
                          style={{ fontSize: "14px" }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-neutral-500 mb-2">
                          Guests
                        </label>
                        <input
                          type="number"
                          value={guest}
                          onChange={(e) =>
                            setGuest(
                              Math.max(
                                1,
                                Math.min(10, parseInt(e.target.value) || 1),
                              ),
                            )
                          }
                          className="w-full border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-neutral-800 focus:outline-none transition-colors"
                          min={1}
                          max={10}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Accommodation */}
            <section className="bg-white border border-neutral-200">
              <div className="px-6 py-5 border-b border-neutral-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-px bg-amber-500" />
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
                    Step 02
                  </span>
                </div>
                <h2 className="font-Cormorant text-2xl sm:text-3xl font-light text-neutral-900">
                  Your <span className="italic">accommodation</span>
                </h2>
              </div>

              <div className="px-6 py-6 flex flex-col sm:flex-row gap-5">
                <img
                  src={home.image || image}
                  alt={home.name || "Accommodation"}
                  className="w-full sm:w-44 h-44 sm:h-32 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-Cormorant text-2xl font-semibold text-neutral-900 mb-1 leading-snug">
                    {home.name}
                  </h3>
                  <p className="text-sm text-neutral-500">{home.location}</p>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white border border-neutral-200">
              <div className="px-6 py-5 border-b border-neutral-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-px bg-amber-500" />
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
                    Step 03
                  </span>
                </div>
                <h2 className="font-Cormorant text-2xl sm:text-3xl font-light text-neutral-900">
                  Choose payment <span className="italic">method</span>
                </h2>
              </div>

              <div className="px-6 py-6 space-y-3">
                <button
                  onClick={() => setPaymentMethod("full")}
                  className={`w-full text-left p-4 border transition-colors ${
                    paymentMethod === "full"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          paymentMethod === "full"
                            ? "border-neutral-900 bg-neutral-900"
                            : "border-neutral-300"
                        }`}
                      >
                        {paymentMethod === "full" && (
                          <span className="block w-1.5 h-1.5 bg-white rounded-full mx-auto mt-[3px]" />
                        )}
                      </span>
                      <span className="text-sm font-medium text-neutral-900">
                        Pay {formatPrice(pricing.total, userSelectedCurrency)} now
                      </span>
                    </div>
                    <FaShieldAlt className="text-emerald-600 text-sm" />
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("split")}
                  className={`w-full text-left p-4 border transition-colors ${
                    paymentMethod === "split"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          paymentMethod === "split"
                            ? "border-neutral-900 bg-neutral-900"
                            : "border-neutral-300"
                        }`}
                      >
                        {paymentMethod === "split" && (
                          <span className="block w-1.5 h-1.5 bg-white rounded-full mx-auto mt-[3px]" />
                        )}
                      </span>
                      <span className="text-sm font-medium text-neutral-900">
                        Pay part now, part later
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-600">
                      No extra fees
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 ml-7">
                    {formatPrice(
                      Math.floor(pricing.total * 0.6),
                      userSelectedCurrency,
                    )}{" "}
                    due today,{" "}
                    {formatPrice(
                      Math.floor(pricing.total * 0.4),
                      userSelectedCurrency,
                    )}{" "}
                    due next month
                  </p>
                </button>
              </div>
            </section>

            {/* Payment Provider */}
            <section className="bg-white border border-neutral-200">
              <div className="px-6 py-5 border-b border-neutral-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-px bg-amber-500" />
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
                    Step 04
                  </span>
                </div>
                <h2 className="font-Cormorant text-2xl sm:text-3xl font-light text-neutral-900">
                  Select payment <span className="italic">provider</span>
                </h2>
              </div>

              <div className="px-6 py-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => handleSelectPayment(option)}
                      className={`px-4 py-4 border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        selectedPayment.name === option.name
                          ? "border-neutral-900 bg-neutral-50 text-neutral-900"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                          selectedPayment.name === option.name
                            ? "border-neutral-900 bg-neutral-900"
                            : "border-neutral-300"
                        }`}
                      >
                        {selectedPayment.name === option.name && (
                          <span className="block w-1 h-1 bg-white rounded-full mx-auto mt-[2px]" />
                        )}
                      </span>
                      {option.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between px-4 py-3 border border-neutral-200 bg-neutral-50">
                  <div className="flex items-center gap-3">
                    <FaCheck className="text-amber-600 text-xs" />
                    <span className="text-sm font-medium text-neutral-900">
                      {selectedPayment.name} selected
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <FaLock className="text-[10px]" />
                      <span className="text-[10px] font-semibold tracking-widest uppercase">
                        Secure
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Terms */}
            <section className="bg-white border border-neutral-200 px-6 py-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-neutral-900"
                />
                <span className="text-sm text-neutral-700">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-medium text-neutral-900 underline hover:text-amber-600 transition-colors"
                    onClick={() => window.open("/terms", "_blank")}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="font-medium text-neutral-900 underline hover:text-amber-600 transition-colors"
                    onClick={() => window.open("/privacy", "_blank")}
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
            </section>

            {/* Payment Form */}
            <AnimatePresence>
              {showStripePayment &&
                (selectedPayment.name === "Stripe" ||
                  selectedPayment.name === "Flutterwave") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-neutral-200"
                  >
                    <FlutterwaveCheckoutForm
                      bookingData={{
                        ...createdBooking,
                        totalAmount:
                          createdBooking?.totalAmount ||
                          bookingData?.totalAmount ||
                          originalPrice * nights,
                        userEmail:
                          createdBooking?.userEmail ||
                          bookingData?.userEmail ||
                          "user@example.com",
                        bookingId: createdBooking?._id,
                      }}
                      onPaymentSuccess={handlePaymentSuccess}
                    />
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Confirm CTA */}
            {!showStripePayment && (
              <button
                onClick={handleBooking}
                disabled={isLoading}
                className="group w-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white py-4 font-medium text-sm tracking-widest uppercase transition-colors duration-200 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <ButtonLoader />
                    Processing
                  </>
                ) : (
                  <>
                    <FaShieldAlt className="text-xs" />
                    {selectedPayment.name === "Stripe"
                      ? "Confirm Booking Details"
                      : "Confirm & Pay"}
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Right Column — Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-neutral-200 sticky top-24">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={home.image || image}
                  alt={home.name || "Accommodation"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="px-6 py-5 border-b border-neutral-200">
                <h3 className="font-Cormorant text-2xl font-semibold text-neutral-900 leading-snug mb-1">
                  {home.name}
                </h3>
                <p className="text-sm text-neutral-500">{home.location}</p>
              </div>

              <div className="px-6 py-5 border-b border-neutral-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-amber-600 text-xs" />
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-500">
                    Trip Dates
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-900">
                  {formatDateRange(checkIn, checkOut)}
                </p>
                {pricing.nights > 0 && (
                  <p className="text-xs text-neutral-500 mt-1">
                    {pricing.nights} {pricing.nights === 1 ? "night" : "nights"} · {guest}{" "}
                    {guest === 1 ? "guest" : "guests"}
                  </p>
                )}
              </div>

              <div className="px-6 py-5 border-b border-neutral-200">
                <h4 className="font-Cormorant text-xl font-semibold text-neutral-900 mb-4">
                  Price details
                </h4>

                {pricing.nights > 0 ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">
                        {formatPrice(pricing.pricePerNight, userSelectedCurrency)} ×{" "}
                        {pricing.nights} {pricing.nights === 1 ? "night" : "nights"}
                      </span>
                      <span className="text-neutral-900 font-medium">
                        {formatPrice(pricing.basePrice, userSelectedCurrency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Cleaning fee</span>
                      <span className="text-neutral-900 font-medium">
                        {formatPrice(pricing.cleaningFee, userSelectedCurrency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Service fee</span>
                      <span className="text-neutral-900 font-medium">
                        {formatPrice(pricing.serviceFee, userSelectedCurrency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Taxes</span>
                      <span className="text-neutral-900 font-medium">
                        {formatPrice(pricing.taxes, userSelectedCurrency)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500">
                    Select dates to see pricing
                  </p>
                )}
              </div>

              <div className="px-6 py-5 bg-neutral-900 text-white">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-semibold tracking-widest uppercase text-neutral-300">
                    Total ({userSelectedCurrency})
                  </span>
                  <span className="font-Cormorant text-3xl font-light">
                    {pricing.total > 0
                      ? formatPrice(pricing.total, userSelectedCurrency)
                      : formatPrice(0, userSelectedCurrency)}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  {pricing.total > 0
                    ? `Includes all fees and taxes${
                        pricing.nights > 0
                          ? ` for ${pricing.nights} ${
                              pricing.nights === 1 ? "night" : "nights"
                            }`
                          : ""
                      }`
                    : "Select dates to calculate total"}
                </p>
              </div>

              <div className="px-6 py-5 space-y-2.5">
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  <FaShieldAlt className="text-emerald-600 text-xs flex-shrink-0" />
                  <span>Your payment information is secure</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  <FaLock className="text-emerald-600 text-xs flex-shrink-0" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  <FaCheck className="text-emerald-600 text-xs flex-shrink-0" />
                  <span>Free cancellation for 48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="hidden md:block border-t border-b border-neutral-200 py-12 mb-12">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-px bg-amber-500" />
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-600">
                Peace of Mind
              </span>
              <div className="w-6 h-px bg-amber-500" />
            </div>
            <h3 className="font-Cormorant text-3xl sm:text-4xl font-light text-neutral-900">
              Secure &amp; <span className="italic">protected booking</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            <div className="flex flex-col items-center text-center px-6 py-6">
              <FaShieldAlt className="text-2xl text-amber-600 mb-4" />
              <h4 className="font-Cormorant text-xl font-semibold text-neutral-900 mb-2">
                Safe Payment
              </h4>
              <p className="text-sm text-neutral-500">
                Industry-leading security on every transaction.
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-6 py-6">
              <FaCalendarAlt className="text-2xl text-amber-600 mb-4" />
              <h4 className="font-Cormorant text-xl font-semibold text-neutral-900 mb-2">
                Flexible Booking
              </h4>
              <p className="text-sm text-neutral-500">
                Free cancellation and date changes available.
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-6 py-6">
              <FaUsers className="text-2xl text-amber-600 mb-4" />
              <h4 className="font-Cormorant text-xl font-semibold text-neutral-900 mb-2">
                24/7 Support
              </h4>
              <p className="text-sm text-neutral-500">
                Our team is here to help you anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Fine Print */}
        <div className="border border-neutral-200 px-6 py-5 mb-16 text-center">
          <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl mx-auto">
            By selecting the button above, I agree to the{" "}
            <span className="font-medium text-neutral-900 underline cursor-pointer hover:text-amber-600 transition-colors">
              Host&apos;s House Rules
            </span>
            ,{" "}
            <span className="font-medium text-neutral-900 underline cursor-pointer hover:text-amber-600 transition-colors">
              Ground rules for guests
            </span>
            ,{" "}
            <span className="font-medium text-neutral-900 underline cursor-pointer hover:text-amber-600 transition-colors">
              HomeHive&apos;s Rebooking and Refund Policy
            </span>
            , and that HomeHive can{" "}
            <span className="font-medium text-neutral-900 underline cursor-pointer hover:text-amber-600 transition-colors">
              charge my payment method
            </span>{" "}
            if I&apos;m responsible for damage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
