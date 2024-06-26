import { useState, useRef, FormEvent } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { useToastStore } from '@/stores/useToastStore';
import { useMemoryStore } from '@/stores/useMemoryStore';
import { Memory } from '@/types/memory';
import { useMemories } from './useMemories';
import { useToolStatusStore } from '@/stores/useToolStatusStore';

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant' | 'system';
}

interface UseChatReturn {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  messages: ChatMessage[];
  isLoading: boolean;
  handleSubmit: (e: FormEvent) => Promise<void>;
  messageEndRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: () => void;
  clearMessages: () => void;
}

export const useChat = (): UseChatReturn => {
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { messages, addMessage, updateLastAIMessage, model, temperature, systemPrompt, clearMessages: clearChatStoreMessages } = useChatStore();
  const { setToastNotification } = useToastStore();
  const { memories, setMemories } = useMemoryStore();
  const { editMemory, deleteMemory } = useMemories();
  const { setAction } = useToolStatusStore();
  
  const fetchStream = async (newMessages: ChatMessage[]) => {
    setIsLoading(true);
    try {
      const lastSevenMessages = newMessages.slice(-7);
      const messagesWithSystemPrompt = [
        { role: 'system', content: systemPrompt },
        ...lastSevenMessages,
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesWithSystemPrompt,
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
            // if (parsedChunk.event === 'on_tool_start') {
            //   const memoryInput = JSON.parse(parsedChunk.input);
            //   console.log('memoryInput:', memoryInput);
            //   if (parsedChunk.tool_name === 'create_memory') {
            //     setAction({ type: 'create', title: 'Creating Memory', content: memoryInput.memory, status: 'start' });
            //   } else if (parsedChunk.tool_name === 'update_memory') {
            //     setAction({ type: 'update', title: 'Updating Memory', content: memoryInput.new_memory, status: 'start' });
            //   } else if (parsedChunk.tool_name === 'retrieve_memories') {
            //     setAction({ type: 'retrieve', title: 'Retrieving Memories', content: memoryInput.query, status: 'start' });
            //   }
            // }
            if (parsedChunk.event === 'on_tool_end') {
              console.log('parsedChunk:', parsedChunk, 'parsedChunk.type:', typeof parsedChunk);
              const toolOutput = JSON.parse(parsedChunk.output);
              if (parsedChunk.tool_name === 'create_memory') {
                const newMemory:Memory = JSON.parse(toolOutput);
                console.log("newMemory:", newMemory, "newMemory.type:", typeof newMemory, "newMemory.content:", newMemory.content)
                setAction({ type: 'create', title: 'Memory Created', content: `Created memory: ${newMemory.content}`, status: 'end' });
                setToastNotification({
                  message: "Memory Remembered",
                  description: newMemory.content,
                  onUndo: async () => {
                    await deleteMemory(newMemory.id, false);
                  },
                });
                setMemories((currentMemories: Memory[]) => [newMemory, ...currentMemories]);
              } else if (parsedChunk.tool_name === 'update_memory') {
                const updatedMemory: Memory = JSON.parse(toolOutput);
                setAction({ type: 'update', title: 'Memory Updated', content: `Updated memory: ${updatedMemory.content}`, status: 'end' });
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
                setMemories((currentMemories: Memory[]) =>
                  currentMemories.map((memory: Memory) =>
                    memory.id === updatedMemory.id ? updatedMemory : memory
                  )
                );
              } else if (parsedChunk.tool_name === 'retrieve_memories') {
                const retrievedMemories : Memory[] = JSON.parse(toolOutput);
                setAction({ type: 'retrieve', title: 'Memories Retrieved', content: `Retrieved ${retrievedMemories.length} memories`, status: 'end' });
                setToastNotification({
                  message: "Memories Retrieved",
                  description: `Retrieved ${retrievedMemories.length} memories`,
                });
              }          
            }

            if (parsedChunk.event === 'on_chat_model_stream') {
              setAction(null);
              updateLastAIMessage(parsedChunk.content);
              scrollToBottom();
            }
          } catch (error) {
            console.error('Error parsing chunk:', error);
          }

          boundary = buffer.indexOf('}{');
        }
      }
      if (buffer.length > 0) {
        try {
          const parsedChunk = JSON.parse(buffer);
          if (parsedChunk.event === 'on_chat_model_stream') {
            updateLastAIMessage(parsedChunk.content);
            scrollToBottom();
          }
        } catch (error) {
          console.error('Error parsing remaining chunk:', error);
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
    const newMessage: ChatMessage = { content: input, role: 'user' };
    const newMessages: ChatMessage[] = [...messages, newMessage];
    addMessage(newMessage);
    setInput('');
    scrollToBottom();
    await fetchStream(newMessages);
  };

  const clearMessages = () => {
    clearChatStoreMessages();  // This clears messages in the chat store
    setToastNotification({
      message: "Chat history cleared",
      description: "All messages have been removed from the chat.",
    });
  }

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
    clearMessages
  };
};
