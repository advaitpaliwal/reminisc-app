import { useState, useRef, FormEvent } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { useToastStore } from '@/stores/useToastStore';
import { useMemoryStore } from '@/stores/useMemoryStore';
import { Memory } from '@/types/memory';
import { useMemories } from './useMemories';

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
}

interface UseChatReturn {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  messages: ChatMessage[];
  isLoading: boolean;
  handleSubmit: (e: FormEvent) => Promise<void>;
  messageEndRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: () => void;
}

export const useChat = (): UseChatReturn => {
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { messages, addMessage, updateLastAIMessage, model, temperature } = useChatStore();
  const { setToastNotification } = useToastStore();
  const { memories, setMemories } = useMemoryStore();
  const { editMemory, deleteMemory } = useMemories();

  const fetchStream = async (newMessages: ChatMessage[]) => {
    setIsLoading(true);
    try {
      const lastSevenMessages = newMessages.slice(-7); // Get the last 7 messages
      const response = await fetch('/api/chat/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: lastSevenMessages,
          model,
          temperature,
        }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf('}{');
        while (boundary !== -1) {
          const chunk = buffer.slice(0, boundary + 1);
          buffer = buffer.slice(boundary + 1);

          try {
            const parsedChunk = JSON.parse(chunk);
            console.log('Parsed chunk:', parsedChunk);

            if (parsedChunk.event === 'on_tool_end') {
              console.log('Tool end event:', parsedChunk);
              if (parsedChunk.tool_name === 'create_memory') {
                console.log('Remember event:', parsedChunk);
                const newMemory: Memory = JSON.parse(parsedChunk.output);
                setToastNotification({
                  message: "Memory Remembered",
                  description: newMemory.content,
                  onUndo: async () => {
                    await deleteMemory(newMemory.id, false); // Pass false to skip toast
                  },
                });
                console.log('New memory:', newMemory);
                setMemories((currentMemories: Memory[]) => [newMemory, ...currentMemories]);
              } else if (parsedChunk.tool_name === 'update_memory') {
                console.log('Revise event:', parsedChunk);
                const updatedMemory: Memory = JSON.parse(parsedChunk.output);
                setToastNotification({
                  message: "Memory Revised",
                  description: updatedMemory.content,
                  onUndo: async () => {
                    // Revert the memory update by calling the update function with the old content
                    const oldMemory = memories.find(memory => memory.id === updatedMemory.id);
                    if (oldMemory) {
                      await editMemory(oldMemory.id, oldMemory.content, false);
                    }
                  },
                });
                console.log('Updated memory:', updatedMemory);
                setMemories((currentMemories: Memory[]) =>
                  currentMemories.map((memory: Memory) =>
                    memory.id === updatedMemory.id ? updatedMemory : memory
                  )
                );
              }                    
            }

            if (parsedChunk.event === 'on_chat_model_stream') {
              updateLastAIMessage(parsedChunk.content);
              console.log('AI message updated:', parsedChunk.content);
              scrollToBottom();
            }
          } catch (error) {
            console.error('Error parsing chunk:', error);
          }

          boundary = buffer.indexOf('}{');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      console.log('fetchStream completed');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called with input:', input);
    const newMessage: ChatMessage = { content: input, role: 'user' };
    const newMessages: ChatMessage[] = [...messages, newMessage];
    addMessage(newMessage);
    setInput('');
    scrollToBottom();
    console.log('New message added:', newMessage);
    await fetchStream(newMessages);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    console.log('Scrolled to bottom');
  };

  return {
    input,
    setInput,
    messages,
    isLoading,
    handleSubmit,
    messageEndRef,
    scrollToBottom,
  };
};
