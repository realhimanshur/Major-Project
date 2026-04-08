const aiService = require("../services/aiService");
const ChatHistory = require("../models/ChatHistory");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary"); // ✅ ADD

// 🧠 Chat handler
const chat = async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({
        error: "Message and sessionId required",
      });
    }

    const safeUserId =
      userId && mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : null;

    const query = safeUserId
      ? { userId: safeUserId, sessionId }
      : { sessionId };

    let chatHistory = await ChatHistory.findOne(query);

    const recentMessages = chatHistory
      ? chatHistory.messages.slice(-10)
      : [];

    const result = await aiService.generateResponse(
      message,
      recentMessages
    );

    if (!result.success) {
      console.error("AI error:", result.error);

      return res.status(200).json({
        response:
          result.text ||
          "I'm having trouble right now. Please try again.",
        sessionId,
        timestamp: new Date().toISOString(),
      });
    }

    const newMessages = [
      { role: "user", content: message },
      { role: "assistant", content: result.text },
    ];

    if (chatHistory) {
      chatHistory.messages.push(...newMessages);
      await chatHistory.save();
    } else {
      await ChatHistory.create({
        sessionId,
        userId: safeUserId,
        messages: newMessages,
      });
    }

    res.json({
      response: result.text,
      sessionId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat controller error:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// 📜 Session-based history
const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "SessionId required" });
    }

    const chatHistory = await ChatHistory.findOne({ sessionId })
      .sort({ createdAt: -1 })
      .select("messages createdAt")
      .lean();

    return res.json({
      messages: chatHistory?.messages || [],
      sessionId,
    });
  } catch (error) {
    console.error("History error:", error);

    return res.status(200).json({
      messages: [],
      sessionId: req.params.sessionId,
    });
  }
};

// 🔥 USER-based history
const getUserChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const safeUserId =
      userId && mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : null;

    if (!safeUserId) {
      return res.json({ messages: [] });
    }

    const chatHistory = await ChatHistory.findOne({ userId: safeUserId })
      .sort({ createdAt: -1 })
      .select("messages createdAt")
      .lean();

    res.json({
      messages: chatHistory?.messages || [],
      userId,
    });
  } catch (error) {
    console.error("User history error:", error);

    res.status(500).json({
      error: "Failed to fetch user history",
    });
  }
};

// 🗑 Clear history
const clearHistory = async (req, res) => {
  try {
    const { sessionId, userId } = req.body;

    const safeUserId =
      userId && mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : null;

    if (safeUserId) {
      await ChatHistory.deleteMany({ userId: safeUserId });
    } else {
      await ChatHistory.deleteOne({ sessionId });
    }

    res.json({
      message: "History cleared",
    });
  } catch (error) {
    console.error("Clear error:", error);

    res.status(500).json({
      error: "Failed to clear history",
    });
  }
};

// 🔥 NEW: IMAGE UPLOAD (Cloudinary)
const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "event-horizon/profile",
    });

    res.json({
      imageUrl: uploaded.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

module.exports = {
  chat,
  getChatHistory,
  getUserChatHistory,
  clearHistory,
  uploadImage, // ✅ ADD
};