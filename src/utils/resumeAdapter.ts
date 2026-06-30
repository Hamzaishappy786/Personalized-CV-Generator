import type { ResumeState } from '../types/resume';
import type { JSONResumeData } from '../types/jsonresume';

export function adaptToJSONResume(state: ResumeState): JSONResumeData {
  const p = state.personalInfo;

  const profiles: NonNullable<JSONResumeData['basics']>['profiles'] = [];
  if (p.linkedin) {
    profiles.push({
      network: 'LinkedIn',
      url: p.linkedin,
      username: p.linkedin.split('/').filter(Boolean).pop() ?? '',
    });
  }
  if (p.github) {
    profiles.push({
      network: 'GitHub',
      url: p.github,
      username: p.github.split('/').filter(Boolean).pop() ?? '',
    });
  }

  return {
    basics: {
      name: p.fullName,
      label: state.track,
      email: p.email,
      phone: p.phone,
      url: p.website,
      summary: p.summary,
      location: { city: p.location },
      profiles,
    },
    work: state.experiences.map((exp) => ({
      name: exp.company,
      position: exp.role,
      startDate: exp.startDate,
      endDate: exp.isCurrent ? '' : exp.endDate,
      summary: '',
      highlights: exp.bullets,
    })),
    education: state.education.map((edu) => ({
      institution: edu.institution,
      studyType: edu.degree,
      area: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      score: edu.gpa,
    })),
    skills: state.skillGroups
      .filter((g) => g.skills.length > 0)
      .map((g) => ({ name: g.category, keywords: g.skills })),
    projects: state.projects.map((proj) => ({
      name: proj.name,
      description: proj.description,
      highlights: proj.bullets,
      url: proj.liveUrl || proj.repoUrl,
    })),
  };
}
