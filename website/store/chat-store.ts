import { create } from 'zustand';

interface ChatState {
  prompt: string;
  setPrompt: (msg: string) => void;
  isNewPrompt: boolean;
  setIsNewPrompt: (value: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  prompt: '',
  setPrompt: (msg: string) => set({ prompt: msg }),
  isNewPrompt: false,
  setIsNewPrompt: (value: boolean) => set({ isNewPrompt: value }),
}));