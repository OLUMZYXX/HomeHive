import React, { useState, useEffect } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { toast } from "sonner";
import { FaLock } from "react-icons/fa";
import axiosInstance from "../../config/axios";
import { ButtonLoader } from "../common/Loader";

const FlutterwaveCheckoutForm = ({ bookingData, onPaymentSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: bookingData.userEmail || "",
    phone: "",
  });

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Create payment link when component mounts
    const createPaymentIntent = async () => {
      try {
        const amount = bookingData.totalAmount || 0; // Amount is already in NGN, no conversion needed
        const response = await axiosInstance.post("/payments/create-intent", {
          amount,
          bookingId: bookingData.bookingId || bookingData._id,
        });
        setPaymentData(response.data);
      } catch (error) {
        console.error("Error creating payment:", error);
        toast.error("Failed to initialize payment. Please try again.");
      }
    };

    if (bookingData && (bookingData.bookingId || bookingData._id)) {
      createPaymentIntent();
    }
  }, [bookingData]);

  const config = {
    public_key:
      import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY ||
      "FLWPUBK_TEST-e7bdb79e404b6d80ac63d8ff8bed7512-X",
    tx_ref: paymentData?.tx_ref || `booking-${Date.now()}`,
    amount: bookingData.totalAmount || 0,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email:
        billingDetails.email || bookingData.userEmail || "customer@example.com",
      phone_number: billingDetails.phone || bookingData.userPhone || "",
      name: billingDetails.name || bookingData.userName || "Customer",
    },
    customizations: {
      title: "HomeHive Booking Payment",
      description: `Payment for booking ${bookingData.bookingId || bookingData._id}`,
      logo: "https://homehive.com/logo.png",
    },
    meta: {
      bookingId: bookingData.bookingId || bookingData._id,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate required fields
    if (!billingDetails.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!billingDetails.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setProcessing(true);

    try {
      // Initialize Flutterwave payment
      await handleFlutterPayment({
        callback: (response) => {
          console.log("Payment response:", response);
          if (response.status === "successful") {
            toast.success("Payment successful! Booking confirmed.");
            onPaymentSuccess({
              id: response.transaction_id,
              status: "successful",
              tx_ref: response.tx_ref,
              amount: bookingData.totalAmount,
            });
          } else {
            toast.error("Payment was not successful. Please try again.");
          }
          setProcessing(false);
          closePaymentModal();
        },
        onClose: () => {
          console.log("Payment modal closed");
          setProcessing(false);
        },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-primary-25 to-neutral-50 rounded-xl border border-primary-200">
      <div className="flex items-center gap-3 mb-6">
        <FaLock className="text-primary-600" />
        <h3 className="text-lg font-bold text-primary-800">
          Secure Payment with Flutterwave
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={billingDetails.name}
            onChange={handleBillingChange}
            placeholder="Enter your full name"
            className="w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300 bg-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={billingDetails.email}
            onChange={handleBillingChange}
            placeholder="Enter your email address"
            className="w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300 bg-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={billingDetails.phone}
            onChange={handleBillingChange}
            placeholder="Enter your phone number"
            className="w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-primary-600 mb-4">
          <FaLock />
          <span>Your payment information is secure and encrypted</span>
        </div>

        <button
          type="submit"
          disabled={processing || !paymentData}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl font-bold text-base shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {processing ? (
            <>
              <ButtonLoader />
              Processing Payment...
            </>
          ) : (
            <>
              <FaLock />
              Pay Now - ₦{bookingData.totalAmount?.toLocaleString()}
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Secure payment powered by Flutterwave</p>
        <p>Multiple payment options available</p>
      </div>
    </div>
  );
};

export default FlutterwaveCheckoutForm;
