import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ChatMessage } from "@/services/aiAgentService";
import { aiAgentService } from "@/services/aiAgentService";
import { useAuth } from "@/context/AuthContext";
/* eslint-disable react-refresh/only-export-components */

interface AIChatContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearChat: () => Promise<void>;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export const AIChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen(prev => !prev);

  // ✅ Language Helper (NEW)
  const getLanguageInstruction = () => {
    const lang = localStorage.getItem("chat-lang") || "en-US";

    switch (lang) {
      case "hi-IN":
        return "Respond in Hindi.";
      case "en-IN":
        return "Respond in Hinglish (mix of Hindi and English).";
      default:
        return "Respond in English.";
    }
  };

  // ✨ Typing Effect (unchanged)
  const simulateTyping = async (fullText: string, timestamp: string) => {
    let currentText = "";
    const typingSpeed = 15;

    const tempMessage: ChatMessage = {
      role: "assistant",
      content: "",
      timestamp,
    };

    setMessages(prev => [...prev, tempMessage]);

    for (let i = 0; i < fullText.length; i++) {
      currentText += fullText[i];

      await new Promise(res => setTimeout(res, typingSpeed));

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...tempMessage,
          content: currentText,
        };
        return updated;
      });
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (isLoading || !user) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // ✅ Inject Language Instruction
      const enhancedPrompt = `${getLanguageInstruction()} \nUser: ${content}`;

      const response = await aiAgentService.sendMessage(enhancedPrompt);

      await simulateTyping(response.response, response.timestamp);

    } catch  {
      const getErrorMessage = () => {
  const lang = localStorage.getItem("chat-lang") || "en-US";

  switch (lang) {
    case "hi-IN":
      return "कुछ समस्या आ गई है, कृपया बाद में प्रयास करें";
    case "en-IN":
      return "Kuch problem aa gayi hai, baad mein try karo";
    default:
      return "I'm having trouble right now. Please try again later.";
  }
};

const msg = getErrorMessage();
  console.log("ERROR MSG:", msg);


const errorMsg = getErrorMessage();

setError(errorMsg);

// 👇 ADD THIS (VERY IMPORTANT)
setMessages(prev => [
  ...prev,
  {
    role: "assistant",
    content: errorMsg,
    timestamp: new Date().toISOString(),
  },
]);

      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, user]);

  const loadHistory = useCallback(async () => {
    if (!user) return;

    try {
      const history = await aiAgentService.getHistory(user.id);
      setMessages(history || []);
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setCurrentUserId(null);
      aiAgentService.resetSession();
      return;
    }

    if (currentUserId !== user.id) {
      aiAgentService.setUser(user.id);
      setMessages([]);
      aiAgentService.resetSession();
      setCurrentUserId(user.id);
      loadHistory();
    }
  }, [user, currentUserId, loadHistory]);

  const clearChat = useCallback(async () => {
    if (!user) return;

    await aiAgentService.clearHistory(user.id);
    setMessages([]);
    aiAgentService.resetSession();
  }, [user]);

  return (
    <AIChatContext.Provider
      value={{
        isOpen,
        messages,
        isLoading,
        error,
        openChat,
        closeChat,
        toggleChat,
        sendMessage,
        loadHistory,
        clearChat,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) throw new Error("useAIChat must be used within AIChatProvider");
  return context;
};