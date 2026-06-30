import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { useNavigate } from 'react-router-dom';

export function SkillsPanel() {
  const skillGroups = useResumeStore((s) => s.skillGroups);
  const addSkillToGroup = useResumeStore((s) => s.addSkillToGroup);
  const removeSkillFromGroup = useResumeStore((s) => s.removeSkillFromGroup);
  const navigate = useNavigate();

  const [inputs, setInputs] = useState<Record<string, string>>({});

  const addSkill = (groupId: string) => {
    const val = (inputs[groupId] ?? '').trim();
    if (val) {
      addSkillToGroup(groupId, val);
      setInputs((prev) => ({ ...prev, [groupId]: '' }));
    }
  };

  if (skillGroups.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-gray-400 dark:text-gray-500 text-sm">No skills yet. Go back through onboarding to pick your stack.</p>
        <button
          onClick={() => navigate('/skills')}
          className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Pick skills
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-400 dark:text-gray-500">
        Skills were imported from onboarding. Add or remove individual ones below. To start over,{' '}
        <button onClick={() => navigate('/skills')} className="text-indigo-500 dark:text-indigo-400 hover:underline">re-run skill selection.</button>
      </p>

      {skillGroups.map((group) => (
        <div key={group.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">{group.category}</h3>

          <div className="flex flex-wrap gap-2 mb-3">
            {group.skills.map((skill) => (
              <span key={skill} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-700">
                {skill}
                <button
                  onClick={() => removeSkillFromGroup(group.id, skill)}
                  className="text-gray-400 dark:text-gray-500 hover:text-rose-500 transition-colors leading-none"
                >
                  ×
                </button>
              </span>
            ))}
            {group.skills.length === 0 && (
              <span className="text-xs text-gray-300 dark:text-gray-600 italic">No skills in this group yet</span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={inputs[group.id] ?? ''}
              onChange={(e) => setInputs((prev) => ({ ...prev, [group.id]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(group.id))}
              placeholder="Add a skill…"
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-colors"
            />
            <button
              onClick={() => addSkill(group.id)}
              className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
