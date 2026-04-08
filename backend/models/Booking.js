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
      required: false, // optional for now
    },

    // 👤 USER DETAILS (for form)
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

    notes: {
      type: String,
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
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
