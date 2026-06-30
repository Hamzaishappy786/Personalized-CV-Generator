import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../../store/templateStore';
import { useResumeStore } from '../../store/resumeStore';
import { adaptToJSONResume } from '../../utils/resumeAdapter';
import { getTemplate } from './templateRegistry';
import { ThemeToggle } from '../ui/ThemeToggle';

type Section = 'personal' | 'experience' | 'education' | 'projects' | 'skills';

const EDIT_SECTIONS: { id: Section; label: string }[] = [
  { id: 'personal',   label: 'Personal info' },
  { id: 'experience', label: 'Experience' },
  { id: 'education',  label: 'Education' },
  { id: 'projects',   label: 'Projects' },
  { id: 'skills',     label: 'Skills' },
];

export function ResumePreviewPage() {
  const navigate = useNavigate();
  const { selectedId } = useTemplateStore();
  const resumeState = useResumeStore();
  const resume = adaptToJSONResume(resumeState);
  const tpl = getTemplate(selectedId);

  const goEdit = (section: Section) => navigate(`/builder?section=${section}`);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Toolbar — hidden on print */}
      <header className="no-print bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/builder')}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M10 4L6 8l4 4"/>
              </svg>
              Builder
            </button>
            <span className="text-gray-200 dark:text-gray-700">/</span>
            <button onClick={() => navigate('/templates')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              {tpl.label}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {EDIT_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => goEdit(s.id)}
                className="hidden lg:block text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
              >
                {s.label}
              </button>
            ))}

            <ThemeToggle />

            <button
              onClick={() => navigate('/templates')}
              className="text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              Change template
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6V2h8v4"/>
                <rect x="2" y="6" width="12" height="6" rx="1"/>
                <path d="M4 10v4h8v-4"/>
                <circle cx="12" cy="9" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
              Print / Save PDF
            </button>
          </div>
        </div>
      </header>

      <main className="py-8 px-4">
        <div className="resume-sheet mx-auto bg-white shadow-xl">
          <tpl.component resume={resume} />
        </div>
      </main>

      {/* Mobile edit bar — hidden on print */}
      <div className="no-print lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2 flex gap-2 overflow-x-auto z-20">
        {EDIT_SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => goEdit(s.id)}
            className="shrink-0 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 px-3 py-1.5 rounded-full transition-colors"
          >
            Edit {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
