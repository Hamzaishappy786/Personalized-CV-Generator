import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Search } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { TRACK_SKILLS } from '../../constants/skills';
import { SkillChip } from './SkillChip';
import { ThemeToggle } from '../ui/ThemeToggle';
import { BrandLogo } from '../ui/BrandLogo';
import type { SkillCategory, ExperienceLevel } from '../../types/onboarding';

const ALL_CATEGORIES: SkillCategory[] = ['Language', 'Framework', 'Library', 'Tool', 'Database', 'Cloud', 'Platform'];

export function SkillsScreen() {
  const navigate = useNavigate();
  const track = useResumeStore((s) => s.track);
  const setSkillGroups = useResumeStore((s) => s.setSkillGroups);
  const { selectedSkills, toggleSkill, setExperience, addCustomSkill, setStep } = useOnboardingStore();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'All'>('All');
  const [customInput, setCustomInput] = useState('');

  const allSkills = TRACK_SKILLS[track] ?? [];

  const filtered = allSkills.filter((sk) => {
    const matchesSearch = sk.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || sk.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const availableCategories = ['All', ...ALL_CATEGORIES.filter((c) =>
    allSkills.some((sk) => sk.category === c)
  )] as (SkillCategory | 'All')[];

  const handleAddCustom = () => {
    if (!customInput.trim()) return;
    addCustomSkill(customInput);
    setCustomInput('');
  };

  const handleContinue = () => {
    const groups = ALL_CATEGORIES.map((cat) => ({
      id: crypto.randomUUID(),
      category: cat,
      skills: selectedSkills.filter((sk) => sk.category === cat).map((sk) => sk.name),
    })).filter((g) => g.skills.length > 0);

    const uncategorized = selectedSkills.filter((sk) =>
      !ALL_CATEGORIES.includes(sk.category as SkillCategory)
    ).map((sk) => sk.name);
    if (uncategorized.length > 0) {
      groups.push({ id: crypto.randomUUID(), category: 'Tool', skills: uncategorized });
    }

    setSkillGroups(groups);
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white dark:from-gray-950 dark:via-indigo-950/20 dark:to-gray-900 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <BrandLogo className="h-8" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">Step 2 of 2</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        <button onClick={() => { setStep(1); navigate('/'); }} className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to track selection
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            What's in your toolkit?
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Select your technologies for <span className="font-semibold text-indigo-600 dark:text-indigo-400">{track}</span>. Tap each skill and set your experience level.
          </p>
        </div>

        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search skills…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600"
          />
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 min-h-32">
          {filtered.length > 0 ? filtered.map((skill) => (
            <SkillChip
              key={skill.name}
              name={skill.name}
              category={skill.category}
              selected={selectedSkills.find((s) => s.name === skill.name)}
              onToggle={() => toggleSkill(skill.name, skill.category)}
              onSetExperience={(lvl: ExperienceLevel) => setExperience(skill.name, lvl)}
            />
          )) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">No skills match. Add it below.</p>
          )}
          {selectedSkills
            .filter((s) => !allSkills.some((sk) => sk.name === s.name))
            .map((skill) => (
              <SkillChip
                key={skill.name}
                name={skill.name}
                category={skill.category}
                selected={skill}
                onToggle={() => toggleSkill(skill.name, skill.category as SkillCategory)}
                onSetExperience={(lvl: ExperienceLevel) => setExperience(skill.name, lvl)}
              />
            ))}
        </div>

        <div className="mt-6 flex gap-2">
          <input
            type="text"
            placeholder="Add a custom skill…"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            className="flex-1 px-4 py-2.5 text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
          <button
            onClick={handleAddCustom}
            disabled={!customInput.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-40 transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </main>

      <div className="sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedSkills.length > 0
              ? <><span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedSkills.length}</span> skills selected</>
              : 'Select at least one skill'}
          </p>
          <button
            onClick={handleContinue}
            disabled={selectedSkills.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Build My Resume <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
