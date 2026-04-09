const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    // ✅ OLD FORMAT (OBJECT)
    location: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },

    // ✅ OLD FORMAT (OBJECT)
    capacity: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },

    // ✅ OLD FORMAT
    pricePerHour: {
      type: Number,
    },

    images: [String],

    description: String,

    category: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Venue", venueSchema);