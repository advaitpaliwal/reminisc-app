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

            if (parsedChunk.event === 'on_tool_start') {
              setToastNotification({
                tool_name: parsedChunk.tool_name,
                input_params: parsedChunk.input,
              });
              console.log('Tool started:', parsedChunk.tool_name);
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
