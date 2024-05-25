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
  createMemory: (memory: string) => Promise<Memory | null>;
  deleteMemory: (memoryId: string) => Promise<boolean>;
  editMemory: (memoryId: string, updatedContent: string) => Promise<Memory | null>;
  processMemory: (memory: string) => Promise<Memory | null>;
}

const API_BASE_URL = '/api/memory';

export const useMemoryStore = create<MemoryStore>((set) => ({
  memories: [],
  newMemoryContent: '',
  editingMemoryId: null,

  setMemories: (memories) => set({ memories }),
  setNewMemoryContent: (content) => set({ newMemoryContent: content }),
  setEditingMemoryId: (id) => set({ editingMemoryId: id }),

  fetchMemories: async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch memories');
      }
      const data = await response.json();
      set({ memories: data });
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  },

  createMemory: async (memory) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: memory }),
      });
      if (!response.ok) {
        throw new Error('Failed to create memory');
      }
      const newMemory = await response.json();
      set((state) => ({
        memories: [newMemory, ...state.memories],
        newMemoryContent: '',
      }));
      return newMemory;
    } catch (error) {
      console.error('Error creating memory:', error);
      return null;
    }
  },

  deleteMemory: async (memoryId) => {
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
      set((state) => ({
        memories: state.memories.filter((memory) => memory.id !== memoryId),
      }));
      return true;
    } catch (error) {
      console.error('Error deleting memory:', error);
      return false;
    }
  },

  editMemory: async (memoryId, updatedContent) => {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId, content: updatedContent }),
      });
      if (!response.ok) {
        throw new Error('Failed to update memory');
      }
      const updatedMemory = await response.json();
      set((state) => ({
        memories: state.memories.map((memory) =>
          memory.id === memoryId ? updatedMemory : memory
        ),
        editingMemoryId: null,
      }));
      return updatedMemory;
    } catch (error) {
      console.error('Error updating memory:', error);
      return null;
    }
  },

  processMemory: async (memory) => {
    try {
      const response = await fetch(`${API_BASE_URL}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: memory }),
      });
      if (!response.ok) {
        throw new Error('Failed to process memory');
      }
      const processedMemory = await response.json();
      console.log('Processed memory:', processedMemory);
      if (processedMemory.content) {
        set((state) => ({
          memories: [processedMemory, ...state.memories],
        }));
      }
      return processedMemory;
    } catch (error) {
      console.error('Error processing memory:', error);
      return null;
    }
  },
}));