import React, { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useAIChat } from "@/context/AIChatContext";
import ChatWindow from "./ChatWindow";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AIChatWidget: React.FC = () => {
  const { isOpen, toggleChat, openChat, loadHistory } = useAIChat();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hasNotification, setHasNotification] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();

        if (!user) {
          navigate("/login"); // 🔐 redirect
          return;
        }

        openChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openChat, user, navigate]);

  const handleToggleChat = () => {
    // 🔐 redirect if not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    toggleChat();

    if (!isOpen) {
      setHasNotification(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && user && (
        <div className="mb-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6">
          <ChatWindow />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleToggleChat}
        className={`
          relative group flex items-center justify-center w-16 h-16 rounded-full
          shadow-2xl transition-all duration-300
          hover:scale-110 active:scale-95
          ${
            isOpen
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
          }
        `}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {/* Glow Effect */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 blur-xl opacity-50 group-hover:opacity-80 transition duration-300"></span>
        )}

        {/* Icon */}
        <div className="relative z-10">
          {isOpen ? (
            <X className="w-7 h-7 text-white transition-transform group-hover:rotate-90" />
          ) : (
            <MessageCircle className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Notification Ping */}
        {!isOpen && hasNotification && (
          <>
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white z-20"></span>
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></span>
          </>
        )}

        {/* Pulse Ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full border-2 border-purple-400 opacity-30 animate-ping"></span>
        )}
      </button>
    </div>
  );
};

export default AIChatWidget;