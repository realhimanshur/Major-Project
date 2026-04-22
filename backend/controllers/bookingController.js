const Booking = require("../models/Booking");
const Organizer = require("../models/Organizer");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

/* ================= HELPER ================= */

const isSlotConflict = async (venueId, date, startTime, endTime) => {
  const existingBookings = await Booking.find({
    venue: venueId,
    eventDate: date,
  });

  return existingBookings.some((b) => {
    return b.startTime < endTime && b.endTime > startTime;
  });
};

/* ================= CREATE BOOKING ================= */

exports.createBooking = async (req, res) => {
  try {
    const {
      organizerId,
      venueId,
      name,
      email,
      phone,
      eventType,
      eventDate,
      location,
      budget,
      notes,
      startTime,
      endTime,
    } = req.body;

    if (!organizerId || organizerId.length !== 24) {
      return res.status(400).json({ message: "Invalid organizerId" });
    }

    const organizer = await Organizer.findById(organizerId);

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    if (venueId && startTime && endTime) {
      const conflict = await isSlotConflict(
        venueId,
        eventDate,
        startTime,
        endTime
      );

      if (conflict) {
        return res.status(400).json({
          message: "Slot already booked ❌",
        });
      }
    }

    const booking = await Booking.create({
      organizer: organizerId,
      venue: venueId || null,
      name,
      email,
      phone,
      eventType,
      eventDate,
      location,
      amount: budget,
      budget,
      notes,
      startTime: startTime || null,
      endTime: endTime || null,
      paymentStatus: "pending",
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    console.error("❌ Create Booking Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/* ================= GET MY BOOKINGS (🔥 FIXED) ================= */

exports.getMyBookings = async (req, res) => {
  try {
    const organizerId = req.query.organizerId || req.user?.id;

    // ✅ If no organizerId → return empty instead of crash
    if (!organizerId) {
      return res.json([]);
    }

    const bookings = await Booking.find({
      organizer: organizerId,
    }).sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    console.error("❌ getMyBookings Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL BOOKINGS ================= */

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("organizer", "name image location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= SLOTS ================= */

exports.getAvailableSlots = async (req, res) => {
  try {
    const { venueId, date } = req.query;

    if (!venueId || !date) {
      return res.status(400).json({
        message: "venueId and date are required",
      });
    }

    const bookings = await Booking.find({
      venue: venueId,
      eventDate: date,
    });

    const allSlots = [
      { start: "10:00", end: "12:00" },
      { start: "12:00", end: "14:00" },
      { start: "14:00", end: "16:00" },
      { start: "16:00", end: "18:00" },
      { start: "18:00", end: "21:00" },
    ];

    const bookedSlots = bookings.map((b) => ({
      start: b.startTime,
      end: b.endTime,
    }));

    const availableSlots = allSlots.map((slot) => {
      const isBooked = bookedSlots.some(
        (b) => b.start === slot.start && b.end === slot.end
      );

      return {
        ...slot,
        available: !isBooked,
      };
    });

    res.json(availableSlots);

  } catch (error) {
    console.error("Slot Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= PAYMENT ================= */

exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);

  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ message: "Payment failed" });
  }
};

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
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment ❌" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
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

/* ================= EXTRA SAFE HANDLERS ================= */

// ✅ Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("getBookingById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update payment status (simple version)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    booking.status = "confirmed";

    await booking.save();

    res.json({ message: "Payment updated", booking });
  } catch (error) {
    console.error("updatePaymentStatus error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Razorpay Key
exports.getRazorpayKey = (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};

// ================= ANALYTICS (SAFE DUMMY FOR NOW) =================

// These prevent crashes — you can improve later

exports.getDashboardSummary = async (req, res) => {
  res.json({
    totalEvents: 0,
    totalAttendees: 0,
    totalRevenue: 0,
    avgRating: 0,
  });
};

exports.getRevenueTrend = async (req, res) => {
  res.json([]);
};

exports.getTicketDistribution = async (req, res) => {
  res.json([]);
};

exports.getAttendeeInsights = async (req, res) => {
  res.json({
    totalRegistrations: 0,
    checkIns: 0,
    noShowRate: 0,
  });
};