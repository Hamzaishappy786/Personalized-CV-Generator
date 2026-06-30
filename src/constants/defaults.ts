import type { ResumeState } from '../types/resume';

export const DEFAULT_RESUME_STATE: ResumeState = {
  track: 'Fullstack' as const,
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  experiences: [],
  education: [],
  projects: [],
  skillGroups: [
    { id: crypto.randomUUID(), category: 'Languages', skills: [] },
    { id: crypto.randomUUID(), category: 'Frameworks', skills: [] },
    { id: crypto.randomUUID(), category: 'Tools', skills: [] },
  ],
};
