const express = require("express");
const router = express.Router();
const organizerController = require("../controllers/organizerController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔥 DEBUG (DON'T SKIP)
console.log("authMiddleware:", authMiddleware);
console.log("updateOrganizerProfile:", organizerController.updateOrganizerProfile);
// ✅ FORCE CLEAN IMPORT

router.post("/", organizerController.createOrganizer);
router.get("/", organizerController.getOrganizers);

router.get("/:id", organizerController.getOrganizerById);

// 🔥 SAFE PUT ROUTE
router.put(
  "/profile",
  (req, res, next) => authMiddleware(req, res, next), // ✅ FORCE FUNCTION
  organizerController.updateOrganizerProfile
);

module.exports = router;