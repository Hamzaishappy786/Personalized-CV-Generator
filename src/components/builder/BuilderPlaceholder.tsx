import { useResumeStore } from '../../store/resumeStore';
import { useOnboardingStore } from '../../store/onboardingStore';

export function BuilderPlaceholder() {
  const track = useResumeStore((s) => s.track);
  const skillGroups = useResumeStore((s) => s.skillGroups);
  const selectedSkills = useOnboardingStore((s) => s.selectedSkills);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <img src="/logo.svg" className="w-12 h-12" alt="" />
      <h1 className="text-2xl font-bold text-gray-900">Builder coming in Phase 4</h1>
      <p className="text-gray-500 max-w-md">
        Onboarding complete! Track set to <strong>{track}</strong> with{' '}
        <strong>{selectedSkills.length}</strong> skills across{' '}
        <strong>{skillGroups.length}</strong> categories.
      </p>
      <div className="flex flex-wrap gap-2 justify-center mt-2 max-w-lg">
        {selectedSkills.map((s) => (
          <span key={s.name} className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
            {s.name} · {s.experience}
          </span>
        ))}
      </div>
    </div>
  );
}
