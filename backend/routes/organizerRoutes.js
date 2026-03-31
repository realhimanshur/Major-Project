const express = require("express");
const router = express.Router();
const organizerController = require("../controllers/organizerController");

router.post("/", organizerController.createOrganizer);
router.get("/", organizerController.getOrganizers);

// ✅ NEW ROUTE
router.get("/:id", organizerController.getOrganizerById);

module.exports = router;