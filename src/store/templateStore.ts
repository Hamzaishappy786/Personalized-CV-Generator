import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TemplateStore {
  selectedId: string;
  setTemplate: (id: string) => void;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set) => ({
      selectedId: 'modern-classic',
      setTemplate: (id) => set({ selectedId: id }),
    }),
    { name: 'devresume-template' }
  )
);
