import {create} from 'zustand';

interface ActionDetails {
  type: 'retrieve' | 'create' | 'update';
  title: string;
  content: string;
  status: 'start' | 'end';
}

interface ToolStatusState {
  currentAction: ActionDetails | null;
  setAction: (action: ActionDetails | null) => void;
}

export const useToolStatusStore = create<ToolStatusState>((set) => ({
  currentAction: null,
  setAction: (action: ActionDetails | null) => set({ currentAction: action }),
}));
