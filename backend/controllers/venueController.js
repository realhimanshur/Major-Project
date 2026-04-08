const Venue = require("../models/Venue");

// ✅ CREATE VENUE
exports.createVenue = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      pricePerHour,
      price,
      capacity,
      amenities,
      image,
      images,
      category,
    } = req.body;

    const venue = new Venue({
      name,
      description,
      location,

      // ✅ FIX: support both
      price: price || pricePerHour || 0,

      capacity,
      category,

      // ✅ FIX: normalize images
      images: images || (image ? [image] : []),
    });

    await venue.save();

    res.status(201).json({
      success: true,
      message: "Venue created successfully",
      data: venue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating venue",
      error: error.message,
    });
  }
};

// ✅ GET ALL VENUES
exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching venues",
      error: error.message,
    });
  }
};

// ✅ GET SINGLE VENUE
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    res.status(200).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching venue",
      error: error.message,
    });
  }
};