const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  toggleFavorite,
  getFavorites,
} = require("../controllers/favoriteController");

// ✅ TOGGLE FAVORITE (EVENT + VENUE)
// /api/favorites/event/:id
// /api/favorites/venue/:id
router.post("/:type/:id", protect, toggleFavorite);

// ✅ GET ALL FAVORITES
router.get("/", protect, getFavorites);

module.exports = router;