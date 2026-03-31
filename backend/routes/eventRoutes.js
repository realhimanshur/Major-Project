const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

// CREATE EVENT
router.post("/", protect, eventController.createEvent);

// 🔥 GET MY EVENTS
router.get("/my-events", protect, eventController.getMyEvents);

// 🔥 GET SINGLE EVENT
router.get("/:id", eventController.getEventById);

// GET ALL EVENTS
router.get("/", eventController.getEvents);

// UPDATE
router.put("/:id", protect, eventController.updateEvent);

// DELETE
router.delete("/:id", protect, eventController.deleteEvent);

module.exports = router;