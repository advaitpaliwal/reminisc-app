import { create } from 'zustand';

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
}

interface ChatStore {
  messages: ChatMessage[];
  model: string;
  temperature: number;
  setModel: (model: string) => void;
  setTemperature: (temperature: number) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastAIMessage: (content: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  model: 'gpt-4o',
  temperature: 0.7,
  setModel: (model) => set({ model }),
  setTemperature: (temperature) => set({ temperature }),
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
