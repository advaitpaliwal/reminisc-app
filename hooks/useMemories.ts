import { useEffect, useState } from 'react';
import { useMemoryStore } from '@/stores/useMemoryStore';
import { Memory } from '@/types/memory';
import { parseISO, format } from 'date-fns';

const API_BASE_URL = '/api/memory';

const formatTimestamp = (timestamp: string) => {
  return format(parseISO(timestamp), 'MM/dd/yy h:mm a');
};

export const useMemories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { memories, setMemories } = useMemoryStore();

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
        setMemories(data.map(memory => ({
          ...memory,
          created_at: formatTimestamp(memory.created_at),
          updated_at: formatTimestamp(memory.updated_at),
        })));
      } catch (error) {
        console.error('Error fetching memories:', error);
        setError('Failed to fetch memories');
      }

      setIsLoading(false);
    };

    fetchMemories();
  }, [setMemories]);

  const createMemory = async (content: string) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error('Failed to create memory');
      }
      const newMemory: Memory = await response.json();
      setMemories([
        {
          ...newMemory,
          created_at: formatTimestamp(newMemory.created_at),
          updated_at: formatTimestamp(newMemory.updated_at),
        },
        ...memories,
      ]);
    } catch (error) {
      console.error('Error creating memory:', error);
    }
  };

  const deleteMemory = async (memoryId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete memory');
      }
      setMemories(memories.filter((memory) => memory.id !== memoryId));
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const editMemory = async (memoryId: string, content: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId, content }),
      });
      if (!response.ok) {
        throw new Error('Failed to update memory');
      }
      const updatedMemory: Memory = await response.json();
      setMemories(memories.map((memory) =>
        memory.id === memoryId
          ? {
              ...updatedMemory,
              created_at: formatTimestamp(updatedMemory.created_at),
              updated_at: formatTimestamp(updatedMemory.updated_at),
            }
          : memory
      ));
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  };

  return {
    memories,
    isLoading,
    error,
    createMemory,
    deleteMemory,
    editMemory,
  };
};