// /stores/chatStore.ts
import { create } from 'zustand';

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
}

interface ChatStore {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateLastAIMessage: (content: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
  updateLastAIMessage: (content) => {
    set((state) => {
      const updatedMessages = [...state.messages];
      const lastMessage = updatedMessages[updatedMessages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content,
        };
      } else {
        updatedMessages.push({ content, role: 'assistant' });
      }
      return { messages: updatedMessages };
    });
  },
}));
