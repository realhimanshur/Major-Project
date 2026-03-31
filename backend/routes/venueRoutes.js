const express = require("express");
const router = express.Router();

const {
  createVenue,
  getVenues,
} = require("../controllers/venueController");

// ✅ CREATE VENUE
router.post("/create", createVenue);

// ✅ GET ALL VENUES
router.get("/", getVenues);

module.exports = router;

const { getVenueById } = require("../controllers/venueController");

router.get("/:id", getVenueById);