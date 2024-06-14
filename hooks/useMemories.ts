import { useEffect, useState } from 'react';
import { useMemoryStore } from '@/stores/useMemoryStore';
import { Memory } from '@/types/memory';
import { useToastStore } from '@/stores/useToastStore';

const API_BASE_URL = '/api/memory';

export const useMemories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { memories, setMemories } = useMemoryStore();
  const { setToastNotification } = useToastStore();

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

  const createMemory = async (content: string, showToast = true) => {
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
      setMemories(currentMemories => {
        const updatedMemories = [newMemory, ...currentMemories];
        updatedMemories.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
        return updatedMemories;
      });

      if (showToast) {
        setToastNotification({
          message: "Memory Created",
          description: newMemory.content,
          onUndo: async () => {
            await deleteMemory(newMemory.id, false); // Pass false to skip toast
          },
        });
      }
    } catch (error) {
      console.error('Error creating memory:', error);
    }
  };

  const deleteMemory = async (memoryId: string, showToast = true) => {
    try {
      const memoryToDelete = memories.find(memory => memory.id === memoryId);
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete memory');
      }
      setMemories(currentMemories => 
        currentMemories.filter(memory => memory.id !== memoryId)
      );

      if (showToast && memoryToDelete) {
        setToastNotification({
          message: "Memory Deleted",
          description: memoryToDelete.content,
          onUndo: async () => {
            await createMemory(memoryToDelete.content, false); // Recreate the memory without showing toast
          },
        });
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const editMemory = async (memoryId: string, content: string, showToast = true) => {
    try {
      const oldMemory = memories.find(memory => memory.id === memoryId);
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId, content }),
      });
      if (!response.ok) {
        throw new Error('Failed to update memory');
      }
      const updatedMemory: Memory = await response.json();
      setMemories(currentMemories => {
        const updatedMemories = currentMemories.map(memory =>
          memory.id === memoryId ? updatedMemory : memory
        );
        updatedMemories.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
        return updatedMemories;
      });

      if (showToast) {
        setToastNotification({
          message: "Memory Updated",
          description: updatedMemory.content,
          onUndo: async () => {
            if (oldMemory) {
              await editMemory(oldMemory.id, oldMemory.content, false); // Revert to old memory content without showing toast
            }
          },
        });
      }
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
