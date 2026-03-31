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

  // ✅ TRACK USER CHANGE (NEW)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen(prev => !prev);

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
      const response = await aiAgentService.sendMessage(content);

      await simulateTyping(response.response, response.timestamp);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMsg);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, user]);

  // ✅ LOAD USER-SPECIFIC HISTORY
  const loadHistory = useCallback(async () => {
    if (!user) return;

    try {
      const history = await aiAgentService.getHistory(user.id);
      setMessages(history || []); // ✅ safe fallback
    } catch (err) {
      console.error(err);
      setMessages([]); // ✅ prevent stale data
    }
  }, [user]);

  // ✅ FIX: HANDLE USER SWITCH PROPERLY (MAIN FIX 🔥)
  useEffect(() => {
    if (!user) {
      setMessages([]);
      setCurrentUserId(null);
      aiAgentService.resetSession(); // ✅ reset backend session
      return;
    }

    // 👉 If new user logged in
    if (currentUserId !== user.id) {
      aiAgentService.setUser(user.id);
      setMessages([]); // clear old user messages
      aiAgentService.resetSession(); // reset AI memory/session
      setCurrentUserId(user.id);
      loadHistory(); // load new user's chat
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