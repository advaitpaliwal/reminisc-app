// useMemoryStore.ts
import { create } from 'zustand';
import { Memory } from '@/types/memory';

interface MemoryStore {
  memories: Memory[];
  editingMemoryId: string | null;
  setMemories: (callback: (prevState: Memory[]) => Memory[]) => void;
  setEditingMemoryId: (id: string | null) => void;
}

export const useMemoryStore = create<MemoryStore>((set) => ({
  memories: [],
  editingMemoryId: null,
  setMemories: (callback) => set((state) => ({ memories: callback(state.memories) })),
  setEditingMemoryId: (id) => set({ editingMemoryId: id }),
}));