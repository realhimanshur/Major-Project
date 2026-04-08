const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "organizer", "attendee"],
      default: "attendee",
    },

    // 🔥 LINK TO ORGANIZER
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
    },

    // ✅ NEW: FAVORITES (EVENT IDS)
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);