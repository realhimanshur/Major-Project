import React, { useEffect, useState } from "react";

export const TypingIndicator: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-xl 
      bg-white/60 backdrop-blur-md border border-white/30 shadow-sm w-fit
      transition-all duration-500
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {/* Animated Dots */}
      <div className="flex items-end gap-[3px] h-4">
        <span className="w-[4px] bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-[typingWave_1s_infinite] h-2"></span>
        <span className="w-[4px] bg-gradient-to-t from-purple-500 to-indigo-500 rounded-full animate-[typingWave_1s_infinite_0.2s] h-3"></span>
        <span className="w-[4px] bg-gradient-to-t from-indigo-500 to-blue-500 rounded-full animate-[typingWave_1s_infinite_0.4s] h-2"></span>
      </div>

      {/* Text */}
      <span className="text-xs sm:text-sm text-gray-500 tracking-wide">
        AI is thinking...
      </span>

      {/* Pulse Glow */}
      <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping opacity-60"></div>

      {/* Custom Animation */}
      <style>
        {`
          @keyframes typingWave {
            0%, 100% { height: 6px; opacity: 0.6; }
            50% { height: 16px; opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};