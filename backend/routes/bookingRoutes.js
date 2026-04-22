const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

/* ================================
   🔥 CORE ROUTES
================================ */

// ✅ MUST MATCH FRONTEND
router.get("/my-bookings", bookingController.getMyBookings);

// Slots
router.get("/slots", bookingController.getAvailableSlots);

// Create booking
router.post("/", bookingController.createBooking);

// Get all bookings
router.get("/", bookingController.getBookings);

/* ================================
   💳 PAYMENT ROUTES
================================ */

// ⚠️ Only add if exists in controller
if (bookingController.getRazorpayKey) {
  router.get("/razorpay-key", bookingController.getRazorpayKey);
}

if (bookingController.createPaymentOrder) {
  router.post("/create-order", bookingController.createPaymentOrder);
}

if (bookingController.verifyPayment) {
  router.post("/verify-payment", bookingController.verifyPayment);
}

/* ================================
   📊 ANALYTICS ROUTES (SAFE)
================================ */

if (bookingController.getDashboardSummary) {
  router.get("/analytics/summary", bookingController.getDashboardSummary);
}

if (bookingController.getRevenueTrend) {
  router.get("/analytics/revenue-trend", bookingController.getRevenueTrend);
}

if (bookingController.getTicketDistribution) {
  router.get(
    "/analytics/ticket-distribution",
    bookingController.getTicketDistribution
  );
}

if (bookingController.getAttendeeInsights) {
  router.get(
    "/analytics/attendee-insights",
    bookingController.getAttendeeInsights
  );
}

/* ================================
   ⚠️ KEEP THESE LAST
================================ */

// Safe route registration
if (typeof bookingController.getBookingById === "function") {
  router.get("/:id", bookingController.getBookingById);
}

if (typeof bookingController.updatePaymentStatus === "function") {
  router.put("/:id/payment", bookingController.updatePaymentStatus);
}
module.exports = router;