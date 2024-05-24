import { create } from 'zustand';
import { Memory } from '@/types/memory';
import { initialMemories } from '@/data/memories';

interface MemoryStore {
  memories: Memory[];
  newMemoryContent: string;
  editingMemoryId: string | null;
  setMemories: (memories: Memory[]) => void;
  setNewMemoryContent: (content: string) => void;
  setEditingMemoryId: (id: string | null) => void;
  createMemory: (memory: Memory) => void;
  deleteMemory: (memoryId: string) => void;
  editMemory: (memoryId: string, updatedContent: string) => void;
}

export const useMemoryStore = create<MemoryStore>((set) => ({
  memories: initialMemories.sort((a, b) => (b.created_at > a.created_at ? 1 : -1)),
  newMemoryContent: '',
  editingMemoryId: null,
  setMemories: (memories) => set({ memories }),
  setNewMemoryContent: (content) => set({ newMemoryContent: content }),
  setEditingMemoryId: (id) => set({ editingMemoryId: id }),
  createMemory: (memory) =>
    set((state) => ({ memories: [memory, ...state.memories], newMemoryContent: '' })),
  deleteMemory: (memoryId) =>
    set((state) => ({ memories: state.memories.filter((memory) => memory.id !== memoryId) })),
  editMemory: (memoryId, updatedContent) =>
    set((state) => ({
      memories: state.memories.map((memory) =>
        memory.id === memoryId
          ? { ...memory, content: updatedContent, updated_at: new Date().toISOString() }
          : memory
      ),
      editingMemoryId: null,
    })),
}));