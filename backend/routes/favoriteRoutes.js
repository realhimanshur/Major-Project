const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  toggleFavorite,
  getFavorites,
} = require("../controllers/favoriteController");

// ✅ TOGGLE FAVORITE (ADD / REMOVE)
router.post("/:eventId", protect, toggleFavorite);

// ✅ GET ALL FAVORITES (USER)
router.get("/", protect, getFavorites);

module.exports = router;