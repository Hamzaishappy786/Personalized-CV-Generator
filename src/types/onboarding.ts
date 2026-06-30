export type ExperienceLevel = '<1yr' | '1-2yrs' | '3-5yrs' | '5+yrs';

export type SkillCategory =
  | 'Language'
  | 'Framework'
  | 'Library'
  | 'Tool'
  | 'Database'
  | 'Cloud'
  | 'Platform';

export interface SkillDef {
  name: string;
  category: SkillCategory;
}

export interface SelectedSkill {
  name: string;
  category: SkillCategory;
  experience: ExperienceLevel;
}

export interface TrackConfig {
  id: string;
  emoji: string;
  label: string;
  tagline: string;
  gradient: string;
}
