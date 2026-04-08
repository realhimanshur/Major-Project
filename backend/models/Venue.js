const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    images: [String],
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Venue", venueSchema);