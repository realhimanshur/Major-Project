const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  async generateResponse(message, history = []) {
    try {
      const messages = [
        {
          role: "system",
          content:
            "You are an AI assistant for an event management platform. Help users find events, book tickets, and explore organizers.",
        },

        // 🔥 include chat history
        ...history.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),

        {
          role: "user",
          content: message,
        },
      ];

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini", // ✅ fast + cheap
        messages,
      });

      return {
        success: true,
        text: completion.choices[0].message.content,
      };
    } catch (error) {
      console.error("❌ OpenAI Error:", error.message);

      return {
        success: true, // ⚠️ prevent crash
        text:
          "I'm having trouble right now. Please try again later.",
      };
    }
  }
}

module.exports = new AIService();


// class AIService {
//   constructor() {
//     console.log("🤖 Using FREE Demo AI (no API)");
//   }

//   async generateResponse(userMessage, chatHistory = []) {
//     try {
//       const msg = userMessage.toLowerCase();

//       let response = "I'm here to help with events! 😊";

//       // 🎯 Smart responses
//       if (msg.includes("hello") || msg.includes("hi")) {
//         response = "Hello! 👋 How can I assist you with events today?";
//       } 
//       else if (msg.includes("event")) {
//         response = "You can explore events in the Events section. Want help finding one?";
//       } 
//       else if (msg.includes("book")) {
//         response = "To book an event, click on 'Book Now' on any event card.";
//       } 
//       else if (msg.includes("organizer")) {
//         response = "You can view organizers in the Organizers section.";
//       } 
//       else if (msg.includes("price") || msg.includes("cost")) {
//         response = "Event prices vary. Check the event card for details.";
//       } 
//       else if (msg.includes("help")) {
//         response = "I can help you find events, book tickets, or explore organizers.";
//       }

//       return {
//         success: true,
//         text: response,
//       };

//     } catch (error) {
//       return {
//         success: false,
//         error: "LOCAL_AI_ERROR",
//         text: "Something went wrong. Please try again.",
//       };
//     }
//   }
// }

// module.exports = new AIService();
