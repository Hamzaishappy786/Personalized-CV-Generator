import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeState, DeveloperTrack, PersonalInfo, WorkExperience, Education, Project, SkillGroup } from '../types/resume';
import { DEFAULT_RESUME_STATE } from '../constants/defaults';

interface ResumeActions {
  setTrack: (track: DeveloperTrack) => void;
  setPersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (exp: WorkExperience) => void;
  updateExperience: (id: string, data: Partial<WorkExperience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setSkillGroups: (groups: SkillGroup[]) => void;
  addSkillToGroup: (groupId: string, skill: string) => void;
  removeSkillFromGroup: (groupId: string, skill: string) => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeState & ResumeActions>()(
  persist(
    (set) => ({
      ...DEFAULT_RESUME_STATE,

      setTrack: (track) => set({ track }),

      setPersonalInfo: (info) =>
        set((s) => ({ personalInfo: { ...s.personalInfo, ...info } })),

      addExperience: (exp) =>
        set((s) => ({ experiences: [...s.experiences, exp] })),
      updateExperience: (id, data) =>
        set((s) => ({ experiences: s.experiences.map((e) => e.id === id ? { ...e, ...data } : e) })),
      removeExperience: (id) =>
        set((s) => ({ experiences: s.experiences.filter((e) => e.id !== id) })),

      addEducation: (edu) =>
        set((s) => ({ education: [...s.education, edu] })),
      updateEducation: (id, data) =>
        set((s) => ({ education: s.education.map((e) => e.id === id ? { ...e, ...data } : e) })),
      removeEducation: (id) =>
        set((s) => ({ education: s.education.filter((e) => e.id !== id) })),

      addProject: (project) =>
        set((s) => ({ projects: [...s.projects, project] })),
      updateProject: (id, data) =>
        set((s) => ({ projects: s.projects.map((p) => p.id === id ? { ...p, ...data } : p) })),
      removeProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      setSkillGroups: (groups) => set({ skillGroups: groups }),
      addSkillToGroup: (groupId, skill) =>
        set((s) => ({
          skillGroups: s.skillGroups.map((g) =>
            g.id === groupId && !g.skills.includes(skill)
              ? { ...g, skills: [...g.skills, skill] }
              : g
          ),
        })),
      removeSkillFromGroup: (groupId, skill) =>
        set((s) => ({
          skillGroups: s.skillGroups.map((g) =>
            g.id === groupId ? { ...g, skills: g.skills.filter((sk) => sk !== skill) } : g
          ),
        })),

      reset: () => set(DEFAULT_RESUME_STATE),
    }),
    { name: 'devresume-state' }
  )
);
