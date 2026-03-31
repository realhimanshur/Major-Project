const rateLimit = require('express-rate-limit');

// 🚀 GLOBAL AI RATE LIMIT (relaxed)
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute

  max: 60, // ✅ increased (was 5 ❌)

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    error: 'Too many requests. Please slow down.'
  },

  // 🔥 Skip successful requests (IMPORTANT)
  skipSuccessfulRequests: false,

  // 🔥 Custom handler (clean response)
  handler: (req, res) => {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please wait a few seconds.'
    });
  }
});


// 🧠 SESSION-BASED LIMITER (less aggressive)
const sessionRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,

  // ✅ FIXED (use safe fallback)
  keyGenerator: (req) => {
    return req.body.sessionId || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  },

  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  aiRateLimiter,
  sessionRateLimiter
};