const express = require('express');
const router = express.Router();

const aiController = require('../controllers/aiAgentController');

const { getUserChatHistory } = aiController; 
const { aiRateLimiter } = require('../middleware/rateLimiter');

// ✅ ONLY one limiter (important)
router.post('/chat', aiRateLimiter, aiController.chat);

// 📜 History
router.get('/history/:sessionId', aiController.getChatHistory);

// 🗑 Clear chat
router.post('/clear', aiController.clearHistory);

// 🔥 Get chat history by user ID
router.get('/history/user/:userId', getUserChatHistory);

// ✅ NEW: IMAGE UPLOAD ROUTE
router.post('/upload', aiController.uploadImage);

// ❤️ Simple health check (safe)
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AI Service Running'
  });
});

module.exports = router;