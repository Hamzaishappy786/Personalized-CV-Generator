export type DeveloperTrack =
  | 'Web Frontend'
  | 'Web Backend'
  | 'Fullstack'
  | 'React Native'
  | 'Flutter'
  | 'Android (Kotlin)'
  | 'Android (Java)'
  | 'iOS (Swift)'
  | 'iOS (Objective-C)'
  | 'DevOps / SRE'
  | 'Cloud Engineer'
  | 'Data Engineer'
  | 'ML / AI Engineer'
  | 'Blockchain / Web3'
  | 'Game Developer'
  | 'Embedded / IoT';

export type ProjectPlatform = 'Web' | 'iOS' | 'Android' | 'Cross-Platform' | 'Desktop' | 'CLI';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  platform: ProjectPlatform;
  description: string;
  bullets: string[];
  techStack: string[];
  repoUrl: string;
  liveUrl: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
}

export interface ResumeState {
  track: DeveloperTrack;
  personalInfo: PersonalInfo;
  experiences: WorkExperience[];
  education: Education[];
  projects: Project[];
  skillGroups: SkillGroup[];
}
