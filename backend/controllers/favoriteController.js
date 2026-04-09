const User = require("../models/User");
const Event = require("../models/Event");
const Venue = require("../models/Venue");

// ❤️ TOGGLE FAVORITE (EVENT + VENUE)
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔥 NOW SUPPORT BOTH
    const { id, type } = req.params; // type = "event" | "venue"

    if (!["event", "venue"].includes(type)) {
      return res.status(400).json({ message: "Invalid favorite type" });
    }

    const itemType = type === "event" ? "Event" : "Venue";

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingIndex = user.favorites.findIndex((fav) => {
      if (!fav.itemId) {
        return fav.toString() === id;
      }
      return fav.itemId.toString() === id && fav.itemType === itemType;
    });

    if (existingIndex > -1) {
      user.favorites.splice(existingIndex, 1);
    } else {
      user.favorites = user.favorites.filter((fav) => fav.itemId);

      user.favorites.push({
        itemId: id,
        itemType,
      });
    }

    await user.save();

    res.json({
      message:
        existingIndex > -1 ? "Removed from favorites" : "Added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Favorite Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📄 GET FAVORITES (EVENT + VENUE)
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const eventIds = user.favorites
      .filter((f) => f.itemType === "Event")
      .map((f) => f.itemId);

    const venueIds = user.favorites
      .filter((f) => f.itemType === "Venue")
      .map((f) => f.itemId);

    const events = await Event.find({ _id: { $in: eventIds } });
    const venues = await Venue.find({ _id: { $in: venueIds } });

    // 🔥 MERGED RESPONSE
    res.json([
      ...events.map((e) => ({ ...e.toObject(), type: "event" })),
      ...venues.map((v) => ({ ...v.toObject(), type: "venue" })),
    ]);
  } catch (error) {
    console.error("Get Favorites Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
