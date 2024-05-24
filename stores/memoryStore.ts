import { create } from 'zustand';
import { Memory } from '@/types/memory';

interface MemoryStore {
  memories: Memory[];
  newMemoryContent: string;
  editingMemoryId: string | null;
  setMemories: (memories: Memory[]) => void;
  setNewMemoryContent: (content: string) => void;
  setEditingMemoryId: (id: string | null) => void;
  fetchMemories: () => Promise<void>;
  createMemory: (memory: string) => Promise<void>;
  deleteMemory: (memoryId: string) => Promise<void>;
  editMemory: (memoryId: string, updatedContent: string) => Promise<void>;
}

export const useMemoryStore = create<MemoryStore>((set) => ({
  memories: [],
  newMemoryContent: '',
  editingMemoryId: null,
  setMemories: (memories) => set({ memories }),
  setNewMemoryContent: (content) => set({ newMemoryContent: content }),
  setEditingMemoryId: (id) => set({ editingMemoryId: id }),
  fetchMemories: async () => {
    try {
      const response = await fetch('/api/memory');
      const data = await response.json();
      set({ memories: data });
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  },
  createMemory: async (memory) => {
    try {
      const response = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: memory }),
      });
      if (response.ok) {
        const newMemory = await response.json();
        set((state) => ({
          memories: [newMemory, ...state.memories],
          newMemoryContent: '',
        }));
      } else {
        throw new Error('Failed to create memory');
      }
    } catch (error) {
      console.error('Error creating memory:', error);
    }
  },
  deleteMemory: async (memoryId) => {
    try {
      const response = await fetch(`/api/memory/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId }),
      });
      if (response.ok) {
        set((state) => ({
          memories: state.memories.filter((memory) => memory.id !== memoryId),
        }));
      } else {
        throw new Error('Failed to delete memory');
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  },
  editMemory: async (memoryId, updatedContent) => {
    try {
      const response = await fetch(`/api/memory/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId, content: updatedContent }),
      });
      if (response.ok) {
        const updatedMemory = await response.json();
        set((state) => ({
          memories: state.memories.map((memory) =>
            memory.id === memoryId ? updatedMemory : memory
          ),
          editingMemoryId: null,
        }));
      } else {
        throw new Error('Failed to update memory');
      }
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  },
}));