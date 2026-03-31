class AIService {
  constructor() {
    console.log("🤖 Using FREE Demo AI (no API)");
  }

  async generateResponse(userMessage, chatHistory = []) {
    try {
      const msg = userMessage.toLowerCase();

      let response = "I'm here to help with events! 😊";

      // 🎯 Smart responses
      if (msg.includes("hello") || msg.includes("hi")) {
        response = "Hello! 👋 How can I assist you with events today?";
      } 
      else if (msg.includes("event")) {
        response = "You can explore events in the Events section. Want help finding one?";
      } 
      else if (msg.includes("book")) {
        response = "To book an event, click on 'Book Now' on any event card.";
      } 
      else if (msg.includes("organizer")) {
        response = "You can view organizers in the Organizers section.";
      } 
      else if (msg.includes("price") || msg.includes("cost")) {
        response = "Event prices vary. Check the event card for details.";
      } 
      else if (msg.includes("help")) {
        response = "I can help you find events, book tickets, or explore organizers.";
      }

      return {
        success: true,
        text: response,
      };

    } catch (error) {
      return {
        success: false,
        error: "LOCAL_AI_ERROR",
        text: "Something went wrong. Please try again.",
      };
    }
  }
}

module.exports = new AIService();
