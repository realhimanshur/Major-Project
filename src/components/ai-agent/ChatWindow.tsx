import React, { useRef, useEffect, useState } from "react";
import { Send, Trash2, Mic, X } from "lucide-react";
import { useAIChat } from "@/context/AIChatContext";
import { TypingIndicator } from "./TypingIndicator";
import { MessageBubble } from "./MessageBubble";

const ChatWindow: React.FC = () => {
  const { messages, isLoading, error, sendMessage, closeChat, clearChat } =
    useAIChat();

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSendingRef = useRef(false);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages, isLoading]);

  // 🎤 Voice Input Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition: SpeechRecognition = new SpeechRecognition();

      recognition.onresult = (e: SpeechRecognitionEvent) => {
        setInput(e.results[0][0].transcript);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  // 🔊 Text-to-Speech Function
  const handleSpeak = (text: string, index: number) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech not supported");
      return;
    }

    // Stop if same message clicked again
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onend = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  // ✨ Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isSendingRef.current) return;

    isSendingRef.current = true;
    const msg = input.trim();
    setInput("");

    try {
      await sendMessage(msg);
    } finally {
      isSendingRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice not supported");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setIsListening(!isListening);
  };

  return (
    <div className="w-[420px] h-[620px] backdrop-blur-2xl bg-white/60 border border-white/20 shadow-2xl rounded-3xl flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
        <span className="font-semibold tracking-wide">AI Assistant</span>
        <button onClick={closeChat} className="hover:scale-110 transition">
          <X />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            isSpeaking={speakingIndex === i}
            onSpeak={() => handleSpeak(msg.content, i)}
          />
        ))}

        {isLoading && <TypingIndicator />}
        {error && <div className="text-red-500 text-center">{error}</div>}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t bg-white/70 backdrop-blur-md flex gap-2 items-end"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={1}
          className="flex-1 resize-none rounded-xl px-4 py-2 text-sm
          bg-white/80 border border-gray-200
          focus:outline-none focus:ring-2 focus:ring-purple-500
          transition-all duration-200
          text-transparent bg-clip-text
          bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600
          placeholder:text-gray-400"
        />

        {/* 🎤 Mic */}
        <button
          type="button"
          onClick={toggleVoice}
          className={`relative p-3 rounded-full transition-all duration-300 ${
            isListening
              ? "bg-red-500 text-white scale-110"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <Mic size={18} />
          {isListening && (
            <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping"></span>
          )}
        </button>

        {/* Send */}
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>

      {/* Footer */}
      <div className="text-xs text-gray-400 flex justify-between px-3 pb-2">
        <button
          onClick={clearChat}
          className="flex gap-1 items-center hover:text-red-500 transition"
        >
          <Trash2 size={14} /> Clear
        </button>
        <span>AI may be inaccurate</span>
      </div>
    </div>
  );
};

export default ChatWindow;