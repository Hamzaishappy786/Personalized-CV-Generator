import { Check, X } from 'lucide-react';
import type { SelectedSkill, ExperienceLevel } from '../../types/onboarding';

const EXP_LEVELS: ExperienceLevel[] = ['<1yr', '1-2yrs', '3-5yrs', '5+yrs'];

interface Props {
  name: string;
  category: string;
  selected: SelectedSkill | undefined;
  onToggle: () => void;
  onSetExperience: (level: ExperienceLevel) => void;
}

export function SkillChip({ name, selected, onToggle, onSetExperience }: Props) {
  if (!selected) {
    return (
      <button
        onClick={onToggle}
        className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/40 transition-all duration-150 whitespace-nowrap"
      >
        {name}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1 items-start">
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-sm text-indigo-700 dark:text-indigo-300">
        <Check size={11} strokeWidth={3} />
        <span>{name}</span>
        <button
          onClick={onToggle}
          className="ml-0.5 hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors"
          aria-label={`Remove ${name}`}
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex gap-0.5 pl-1">
        {EXP_LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => onSetExperience(level)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${
              selected.experience === level
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
