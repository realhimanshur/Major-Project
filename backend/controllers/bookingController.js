const Booking = require("../models/Booking");
const Organizer = require("../models/Organizer");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

// ✅ CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const {
      organizerId,
      name,
      email,
      phone,
      eventType,
      eventDate,
      location,
      budget,
      notes,
    } = req.body;

    const organizer = await Organizer.findById(organizerId);
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    const booking = await Booking.create({
      organizer: organizerId,
      name,
      email,
      phone,
      eventType,
      eventDate,
      location,
      budget,
      notes,
      paymentStatus: "pending",
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CREATE RAZORPAY ORDER
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ message: "Payment failed" });
  }
};

// SEND RAZORPAY KEY TO FRONTEND (ADD THIS)
exports.getRazorpayKey = (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
  });
};

//VERIFY PAYMENT (SECURE)
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment ❌" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    booking.paymentId = razorpay_payment_id;
    booking.status = "confirmed";

    await booking.save();

    res.json({
      message: "Payment verified & booking confirmed ✅",
      booking,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

// ✅ GET ALL BOOKINGS (ADMIN / TEST)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("organizer", "name image location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 NEW: GET MY BOOKINGS (ATTENDEE DASHBOARD FIX)
exports.getMyBookings = async (req, res) => {
  try {
    // ⚠️ Currently returning all bookings (no auth yet)
    // Later: filter by req.user._id

    const bookings = await Booking.find()
      .populate("organizer", "name image location")
      .sort({ createdAt: -1 });

    res.json(bookings); // ✅ MUST be array
  } catch (error) {
    console.error("Get My Bookings Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET SINGLE BOOKING
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "organizer",
      "name image location"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Get Booking Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ⚠️ KEEP (OPTIONAL OLD METHOD)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    booking.paymentId = paymentId;
    booking.status = "confirmed";

    await booking.save();

    res.json({
      message: "Payment successful",
      booking,
    });
  } catch (error) {
    console.error("Payment Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};