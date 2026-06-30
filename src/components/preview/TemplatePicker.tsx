import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../../store/templateStore';
import { useResumeStore } from '../../store/resumeStore';
import { adaptToJSONResume } from '../../utils/resumeAdapter';
import { TEMPLATES } from './templateRegistry';
import { ThemeToggle } from '../ui/ThemeToggle';
import { BrandLogo } from '../ui/BrandLogo';

export function TemplatePicker() {
  const navigate = useNavigate();
  const { selectedId, setTemplate } = useTemplateStore();
  const resumeState = useResumeStore();
  const resume = adaptToJSONResume(resumeState);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <BrandLogo className="h-8" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => navigate('/builder')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              ← Back to builder
            </button>
            <button onClick={() => navigate('/preview')} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Preview & Print
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Choose a template</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Pick a layout that fits your style. You can switch anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEMPLATES.map((tpl) => {
            const isSelected = tpl.id === selectedId;
            return (
              <button
                key={tpl.id}
                onClick={() => setTemplate(tpl.id)}
                className={[
                  'text-left rounded-xl border-2 overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400',
                  isSelected
                    ? 'border-indigo-600 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md',
                ].join(' ')}
              >
                <div className={`${tpl.accent} h-2`} />
                <div className="bg-white dark:bg-gray-900 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{tpl.label}</h3>
                    {isSelected && (
                      <span className="text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tpl.description}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4 overflow-hidden max-h-72 pointer-events-none">
                  <div className="transform scale-[0.55] origin-top-left" style={{ width: '182%' }}>
                    <tpl.component resume={resume} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
