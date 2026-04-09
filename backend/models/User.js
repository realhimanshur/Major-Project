const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "favorites.itemType",
    },
    itemType: {
      type: String,
      required: true,
      enum: ["Event", "Venue"],
    },
  },
  { _id: false }
);

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

    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
    },

    // ✅ UPDATED FAVORITES (EVENT + VENUE SUPPORT)
    favorites: [favoriteSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);