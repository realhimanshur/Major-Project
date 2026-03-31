const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    // ❌ removed unique
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true, // ✅ faster queries
  },

  messages: [messageSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ AUTO UPDATE TIMESTAMP
chatHistorySchema.pre("save", function () {
  this.updatedAt = Date.now();
});

// ✅ COMPOUND INDEX (MAIN FIX 🔥)
chatHistorySchema.index({ userId: 1, sessionId: 1 });

module.exports = mongoose.model("ChatHistory", chatHistorySchema);