import { v4 as uuidv4 } from 'uuid';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  timestamp: string;
}

class AIAgentService {
  private sessionId: string;
  private lastRequestTime = 0;
  private currentUserId: string | null = null; // ✅ NEW

  constructor() {
    this.sessionId = uuidv4(); // ✅ remove global reuse
  }

  // ✅ SET USER (MAIN FIX)
  setUser(userId?: string) {
    if (!userId) {
      this.currentUserId = null;
      this.sessionId = uuidv4();
      return;
    }

    // 👉 create user-specific key
    const key = `ai_chat_session_${userId}`;

    const storedSession = localStorage.getItem(key);

    if (storedSession) {
      this.sessionId = storedSession;
    } else {
      this.sessionId = uuidv4();
      localStorage.setItem(key, this.sessionId);
    }

    this.currentUserId = userId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // ✅ RESET SESSION (USER SAFE)
  resetSession(): void {
    if (this.currentUserId) {
      const key = `ai_chat_session_${this.currentUserId}`;
      this.sessionId = uuidv4();
      localStorage.setItem(key, this.sessionId);
    } else {
      this.sessionId = uuidv4();
    }
  }

  // ✅ SEND MESSAGE WITH USER ID
  async sendMessage(message: string, userId?: string): Promise<ChatResponse> {
    const now = Date.now();

    if (now - this.lastRequestTime < 1000) {
      throw new Error("You're sending messages too fast. Please wait.");
    }

    this.lastRequestTime = now;

    const response = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sessionId: this.sessionId,
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return response.json();
  }

  // ✅ GET HISTORY (USER PRIORITY → FALLBACK SESSION)
  async getHistory(userId?: string): Promise<ChatMessage[]> {
    const url = userId
      ? `${API_URL}/ai/history/user/${userId}`
      : `${API_URL}/ai/history/${this.sessionId}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch history');

    const data = await response.json();
    return data.messages;
  }

  // ✅ CLEAR HISTORY (USER BASED)
  async clearHistory(userId?: string): Promise<void> {
    await fetch(`${API_URL}/ai/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        userId,
      }),
    });

    // ✅ also reset session after clear
    this.resetSession();
  }
}

export const aiAgentService = new AIAgentService();