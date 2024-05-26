// useMemories.ts
import { useEffect, useState } from 'react';
import { useMemoryStore } from '@/stores/useMemoryStore';
import { Memory } from '@/types/memory';
import { parseISO, format } from 'date-fns';

const API_BASE_URL = '/api/memory';

const formatTimestamps = (memories: Memory[]): Memory[] => {
  return memories.map((memory) => ({
    ...memory,
    created_at: format(parseISO(memory.created_at), 'MM/dd/yy h:mm a'),
    updated_at: format(parseISO(memory.updated_at), 'MM/dd/yy h:mm a'),
  }));
};

export const useMemories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setMemories = useMemoryStore((state) => state.setMemories);

  useEffect(() => {
    const fetchMemories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch memories');
        }
        const data: Memory[] = await response.json();
        setMemories(() => formatTimestamps(data));
      } catch (error) {
        console.error('Error fetching memories:', error);
        setError('Failed to fetch memories');
      }

      setIsLoading(false);
    };

    fetchMemories();
  }, [setMemories]);

  const createMemory = async (memory: string) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: memory }),
      });
      if (!response.ok) {
        throw new Error('Failed to create memory');
      }
      const newMemory: Memory = await response.json();
      const formattedMemory = formatTimestamps([newMemory])[0];
      setMemories((prevMemories) => [formattedMemory, ...prevMemories]);
      return formattedMemory;
    } catch (error) {
      console.error('Error creating memory:', error);
      return null;
    }
  };

  const deleteMemory = async (memoryId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memoryId }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete memory');
      }
      setMemories((prevMemories) =>
        prevMemories.filter((memory) => memory.id !== memoryId)
      );
      return true;
    } catch (error) {
      console.error('Error deleting memory:', error);
      return false;
    }
  };

  const editMemory = async (memoryId: string, updatedContent: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId, content: updatedContent }),
      });
      if (!response.ok) {
        throw new Error('Failed to update memory');
      }
      const updatedMemory: Memory = await response.json();
      const formattedMemory = formatTimestamps([updatedMemory])[0];
      setMemories((prevMemories) =>
        prevMemories.map((memory) =>
          memory.id === memoryId ? formattedMemory : memory
        )
      );
      return formattedMemory;
    } catch (error) {
      console.error('Error updating memory:', error);
      return null;
    }
  };

  const processMemory = async (memory: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: memory }),
      });
      if (!response.ok) {
        throw new Error('Failed to process memory');
      }
      const processedMemory: Memory = await response.json();
      console.log('Processed memory:', processedMemory);
      if (processedMemory.content) {
        const formattedMemory = formatTimestamps([processedMemory])[0];
        setMemories((prevMemories) => [formattedMemory, ...prevMemories]);
      }
      return processedMemory;
    } catch (error) {
      console.error('Error processing memory:', error);
      return null;
    }
  };

  return {
    memories: useMemoryStore((state) => state.memories),
    isLoading,
    error,
    createMemory,
    deleteMemory,
    editMemory,
    processMemory,
  };
};