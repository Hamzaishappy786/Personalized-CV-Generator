import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import type { Education } from '../../types/resume';
import { FormField, Input } from './FormField';

function newEdu(): Education {
  return { id: crypto.randomUUID(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' };
}

interface CardProps {
  edu: Education;
  onUpdate: (data: Partial<Education>) => void;
  onRemove: () => void;
}

function EducationCard({ edu, onUpdate, onRemove }: CardProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{edu.institution || 'Institution name'}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {edu.degree && edu.field ? `${edu.degree} in ${edu.field}` : edu.degree || 'Degree'}
            {edu.startDate ? ` · ${edu.startDate}` : ''}
          </p>
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
          <FormField label="Institution" required>
            <Input value={edu.institution} onChange={(e) => onUpdate({ institution: e.target.value })} placeholder="FAST-NUCES Lahore" />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Degree">
              <Input value={edu.degree} onChange={(e) => onUpdate({ degree: e.target.value })} placeholder="Bachelor of Science" />
            </FormField>
            <FormField label="Field of study">
              <Input value={edu.field} onChange={(e) => onUpdate({ field: e.target.value })} placeholder="Computer Science" />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Start date">
              <Input value={edu.startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} placeholder="2019-09" />
            </FormField>
            <FormField label="End date">
              <Input value={edu.endDate} onChange={(e) => onUpdate({ endDate: e.target.value })} placeholder="2023-06" />
            </FormField>
            <FormField label="GPA" hint="Optional">
              <Input value={edu.gpa} onChange={(e) => onUpdate({ gpa: e.target.value })} placeholder="3.8 / 4.0" />
            </FormField>
          </div>
        </div>
      )}
    </div>
  );
}

export function EducationForm() {
  const education = useResumeStore((s) => s.education);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);

  return (
    <div className="flex flex-col gap-3">
      {education.map((edu) => (
        <EducationCard key={edu.id} edu={edu} onUpdate={(d) => updateEducation(edu.id, d)} onRemove={() => removeEducation(edu.id)} />
      ))}
      <button
        onClick={() => addEducation(newEdu())}
        className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400 dark:text-gray-500 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
        Add education
      </button>
    </div>
  );
}
