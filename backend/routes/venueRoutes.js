const express = require("express");
const router = express.Router();

const {
  createVenue,
  getVenues,
  getVenueById,
} = require("../controllers/venueController");

// ✅ CREATE VENUE
router.post("/create", createVenue);

// ✅ GET ALL VENUES
router.get("/", getVenues);

// ✅ GET SINGLE VENUE
router.get("/:id", getVenueById);

module.exports = router;