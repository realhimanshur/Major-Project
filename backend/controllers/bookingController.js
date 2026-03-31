const Booking = require("../models/Booking");
const Organizer = require("../models/Organizer");
const razorpay = require("../config/razorpay");

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

    // 🔍 check organizer exists
    const organizer = await Organizer.findById(organizerId);
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // 💾 create booking
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

    const options = {
      amount: amount * 100, // ₹ to paise
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

// ✅ UPDATE PAYMENT STATUS (for Razorpay later)
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