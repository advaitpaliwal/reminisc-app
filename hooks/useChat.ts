// /hooks/useChat.ts
import { useState, useRef, FormEvent } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { useToastStore } from '@/stores/useToastStore';

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

  const fetchStream = async (newMessages: ChatMessage[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/memory/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: newMessages[newMessages.length - 1].content,
        }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });

        const parsedChunk = JSON.parse(chunk);
        if (parsedChunk.event === 'on_tool_start') {
          setToastNotification({
            tool_name: parsedChunk.tool_name,
            input_params: parsedChunk.input,
          });
        }

        if (parsedChunk.event === 'on_chat_model_stream') {
          updateLastAIMessage(parsedChunk.content);
          scrollToBottom();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newMessage: ChatMessage = { content: input, type: 'human' };
    const newMessages: ChatMessage[] = [...messages, newMessage];
    addMessage(newMessage);
    setInput('');
    await fetchStream(newMessages);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
