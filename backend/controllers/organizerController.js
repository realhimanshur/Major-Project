const Organizer = require("../models/Organizer");

// CREATE
const createOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.create(req.body);
    res.status(201).json(organizer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
const getOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find();
    res.json(organizers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
const getOrganizerById = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id);

    if (!organizer) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(organizer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE PROFILE
const updateOrganizerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updated = await Organizer.findByIdAndUpdate(
      userId,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ IMPORTANT: SINGLE EXPORT
module.exports = {
  createOrganizer,
  getOrganizers,
  getOrganizerById,
  updateOrganizerProfile,
};