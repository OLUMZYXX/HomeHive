import { useState } from "react";
import PaymentForm from "./PaymentForm";
import PaymentSuccess from "./PaymentSuccess";

const PaymentContainer = ({ booking, onCancel }) => {
  const [paymentStep, setPaymentStep] = useState("payment"); // 'payment' or 'success'
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const handlePaymentSuccess = (booking) => {
    setConfirmedBooking(booking);
    setPaymentStep("success");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {paymentStep === "payment" && (
          <PaymentForm
            booking={booking}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={onCancel}
          />
        )}

        {paymentStep === "success" && (
          <PaymentSuccess booking={confirmedBooking} />
        )}
      </div>
    </div>
  );
};

export default PaymentContainer;
