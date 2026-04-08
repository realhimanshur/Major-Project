const mongoose = require("mongoose");

const organizerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,

    image: {
      type: String,
      default: "https://via.placeholder.com/150",
    },

    // ✅ ADD THIS
    organization: {
      type: String,
      default: "",
    },

    // ✅ ADD THIS
    bio: {
      type: String,
      default: "",
    },

    description: String,

    location: String,

    rating: {
      type: Number,
      default: 4.5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    specialties: [
      {
        type: String,
      },
    ],

    price: {
      type: Number,
      default: 1000,
    },

    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organizer", organizerSchema);