import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TRACKS } from '../../constants/tracks';
import { useResumeStore } from '../../store/resumeStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { TrackCard } from './TrackCard';
import { ThemeToggle } from '../ui/ThemeToggle';
import { BrandLogo } from '../ui/BrandLogo';
import type { DeveloperTrack } from '../../types/resume';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const setTrack = useResumeStore((s) => s.setTrack);
  const setStep = useOnboardingStore((s) => s.setStep);
  const [selected, setSelected] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleContinue = () => {
    if (!selected) return;
    setTrack(selected as DeveloperTrack);
    setStep(2);
    navigate('/skills');
  };

  return (
    <div className={`min-h-screen bg-gray-950 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <BrandLogo className="h-8" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-xs text-gray-400 bg-gray-800 px-2.5 py-1 rounded-full">Step 1 of 2</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            What kind of developer<br className="hidden sm:block" /> are you?
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
            Pick your specialty. We'll build a resume tailored to your exact stack, tools, and track.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {TRACKS.map((track, i) => (
            <TrackCard
              key={track.id}
              track={track}
              selected={selected === track.id}
              onSelect={setSelected}
              animDelay={i * 35}
            />
          ))}
        </div>
      </main>

      <div className="sticky bottom-0 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            {selected
              ? <>Selected: <span className="font-semibold text-gray-200">{selected}</span></>
              : 'Choose a track to continue'}
          </p>
          <button
            onClick={handleContinue}
            disabled={!selected}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Next: Your Skills <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
