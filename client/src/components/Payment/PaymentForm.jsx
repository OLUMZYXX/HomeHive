import React, { useState, useEffect } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { toast } from "react-toastify";
import { useAPI } from "../../contexts/APIContext";

const PaymentForm = ({ booking, onPaymentSuccess, onCancel }) => {
  const { apiCall } = useAPI();
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: booking?.userEmail || "",
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
    // Create payment when component mounts
    const createPayment = async () => {
      try {
        const response = await apiCall("/api/payments/create-intent", "POST", {
          amount: booking.totalAmount * 100, // Convert to cents for consistency
          bookingId: booking._id,
        });
        setPaymentData(response);
      } catch (error) {
        console.error("Error creating payment:", error);
        toast.error("Failed to initialize payment. Please try again.");
      }
    };

    if (booking) {
      createPayment();
    }
  }, [booking, apiCall]);

  const config = {
    public_key:
      import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY ||
      "FLWPUBK_TEST-e7bdb79e404b6d80ac63d8ff8bed7512-X",
    tx_ref: paymentData?.tx_ref || `booking-${Date.now()}`,
    amount: booking?.totalAmount || 0,
    currency: "USD",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email:
        billingDetails.email || booking?.userEmail || "customer@example.com",
      phone_number: billingDetails.phone || booking?.userPhone || "",
      name: billingDetails.name || booking?.userName || "Customer",
    },
    customizations: {
      title: "HomeHive Booking Payment",
      description: `Payment for booking ${booking?._id}`,
      logo: "https://homehive.com/logo.png",
    },
    meta: {
      bookingId: booking?._id,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      await handleFlutterPayment({
        callback: async (response) => {
          console.log("Payment response:", response);
          if (response.status === "successful") {
            try {
              // Confirm the booking on the server
              const confirmResponse = await apiCall(
                `/api/bookings/${booking._id}/confirm`,
                "POST",
                {
                  paymentId: response.transaction_id,
                },
              );

              toast.success("Payment successful! Booking confirmed.");
              onPaymentSuccess(confirmResponse.booking);
            } catch (error) {
              console.error("Error confirming booking:", error);
              toast.error(
                "Payment successful but booking confirmation failed. Please contact support.",
              );
            }
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

  if (!booking) {
    return <div>Loading booking details...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Complete Your Payment
      </h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Booking Summary</h3>
        <p className="text-sm text-gray-600 mb-1">
          Property: {booking.propertyTitle}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 mb-1">Guests: {booking.guests}</p>
        <div className="border-t pt-2 mt-2">
          <p className="font-semibold">Total: ${booking.totalAmount}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={billingDetails.name}
            onChange={handleBillingChange}
            placeholder="Enter your full name"
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={billingDetails.email}
            onChange={handleBillingChange}
            placeholder="Enter your email address"
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={billingDetails.phone}
            onChange={handleBillingChange}
            placeholder="Enter your phone number"
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={processing || !paymentData}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? "Processing..." : `Pay $${booking.totalAmount}`}
          </button>
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Secure payment powered by Flutterwave</p>
        <p>Multiple payment options available</p>
      </div>
    </div>
  );
};

export default PaymentForm;
