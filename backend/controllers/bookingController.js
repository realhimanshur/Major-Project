const Booking = require("../models/Booking");
const Organizer = require("../models/Organizer");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

/* ================= HELPER ================= */

// 🔥 SLOT CONFLICT CHECK (SAFE)

const isSlotConflict = async (venueId, date, startTime, endTime) => {
  const existingBookings = await Booking.find({
    venue: venueId,
    eventDate: date,
  });

  return existingBookings.some((b) => {
    return b.startTime < endTime && b.endTime > startTime;
  });
};

// ✅ CREATE BOOKING (FULL FIXED VERSION)
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

    console.log("Incoming booking data:", req.body);

    // ✅ VALIDATE ORGANIZER ID FORMAT
    if (!organizerId || organizerId.length !== 24) {
      return res.status(400).json({ message: "Invalid organizerId" });
    }

    const organizer = await Organizer.findById(organizerId);

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // 🔥 SLOT CHECK ONLY IF TIMES PROVIDED
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
    console.error("❌ Create Booking Error FULL:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message, // 👈 IMPORTANT (you will now see real error)
    });
  }
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

    console.log("Incoming booking:", req.body);

    // ✅ Validate organizer
    if (!organizerId || organizerId.length !== 24) {
      return res.status(400).json({ message: "Invalid organizerId" });
    }

    const organizer = await Organizer.findById(organizerId);

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // ✅ Slot check
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

    // ✅ Create booking
    const booking = await Booking.create({
      organizer: organizerId,
      venue: venueId || null,
      name,
      email,
      phone,
      eventType,
      eventDate,
      location,

      // 🔥 IMPORTANT FIX
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

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

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

exports.getRazorpayKey = (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
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

/* ================= BASIC ================= */

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("organizer", "name image location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 FILTERED (IMPORTANT FIX)
exports.getMyBookings = async (req, res) => {
  try {
    const { organizerId } = req.query;

    const bookings = await Booking.find({
      organizer: organizerId,
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    booking.status = "confirmed";

    await booking.save();

    res.json({ message: "Payment successful", booking });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ANALYTICS ================= */

exports.getDashboardSummary = async (req, res) => {
  try {
    const { organizerId } = req.query;

    const bookings = await Booking.find({
      organizer: organizerId,
    });

    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + (b.budget || 0), 0);

    res.json({
      totalEvents: 0,
      totalAttendees: bookings.length,
      totalRevenue,
      avgRating: 4.8,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRevenueTrend = async (req, res) => {
  try {
    const { organizerId } = req.query;
    const mongoose = require("mongoose");

    const data = await Booking.aggregate([
      {
        $match: {
          organizer: new mongoose.Types.ObjectId(organizerId),
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$budget" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      data.map((d) => ({
        date: d._id,
        revenue: d.revenue,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Ticket Distribution
exports.getTicketDistribution = async (req, res) => {
  try {
    const { organizerId } = req.query;

    const data = await Booking.aggregate([
      {
        $match: {
          organizer: new require("mongoose").Types.ObjectId(organizerId),
        },
      },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(
      data.map((d) => ({
        type: d._id,
        count: d.count,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Attendee Insights
exports.getAttendeeInsights = async (req, res) => {
  try {
    const { organizerId } = req.query;

    const bookings = await Booking.find({
      organizer: organizerId,
    });

    const total = bookings.length;
    const checkIns = bookings.filter((b) => b.status === "confirmed").length;

    const noShowRate = total
      ? ((total - checkIns) / total) * 100
      : 0;

    res.json({
      totalRegistrations: total,
      checkIns,
      noShowRate: Math.round(noShowRate),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
