import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResumeStore } from '../../store/resumeStore';
import { PersonalInfoForm } from '../forms/PersonalInfoForm';
import { ExperienceForm } from '../forms/ExperienceForm';
import { EducationForm } from '../forms/EducationForm';
import { ProjectForm } from '../forms/ProjectForm';
import { SkillsPanel } from '../forms/SkillsPanel';
import { HFConnectModal } from '../auth/HFConnectModal';
import { useAuthStore } from '../../store/authStore';
import { BrandLogo } from '../ui/BrandLogo';

type Section = 'personal' | 'experience' | 'education' | 'projects' | 'skills';

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: 'personal',   label: 'Personal',   icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z' },
  { id: 'experience', label: 'Experience', icon: 'M3 7h18M3 12h18M3 17h12' },
  { id: 'education',  label: 'Education',  icon: 'M12 3L2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 18l10 5 10-5' },
  { id: 'projects',   label: 'Projects',   icon: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z' },
  { id: 'skills',     label: 'Skills',     icon: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18' },
];

const SECTION_HEADINGS: Record<Section, { title: string; desc: string }> = {
  personal:   { title: 'Personal info',   desc: 'Your name, contact details, and a short professional summary.' },
  experience: { title: 'Work experience', desc: 'Most recent first. Use bullet points and focus on outcomes.' },
  education:  { title: 'Education',       desc: 'Degrees, institutions, and graduation dates.' },
  projects:   { title: 'Projects',        desc: 'Side projects, open source, freelance. Anything you shipped.' },
  skills:     { title: 'Skills',          desc: 'Imported from your onboarding selection. Fine-tune below.' },
};

export function BuilderScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState<Section>('personal');
  const [hfOpen, setHfOpen] = useState(false);
  const isConnected = useAuthStore((s) => s.isConnected);
  const track = useResumeStore((s) => s.track);

  useEffect(() => {
    const section = searchParams.get('section') as Section | null;
    if (section && SECTION_HEADINGS[section]) setActive(section);
  }, [searchParams]);

  const { title, desc } = SECTION_HEADINGS[active];

  return (
    <div className="dark min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo className="h-7" />
            <span className="hidden sm:block text-xs text-gray-500 border-l border-gray-700 pl-3 truncate">
              {track}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHfOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isConnected
                  ? 'border-emerald-700 bg-emerald-950/50 text-emerald-400 hover:bg-emerald-900/40'
                  : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-gray-600'}`} />
              {isConnected ? 'HF connected' : 'Connect HF'}
            </button>

            <button
              onClick={() => navigate('/templates')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Templates
            </button>
            <button
              onClick={() => navigate('/preview')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6V2h8v4"/><rect x="2" y="6" width="12" height="6" rx="1"/><path d="M4 10v4h8v-4"/>
                <circle cx="12" cy="9" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
              Preview & Print
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-6xl mx-auto w-full px-4 py-6 gap-6">
        {/* Sidebar */}
        <nav className="hidden md:flex flex-col gap-1 w-44 shrink-0">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                active === s.id
                  ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/50'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={s.icon} />
              </svg>
              {s.label}
            </button>
          ))}

          <div className="mt-auto pt-4 border-t border-gray-800">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors w-full"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M10 12L6 8l4-4"/>
              </svg>
              Start over
            </button>
          </div>
        </nav>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-gray-900 border-t border-gray-800 z-20 flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                active === s.id ? 'text-indigo-400' : 'text-gray-600'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={s.icon} />
              </svg>
              {s.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
          </div>

          {active === 'personal'   && <PersonalInfoForm />}
          {active === 'experience' && <ExperienceForm />}
          {active === 'education'  && <EducationForm />}
          {active === 'projects'   && <ProjectForm />}
          {active === 'skills'     && <SkillsPanel />}
        </main>
      </div>

      {hfOpen && <HFConnectModal onClose={() => setHfOpen(false)} />}
    </div>
  );
}
