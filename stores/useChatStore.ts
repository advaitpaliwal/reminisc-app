import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant' | 'system';
}

interface ChatStore {
  messages: ChatMessage[];
  model: string;
  temperature: number;
  systemPrompt: string;
  setModel: (model: string) => void;
  setTemperature: (temperature: number) => void;
  setSystemPrompt: (prompt: string) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastAIMessage: (content: string) => void;
  clearMessages: () => void;
  resetToDefaults: () => void;
}

const DEFAULT_SYSTEM_PROMPT = "You are Reminisc, a super friendly AI assistant, excited to meet a new person.";

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      model: 'gpt-4o',
      temperature: 0.7,
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      setModel: (model) => set({ model }),
      setTemperature: (temperature) => set({ temperature }),
      setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
      addMessage: (message) => set((state) => {
        let updatedMessages = [...state.messages];
        
        if (message.role === 'user') {
          // If the last message was from a user, remove it
          if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === 'user') {
            updatedMessages.pop();
          }
          updatedMessages.push(message);
        } else if (message.role === 'assistant') {
          // Only add the assistant message if there's a preceding user message
          if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === 'user') {
            updatedMessages.push(message);
          } else {
            // If there's no preceding user message, don't add this assistant message
            return { messages: updatedMessages };
          }
        }
        
        return { messages: updatedMessages };
      }),
      updateLastAIMessage: (content) => set((state) => {
        const updatedMessages = [...state.messages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + content,
          };
        } else {
          // Don't add a new assistant message if there's no preceding user message
          if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === 'user') {
            updatedMessages.push({ content, role: 'assistant' });
          }
        }
        return { messages: updatedMessages };
      }),
      clearMessages: () => set({ messages: [] }),
      resetToDefaults: () => set({
        messages: [],
        model: 'gpt-4o',
        temperature: 0.7,
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
      }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        model: state.model,
        temperature: state.temperature,
        systemPrompt: state.systemPrompt,
      }),
    }
  )
);