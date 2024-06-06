// /hooks/useChat.ts
import { useState, useRef, FormEvent } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { useToastStore } from '@/stores/useToastStore';
import { useMemoryStore } from '@/stores/useMemoryStore';
import { Memory } from '@/types/memory';
import { set } from 'date-fns';

interface ChatMessage {
  content: string;
  type: 'human' | 'ai';
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
  const { messages, addMessage, updateLastAIMessage } = useChatStore();
  const { setToastNotification } = useToastStore();
  const { memories, setMemories } = useMemoryStore();

  const fetchStream = async (newMessages: ChatMessage[]) => {
    console.log('fetchStream called with messages:', newMessages);
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: newMessages[newMessages.length - 1].content,
        }),
      });

      console.log('Response:', response);

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

          console.log('Chunk received:', chunk);
          try {
            const parsedChunk = JSON.parse(chunk);
            console.log('Parsed chunk:', parsedChunk);
            // if (parsedChunk.event === 'on_tool_start') {
            //   const parsedInput = JSON.parse(parsedChunk.input);
            //   if (parsedChunk.tool_name === 'remember') {
            //     setToastNotification({
            //       message: "Memory Remembered",
            //       description: parsedInput.memory,
            //     });
            //   } else if (parsedChunk.tool_name === 'revise') {
            //     setToastNotification({
            //       message: "Memory Revised",
            //       description: parsedInput.new_memory,
            //     });
            //   }
            // }
            if (parsedChunk.event === 'on_tool_end') {
              console.log('Tool end event:', parsedChunk);
              if (parsedChunk.tool_name === 'remember') {
                console.log('Remember event:', parsedChunk);
                const newMemory: Memory = JSON.parse(parsedChunk.output);
                setToastNotification({
                  message: "Memory Remembered",
                  description: newMemory.content,
                });
                setMemories([newMemory, ...memories]);
              } else if (parsedChunk.tool_name === 'revise') {
                console.log('Revise event:', parsedChunk);
                const updatedMemory: Memory = JSON.parse(parsedChunk.output);
                setToastNotification({
                  message: "Memory Revised",
                  description: updatedMemory.content,
                });
                setMemories(
                  memories.map((memory: Memory) =>
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
    const newMessage: ChatMessage = { content: input, type: 'human' };
    const newMessages: ChatMessage[] = [...messages, newMessage];
    addMessage(newMessage);
    setInput('');
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