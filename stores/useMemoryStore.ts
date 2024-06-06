import { create } from 'zustand';
import { Memory } from '@/types/memory';

interface MemoryStore {
  memories: Memory[];
  newMemoryContent: string;
  setNewMemoryContent: (content: string) => void;
  editingMemoryId: string | null;
  setMemories: (memories: Memory[]) => void;
  setEditingMemoryId: (id: string | null) => void;
}

export const useMemoryStore = create<MemoryStore>((set) => ({
  memories: [],
  newMemoryContent: '',
  setNewMemoryContent: (content) => set({ newMemoryContent: content }),
  editingMemoryId: null,
  setMemories: (memories) => set({ memories }),
  setEditingMemoryId: (id) => set({ editingMemoryId: id }),
}));