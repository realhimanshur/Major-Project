const express = require("express");
const router = express.Router();
const { getRazorpayKey } = require("../controllers/bookingController");
const bookingController = require("../controllers/bookingController");

// ✅ ADD THIS FIRST (VERY IMPORTANT)
router.get("/my-bookings", async (req, res) => {
  try {
    const bookings = await require("../models/Booking")
      .find()
      .populate("organizer", "name image location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Get My Bookings Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ EXISTING ROUTES
router.post("/", bookingController.createBooking);
router.get("/", bookingController.getBookings);
router.get("/razorpay-key", getRazorpayKey);
router.get("/:id", bookingController.getBookingById);
router.put("/:id/payment", bookingController.updatePaymentStatus);
router.post("/create-order", bookingController.createPaymentOrder);
router.post("/verify-payment", bookingController.verifyPayment);

module.exports = router;