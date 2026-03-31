import React, { useState, useEffect } from "react";
import { Bot, User, Volume2, VolumeX, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Props {
  role: "user" | "assistant";
  content: string;
  isSpeaking?: boolean;
  onSpeak?: () => void;
}

export const MessageBubble: React.FC<Props> = ({
  role,
  content,
  isSpeaking,
  onSpeak,
}) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`flex items-end gap-3 px-3 py-2 group transition-all duration-500 ${
        isUser ? "justify-end" : "justify-start"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg ring-2 ring-white/20 animate-fadeIn">
          <Bot size={18} />
        </div>
      )}

      {/* Message */}
      <div className="max-w-[75%] flex flex-col relative">
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md
            backdrop-blur-lg transition-all duration-300
            relative overflow-visible
            ${
              isUser
                ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-br-none shadow-blue-500/30"
                : "bg-white/70 text-gray-800 border border-white/30 rounded-bl-none shadow-md"
            }
            hover:shadow-xl
          `}
        >
          {/* Subtle Glow Effect */}
          {!isUser && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 opacity-0 hover:opacity-100 transition duration-300 rounded-2xl" />
          )}

          {/* Markdown */}
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className={`${isUser ? "" : "text-gray-800"}`}>{children}</p>
              ),
            }}
          >
            {content}
          </ReactMarkdown>

          {/* Copy Button */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute -top-2 -right-2 opacity-70 hover:opacity-100 transition-all duration-300 
              bg-white text-gray-700 border shadow-md rounded-full p-1.5 hover:scale-110"
            >
              {copied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          )}
        </div>

        {/* Bottom Actions */}
        {!isUser && (
          <div className="flex items-center gap-3 mt-1 pl-1">
            {/* Speak */}
            <button
              onClick={onSpeak}
              className={`
    flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all
    ${
      isSpeaking
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }
  `}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={14} />
                  <span className="hidden sm:inline">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 size={14} />
                  <span className="hidden sm:inline">Listen</span>
                </>
              )}
            </button>

            {/* Enhanced Wave Animation */}
            {isSpeaking && (
              <div className="flex items-end gap-[2px] h-4">
                <span className="w-[2px] bg-blue-500 animate-[wave_1s_infinite] h-2"></span>
                <span className="w-[2px] bg-purple-500 animate-[wave_1s_infinite_0.2s] h-3"></span>
                <span className="w-[2px] bg-indigo-500 animate-[wave_1s_infinite_0.4s] h-2"></span>
                <span className="w-[2px] bg-blue-500 animate-[wave_1s_infinite_0.6s] h-3"></span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-md ring-2 ring-white/30">
          <User size={18} />
        </div>
      )}

      {/* Custom Animation Styles */}
      <style>
        {`
          @keyframes wave {
            0%, 100% { height: 4px; }
            50% { height: 14px; }
          }
        `}
      </style>
    </div>
  );
};
