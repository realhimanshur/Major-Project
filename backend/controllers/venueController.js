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

    // ✅ LOCATION NORMALIZATION
    let normalizedLocation = { city: "", state: "" };

    if (typeof location === "object") {
      normalizedLocation = {
        city: location.city || "",
        state: location.state || "",
      };
    } else if (typeof location === "string") {
      normalizedLocation = {
        city: location,
        state: "",
      };
    }

    // ✅ CAPACITY NORMALIZATION
    let normalizedCapacity = { min: 0, max: 0 };

    if (typeof capacity === "object") {
      normalizedCapacity = {
        min: capacity.min || 0,
        max: capacity.max || capacity.min || 0,
      };
    } else if (typeof capacity === "number") {
      normalizedCapacity = {
        min: capacity,
        max: capacity,
      };
    }

    // ✅ PRICE NORMALIZATION
    const normalizedPrice =
      typeof pricePerHour === "number"
        ? pricePerHour
        : typeof price === "number"
        ? price
        : 0;

    const venue = new Venue({
      name,
      description,
      location: normalizedLocation,
      capacity: normalizedCapacity,
      pricePerHour: normalizedPrice,
      category,
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
    const { id } = req.params;

    const venue = await Venue.findById(id);

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