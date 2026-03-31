const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

// ✅ CREATE BOOKING
router.post("/", bookingController.createBooking);

// ✅ GET ALL BOOKINGS
router.get("/", bookingController.getBookings);

// ✅ GET SINGLE BOOKING
router.get("/:id", bookingController.getBookingById);

// ✅ UPDATE PAYMENT STATUS
router.put("/:id/payment", bookingController.updatePaymentStatus);

// ✅ CREATE PAYMENT ORDER
router.post("/create-order", bookingController.createPaymentOrder);

module.exports = router;