// /stores/chatStore.ts
import { create } from 'zustand';

interface ChatMessage {
  content: string;
  type: 'human' | 'ai';
}

interface ChatStore {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateLastAIMessage: (content: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) => {
    console.log('Adding message:', message);
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
  updateLastAIMessage: (content) => {
    console.log('Updating last AI message with content:', content);
    set((state) => {
      const updatedMessages = [...state.messages];
      const lastMessage = updatedMessages[updatedMessages.length - 1];
      if (lastMessage && lastMessage.type === 'ai') {
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content,
        };
        console.log('Last AI message updated:', updatedMessages[updatedMessages.length - 1]);
      } else {
        updatedMessages.push({ content, type: 'ai' });
        console.log('New AI message added:', { content, type: 'ai' });
      }
      return { messages: updatedMessages };
    });
  },
}));
