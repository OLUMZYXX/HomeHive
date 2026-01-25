import express from "express";
import Flutterwave from "flutterwave-node-v3";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { mongoBookingService } from "../services/mongoBookingService.js";
import { User } from "../models/mongodb-models.js";

const router = express.Router();

// Initialize Flutterwave if secret key is configured
let flutterwave = null;
if (process.env.FLUTTERWAVE_SECRET_KEY) {
  flutterwave = new Flutterwave(
    process.env.FLUTTERWAVE_PUBLIC_KEY,
    process.env.FLUTTERWAVE_SECRET_KEY,
  );
} else {
  console.warn(
    "FLUTTERWAVE_SECRET_KEY environment variable is not set - payments disabled",
  );
}

// Create payment intent
router.post("/create-intent", authenticateToken, async (req, res) => {
  if (!flutterwave) {
    return res.status(503).json({ error: "Payment service unavailable" });
  }
  try {
    const { amount, bookingId } = req.body;
    const user = req.user;

    console.log("Creating Flutterwave payment:", {
      amount,
      bookingId,
      userId: user.id,
    });

    // Verify the booking exists and belongs to the user
    const booking = await mongoBookingService.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.userId !== user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to pay for this booking" });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({ error: "Booking is already confirmed" });
    }

    // Get full user information from database
    const userDetails = await User.findById(user.id).select(
      "name email phone firstName lastName",
    );
    if (!userDetails) {
      console.error("User not found in database:", user.id);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User details found:", {
      id: userDetails._id,
      email: userDetails.email,
      name: userDetails.name,
      phone: userDetails.phone,
    });

    // Initialize Flutterwave transaction
    const payload = {
      tx_ref: `booking-${bookingId}-${Date.now()}`,
      amount: amount, // Amount is already in NGN, no conversion needed
      currency: "NGN",
      redirect_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/booking-confirmation/${bookingId}`,
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email: userDetails.email,
        name:
          userDetails.name ||
          `${userDetails.firstName || ""} ${userDetails.lastName || ""}`.trim() ||
          "Customer",
        phone_number: userDetails.phone || "+2340000000000", // Default phone if not provided
      },
      customizations: {
        title: "HomeHive Booking Payment",
        description: `Payment for booking ${bookingId}`,
        logo: "https://homehive.com/logo.png",
      },
      meta: {
        bookingId: bookingId,
        userId: user.id,
      },
    };

    // Use direct API call instead of SDK
    const axios = (await import("axios")).default;
    console.log("Making Flutterwave API call with payload:", payload);
    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Flutterwave API response:", response.data);

    if (response.data.status === "success") {
      // Update booking with transaction reference
      await mongoBookingService.updateBooking(bookingId, {
        paymentRef: payload.tx_ref,
        status: "payment_pending",
      });

      res.json({
        paymentLink: response.data.data.link,
        tx_ref: payload.tx_ref,
      });
    } else {
      throw new Error("Failed to initialize payment");
    }
  } catch (error) {
    console.error("Error creating Flutterwave payment:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// Handle successful payment and confirm booking
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    if (!flutterwave) {
      return res.status(503).json({ error: "Payment service unavailable" });
    }

    try {
      // Verify webhook signature
      const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
      const signature = req.headers["verif-hash"];

      if (!signature || signature !== secretHash) {
        return res.status(401).json({ error: "Invalid signature" });
      }

      const payload = JSON.parse(req.body);

      // Handle successful payment
      if (
        payload.event === "charge.completed" &&
        payload.data.status === "successful"
      ) {
        const transaction = payload.data;
        console.log("Flutterwave payment succeeded:", transaction.tx_ref);

        try {
          // Find booking by transaction reference
          const bookingId =
            transaction.meta?.bookingId || transaction.tx_ref.split("-")[1];
          await mongoBookingService.updateBooking(bookingId, {
            status: "confirmed",
            paymentStatus: "paid",
            confirmedAt: new Date(),
            paymentRef: transaction.tx_ref,
            paymentId: transaction.id,
          });

          console.log(
            `Booking ${bookingId} confirmed after successful Flutterwave payment`,
          );
        } catch (error) {
          console.error("Error confirming booking after payment:", error);
        }
      } else if (
        payload.event === "charge.completed" &&
        payload.data.status === "failed"
      ) {
        const transaction = payload.data;
        console.log("Flutterwave payment failed:", transaction.tx_ref);

        try {
          const bookingId =
            transaction.meta?.bookingId || transaction.tx_ref.split("-")[1];
          await mongoBookingService.updateBooking(bookingId, {
            status: "payment_failed",
            paymentStatus: "failed",
            paymentRef: transaction.tx_ref,
          });
        } catch (error) {
          console.error("Error updating booking after payment failure:", error);
        }
      }

      res.json({ status: "success" });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  },
);

export default router;
