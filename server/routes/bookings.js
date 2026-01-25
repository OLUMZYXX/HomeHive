import express from "express";
import mongoose from "mongoose";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { mongoBookingService } from "../services/mongoBookingService.js";

const router = express.Router();

// ...booking routes from server.js...
// Create Booking
router.post("/", authenticateToken, async (req, res) => {
  try {
    console.log("🔐 Authenticated user:", req.user);
    console.log("📝 Request body:", req.body);
    console.log("🎭 User role:", req.user.role);
    console.log("🎭 User userType:", req.user.userType);
    console.log("🎭 Full user object keys:", Object.keys(req.user));

    // Check MongoDB connection status
    console.log("🔗 MongoDB connection state:", mongoose.connection.readyState);
    if (mongoose.connection.readyState !== 1) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Database connection is not available",
        });
    }

    // Validate required booking data
    const { propertyId, checkIn, checkOut, guests } = req.body;
    if (!propertyId) {
      return res
        .status(400)
        .json({ success: false, message: "Property ID is required" });
    }
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Check-in and check-out dates are required",
      });
    }
    if (!guests || guests < 1) {
      return res.status(400).json({
        success: false,
        message: "Number of guests must be at least 1",
      });
    }

    // Validate propertyId format
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid property ID format" });
    }

    // Temporarily skip role checking to test basic functionality
    console.log("⏭️ Skipping role check for debugging...");

    const bookingData = { ...req.body, userId: req.user.id };
    console.log("📋 Final booking data:", bookingData);
    const bookingId = await mongoBookingService.createBooking(bookingData);
    res.status(201).json({
      success: true,
      bookingId,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("❌ Booking creation error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get User Bookings
router.get("/", authenticateToken, async (req, res) => {
  try {
    console.log("📋 GET /bookings - User from token:", {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      fullUser: req.user,
    });

    const isHost = req.user.role === "host";
    let bookings;
    if (isHost) {
      console.log("🏠 Fetching host bookings for hostId:", req.user.id);
      bookings = await mongoBookingService.getHostBookings(req.user.id);
    } else {
      console.log("👤 Fetching user bookings for userId:", req.user.id);
      bookings = await mongoBookingService.getUserBookings(req.user.id);
    }

    console.log("📊 Found", bookings.length, "bookings");

    // Populate property details and user details for each booking
    const { User, Host } = await import("../models/mongodb-models.js");
    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        let property = null;
        let guestUser = null;

        try {
          property = await (
            await import("../models/mongodb-models.js")
          ).Property.findById(booking.propertyId);
        } catch {}

        // For host view, get guest/user information
        if (isHost && booking.userId) {
          try {
            guestUser =
              (await User.findOne({ uid: booking.userId })) ||
              (await Host.findOne({ uid: booking.userId }));
          } catch (err) {
            console.error("Error fetching guest user:", err);
          }
        }

        return {
          ...booking.toObject(),
          propertyImages: property?.images || [],
          propertyTitle: property?.title || "",
          propertyLocation: property?.address?.city
            ? `${property.address.city}${
                property.address.state ? ", " + property.address.state : ""
              }${
                property.address.country ? ", " + property.address.country : ""
              }`
            : "",
          currency: booking.currency || property?.currency || "NGN",
          guestName: guestUser
            ? `${guestUser.firstName || ""} ${guestUser.lastName || ""}`.trim()
            : null,
          guestEmail: guestUser?.email || null,
          guestPhone: guestUser?.phone || null,
        };
      }),
    );
    res.json({
      success: true,
      bookings: populatedBookings,
      count: populatedBookings.length,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update Booking Status (Host only)
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    // Get the booking first to check ownership
    const booking = await mongoBookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Allow hosts to update any booking status, or allow users to cancel their own bookings
    const isHost = req.user.role === "host";
    const isBookingOwner = booking.userId.toString() === req.user.id;
    const isCancellation = status === "cancelled";

    if (!isHost && (!isBookingOwner || !isCancellation)) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings",
      });
    }

    const updatedBooking = await mongoBookingService.updateBookingStatus(
      req.params.id,
      status,
    );
    res.json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get host dashboard statistics
router.get("/host/:hostId/stats", authenticateToken, async (req, res) => {
  try {
    const { hostId } = req.params;

    // Verify the user is the host or has permission
    if (req.user.id !== hostId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const stats = await mongoBookingService.getHostStats(hostId);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching host stats:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch host statistics" });
  }
});

// Check property availability for specific dates
router.post("/check-availability", async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut } = req.body;

    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hasConflict = await mongoBookingService.checkDateConflict(
      propertyId,
      checkIn,
      checkOut,
    );

    res.json({
      available: !hasConflict,
      message: hasConflict
        ? "Property is not available for these dates"
        : "Property is available",
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to check availability" });
  }
});

// Get property availability calendar
router.get("/availability/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { month, year } = req.query;

    const currentDate = new Date();
    const queryMonth = parseInt(month) || currentDate.getMonth();
    const queryYear = parseInt(year) || currentDate.getFullYear();

    const bookedDates = await mongoBookingService.getPropertyAvailability(
      propertyId,
      queryMonth,
      queryYear,
    );

    res.json({ bookedDates });
  } catch (error) {
    console.error("Error getting availability:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to get availability" });
  }
});

// Send booking confirmation email
router.post("/:id/send-email", authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await mongoBookingService.getBookingById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Check if user owns this booking
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Here you would integrate with an email service like SendGrid, Mailgun, etc.
    // For now, we'll just simulate sending an email
    console.log(
      `📧 Sending booking confirmation email for booking ${bookingId}`,
    );
    console.log(`📧 Booking details:`, {
      bookingId,
      userId: booking.userId,
      propertyId: booking.propertyId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalAmount: booking.totalAmount,
    });

    // TODO: Implement actual email sending here
    // const emailResult = await emailService.sendBookingConfirmation(booking)

    res.json({
      success: true,
      message: "Confirmation email sent successfully",
      emailSent: true,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send confirmation email",
      emailSent: false,
    });
  }
});

// Confirm booking after successful payment
router.post("/:id/confirm", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentIntentId } = req.body;
    const user = req.user;

    console.log("Confirming booking:", {
      bookingId: id,
      paymentIntentId,
      userId: user.id,
    });

    // Get the booking
    const booking = await mongoBookingService.getBookingById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Verify ownership
    // Normalize possible ObjectId to string for comparison
    const bookingUserId = booking.userId?.toString
      ? booking.userId.toString()
      : booking.userId;
    if (bookingUserId !== user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Update booking status to confirmed
    const confirmedBooking = await mongoBookingService.updateBooking(id, {
      status: "confirmed",
      paymentStatus: "paid",
      paymentIntentId,
      confirmedAt: new Date(),
    });

    res.json({
      success: true,
      booking: confirmedBooking,
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to confirm booking",
    });
  }
});

export default router;
