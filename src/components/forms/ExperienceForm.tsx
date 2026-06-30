import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { WorkExperience } from '../../types/resume';
import { FormField, Input } from './FormField';
import { BulletEditor } from './BulletEditor';

function newExp(): WorkExperience {
  return { id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, bullets: [] };
}

const cardBase = 'rounded-xl border bg-white dark:bg-gray-900 overflow-hidden';
const cardBorder = 'border-gray-200 dark:border-gray-700';

interface CardProps {
  exp: WorkExperience;
  onUpdate: (data: Partial<WorkExperience>) => void;
  onRemove: () => void;
}

function ExperienceCard({ exp, onUpdate, onRemove }: CardProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`${cardBase} ${cardBorder}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{exp.role || 'New position'}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{exp.company || 'Company name'}{exp.startDate ? ` · ${exp.startDate}` : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-gray-300 dark:text-gray-600 hover:text-rose-400 transition-colors p-1"
          >
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
            <FormField label="Job title" required>
              <Input value={exp.role} onChange={(e) => onUpdate({ role: e.target.value })} placeholder="Software Engineer" />
            </FormField>
            <FormField label="Company" required>
              <Input value={exp.company} onChange={(e) => onUpdate({ company: e.target.value })} placeholder="Acme Corp" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
            <FormField label="Start date">
              <Input value={exp.startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} placeholder="2022-06" />
            </FormField>
            <FormField label="End date">
              <Input value={exp.endDate} onChange={(e) => onUpdate({ endDate: e.target.value })} placeholder="2024-03" disabled={exp.isCurrent} />
            </FormField>
            <label className="flex items-center gap-2 col-span-2 pb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exp.isCurrent}
                onChange={(e) => onUpdate({ isCurrent: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Currently working here</span>
            </label>
          </div>

          <FormField label="Bullet points">
            <BulletEditor bullets={exp.bullets} context="experience" onChange={(bullets) => onUpdate({ bullets })} />
          </FormField>
        </div>
      )}
    </div>
  );
}

export function ExperienceForm() {
  const experiences = useResumeStore((s) => s.experiences);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);

  return (
    <div className="flex flex-col gap-3">
      {experiences.map((exp) => (
        <ExperienceCard key={exp.id} exp={exp} onUpdate={(d) => updateExperience(exp.id, d)} onRemove={() => removeExperience(exp.id)} />
      ))}
      <button
        onClick={() => addExperience(newExp())}
        className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400 dark:text-gray-500 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
        Add experience
      </button>
    </div>
  );
}
