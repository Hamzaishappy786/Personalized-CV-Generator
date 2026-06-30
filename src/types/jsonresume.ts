export interface JRLocation {
  address?: string;
  city?: string;
  region?: string;
  countryCode?: string;
}

export interface JRProfile {
  network?: string;
  url?: string;
  username?: string;
}

export interface JRBasics {
  name?: string;
  label?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: JRLocation;
  profiles?: JRProfile[];
  image?: string;
}

export interface JRWork {
  name?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface JREducation {
  institution?: string;
  studyType?: string;
  area?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface JRSkill {
  name?: string;
  level?: string;
  keywords?: string[];
}

export interface JRProject {
  name?: string;
  description?: string;
  highlights?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface JRAward {
  title?: string;
  date?: string;
  awarder?: string;
  summary?: string;
}

export interface JRVolunteer {
  organization?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface JRLanguage {
  language?: string;
  fluency?: string;
}

export interface JRInterest {
  name?: string;
  keywords?: string[];
}

export interface JRReference {
  name?: string;
  reference?: string;
}

export interface JSONResumeData {
  basics?: JRBasics;
  work?: JRWork[];
  education?: JREducation[];
  skills?: JRSkill[];
  projects?: JRProject[];
  awards?: JRAward[];
  volunteer?: JRVolunteer[];
  languages?: JRLanguage[];
  interests?: JRInterest[];
  references?: JRReference[];
  certificates?: Array<{ name?: string; date?: string; issuer?: string; url?: string }>;
  publications?: Array<{ name?: string; publisher?: string; releaseDate?: string; summary?: string; url?: string }>;
}

export interface TemplateProps {
  resume: JSONResumeData;
}
