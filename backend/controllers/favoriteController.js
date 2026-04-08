const User = require("../models/User");
const Event = require("../models/Event");

// ❤️ TOGGLE FAVORITE (ADD / REMOVE)
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAlreadyFav = user.favorites.includes(eventId);

    if (isAlreadyFav) {
      // ❌ REMOVE
      user.favorites = user.favorites.filter(
        (fav) => fav.toString() !== eventId
      );
    } else {
      // ✅ ADD
      user.favorites.push(eventId);
    }

    await user.save();

    res.json({
      message: isAlreadyFav
        ? "Removed from favorites"
        : "Added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Favorite Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📄 GET ALL FAVORITES (POPULATED)
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.favorites); // ✅ returns full event objects
  } catch (error) {
    console.error("Get Favorites Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};