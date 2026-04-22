const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
// const { getRazorpayKey } = bookingController;

// 🔥 NEW: GET MY BOOKINGS (USER SPECIFIC)
router.get("/my", bookingController.getMyBookings);

// 🔥 NEW: GET AVAILABLE SLOTS
router.get("/slots", bookingController.getAvailableSlots);

// ===============================
// 📊 ANALYTICS ROUTES (ADDED)
// ===============================

// Dashboard Summary
router.get("/analytics/summary", bookingController.getDashboardSummary);

// Revenue Trend
router.get("/analytics/revenue-trend", bookingController.getRevenueTrend);

// Ticket Distribution
router.get(
  "/analytics/ticket-distribution",
  bookingController.getTicketDistribution
);

// Attendee Insights
router.get(
  "/analytics/attendee-insights",
  bookingController.getAttendeeInsights
);

// ===============================
// ✅ EXISTING ROUTES (UNCHANGED)
// ===============================

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getBookings);
router.get("/razorpay-key", bookingController.getRazorpayKey);

router.post("/create-order", bookingController.createPaymentOrder);
router.post("/verify-payment", bookingController.verifyPayment);

// ⚠️ KEEP THIS LAST (VERY IMPORTANT)
router.get("/:id", bookingController.getBookingById);
router.put("/:id/payment", bookingController.updatePaymentStatus);

module.exports = router;