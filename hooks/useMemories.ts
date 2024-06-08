import { useEffect, useState } from 'react';
import { useMemoryStore } from '@/stores/useMemoryStore';
import { Memory } from '@/types/memory';

const API_BASE_URL = '/api/memory';

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
        // Sort memories in descending order by 'updated_at'
        data.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
        setMemories(data);
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
      // Insert new memory and re-sort the list
      setMemories(currentMemories => {
        const updatedMemories = [newMemory, ...currentMemories];
        updatedMemories.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
        return updatedMemories;
      });
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
      // Remove memory and re-sort if needed
      setMemories(currentMemories => 
        currentMemories.filter(memory => memory.id !== memoryId)
      );
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
      // Update memory in the list and re-sort
      setMemories(currentMemories => {
        const updatedMemories = currentMemories.map(memory =>
          memory.id === memoryId ? updatedMemory : memory
        );
        updatedMemories.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
        return updatedMemories;
      });
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
