import { create } from 'zustand';
import type { SelectedSkill, ExperienceLevel, SkillCategory } from '../types/onboarding';

interface OnboardingState {
  step: 1 | 2;
  selectedSkills: SelectedSkill[];
}

interface OnboardingActions {
  setStep: (step: 1 | 2) => void;
  toggleSkill: (name: string, category: SkillCategory) => void;
  setExperience: (name: string, experience: ExperienceLevel) => void;
  addCustomSkill: (name: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()((set) => ({
  step: 1,
  selectedSkills: [],

  setStep: (step) => set({ step }),

  toggleSkill: (name, category) =>
    set((s) => {
      const exists = s.selectedSkills.some((sk) => sk.name === name);
      if (exists) {
        return { selectedSkills: s.selectedSkills.filter((sk) => sk.name !== name) };
      }
      return { selectedSkills: [...s.selectedSkills, { name, category, experience: '1-2yrs' }] };
    }),

  setExperience: (name, experience) =>
    set((s) => ({
      selectedSkills: s.selectedSkills.map((sk) =>
        sk.name === name ? { ...sk, experience } : sk
      ),
    })),

  addCustomSkill: (name) =>
    set((s) => {
      const trimmed = name.trim();
      if (!trimmed || s.selectedSkills.some((sk) => sk.name === trimmed)) return s;
      return {
        selectedSkills: [...s.selectedSkills, { name: trimmed, category: 'Tool', experience: '1-2yrs' }],
      };
    }),

  reset: () => set({ step: 1, selectedSkills: [] }),
}));
