const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// REGISTER
router.post("/register", authController.register);

// LOGIN
router.post("/login", authController.login);

module.exports = router;

// ADMIN TEST ROUTE
router.get("/admin/dashboard", protect, isAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin 🎯",
    user: req.user,
  });
});