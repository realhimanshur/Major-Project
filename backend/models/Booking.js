const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // 🔗 RELATIONS
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // 🆕 EVENT (ADDED)
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    // 🏟️ VENUE
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: false,
    },

    // 👤 USER DETAILS
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    // 📅 EVENT DETAILS
    eventType: {
      type: String,
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
    },

    // 💰 ACTUAL PAYMENT (NEW)
    amount: {
      type: Number,
      required: true,
    },

    notes: {
      type: String,
    },

    // ⏰ SLOT BOOKING
    startTime: {
      type: String,
    },

    endTime: {
      type: String,
    },

    // 🎟️ TICKET TYPE (NEW)
    ticketType: {
      type: String,
      enum: ["VIP", "General", "Early Bird"],
      default: "General",
    },

    // 👥 CHECK-IN (NEW)
    checkInStatus: {
      type: Boolean,
      default: false,
    },

    // 💳 PAYMENT
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    paymentId: String,

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

// ⚡ INDEX FOR ANALYTICS
bookingSchema.index({ organizer: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);