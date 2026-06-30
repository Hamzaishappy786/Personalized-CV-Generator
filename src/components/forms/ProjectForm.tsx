import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { Project, ProjectPlatform } from '../../types/resume';
import { FormField, Input } from './FormField';
import { BulletEditor } from './BulletEditor';

const PLATFORMS: ProjectPlatform[] = ['Web', 'iOS', 'Android', 'Cross-Platform', 'Desktop', 'CLI'];

function newProject(): Project {
  return { id: crypto.randomUUID(), name: '', platform: 'Web', description: '', bullets: [], techStack: [], repoUrl: '', liveUrl: '' };
}

interface CardProps {
  project: Project;
  onUpdate: (data: Partial<Project>) => void;
  onRemove: () => void;
}

function ProjectCard({ project, onUpdate, onRemove }: CardProps) {
  const [open, setOpen] = useState(true);
  const [techInput, setTechInput] = useState('');

  const addTech = () => {
    const val = techInput.trim();
    if (val && !project.techStack.includes(val)) onUpdate({ techStack: [...project.techStack, val] });
    setTechInput('');
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{project.name || 'New project'}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{project.platform}{project.techStack.length > 0 ? ` · ${project.techStack.slice(0, 3).join(', ')}` : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-gray-300 dark:text-gray-600 hover:text-rose-400 transition-colors p-1">
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5l.5-9"/>
            </svg>
          </button>
          <svg viewBox="0 0 16 16" className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Project name" required>
              <Input value={project.name} onChange={(e) => onUpdate({ name: e.target.value })} placeholder="My Awesome App" />
            </FormField>
            <FormField label="Platform">
              <select
                value={project.platform}
                onChange={(e) => onUpdate({ platform: e.target.value as ProjectPlatform })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-colors"
              >
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Short description" hint="One sentence about what it does">
            <Input value={project.description} onChange={(e) => onUpdate({ description: e.target.value })} placeholder="A real-time dashboard for tracking sales KPIs." />
          </FormField>

          <FormField label="Tech stack">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {project.techStack.map((t) => (
                <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs rounded-full border border-indigo-100 dark:border-indigo-800">
                  {t}
                  <button onClick={() => onUpdate({ techStack: project.techStack.filter((x) => x !== t) })} className="hover:text-rose-500 transition-colors">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} placeholder="React, Node.js, PostgreSQL…" />
              <button onClick={addTech} className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors shrink-0">Add</button>
            </div>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Repo URL">
              <Input type="url" value={project.repoUrl} onChange={(e) => onUpdate({ repoUrl: e.target.value })} placeholder="https://github.com/you/repo" />
            </FormField>
            <FormField label="Live URL">
              <Input type="url" value={project.liveUrl} onChange={(e) => onUpdate({ liveUrl: e.target.value })} placeholder="https://myapp.vercel.app" />
            </FormField>
          </div>

          <FormField label="Bullet points">
            <BulletEditor bullets={project.bullets} context="project" onChange={(bullets) => onUpdate({ bullets })} />
          </FormField>
        </div>
      )}
    </div>
  );
}

export function ProjectForm() {
  const projects = useResumeStore((s) => s.projects);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);

  return (
    <div className="flex flex-col gap-3">
      {projects.map((proj) => (
        <ProjectCard key={proj.id} project={proj} onUpdate={(d) => updateProject(proj.id, d)} onRemove={() => removeProject(proj.id)} />
      ))}
      <button
        onClick={() => addProject(newProject())}
        className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400 dark:text-gray-500 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
        Add project
      </button>
    </div>
  );
}
