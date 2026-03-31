const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    location: {
      city: String,
      state: String,
      country: String,
    },

    pricePerHour: {
      type: Number,
      required: true,
    },

    capacity: {
      min: Number,
      max: Number,
    },

    rating: {
      type: Number,
      default: 4.5,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },

    amenities: [
      {
        type: String,
      },
    ],

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String, // Ballroom, Beach, Conference etc.
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Venue", venueSchema);