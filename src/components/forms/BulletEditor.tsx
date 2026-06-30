import { useState } from 'react';
import { useAIEnhance } from '../../hooks/useAIEnhance';
import { TextArea } from './FormField';

interface Props {
  bullets: string[];
  context: 'experience' | 'project';
  onChange: (bullets: string[]) => void;
}

export function BulletEditor({ bullets, context, onChange }: Props) {
  const [rawText, setRawText] = useState('');
  const [showRaw, setShowRaw] = useState(false);
  const { enhance, isLoading, error, isConnected } = useAIEnhance();

  const handleEnhance = async () => {
    if (!rawText.trim()) return;
    const result = await enhance(rawText, context);
    if (result.length > 0) {
      onChange([...bullets, ...result]);
      setRawText('');
      setShowRaw(false);
    }
  };

  const updateBullet = (i: number, val: string) => {
    const next = [...bullets];
    next[i] = val;
    onChange(next);
  };

  const removeBullet = (i: number) => onChange(bullets.filter((_, j) => j !== i));
  const addBlank = () => onChange([...bullets, '']);

  return (
    <div className="flex flex-col gap-2">
      {bullets.map((b, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2.5 text-gray-300 dark:text-gray-600 text-xs select-none">•</span>
          <input
            value={b}
            onChange={(e) => updateBullet(i, e.target.value)}
            placeholder="Describe what you did and the impact…"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-colors"
          />
          <button
            onClick={() => removeBullet(i)}
            className="mt-2 text-gray-300 dark:text-gray-600 hover:text-rose-400 transition-colors"
            title="Remove"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      ))}

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={addBlank}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
        >
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v10M3 8h10" strokeLinecap="round"/>
          </svg>
          Add bullet
        </button>
        <span className="text-gray-200 dark:text-gray-700">|</span>
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors"
        >
          {showRaw ? 'Hide AI input' : 'Enhance with AI'}
        </button>
      </div>

      {showRaw && (
        <div className="mt-1 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900 flex flex-col gap-2">
          <p className="text-xs text-indigo-700 dark:text-indigo-400 font-medium">
            Paste a rough description. AI will rewrite it as strong, quantified bullet points.
          </p>
          <TextArea
            rows={3}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="e.g. built a dashboard that showed analytics for the sales team and made things faster"
          />
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <button
            onClick={handleEnhance}
            disabled={isLoading || !rawText.trim() || !isConnected}
            className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
                </svg>
                Enhancing…
              </>
            ) : 'Generate bullets'}
          </button>
          {!isConnected && (
            <p className="text-xs text-gray-400 dark:text-gray-500">Connect Hugging Face at the top to enable AI.</p>
          )}
        </div>
      )}
    </div>
  );
}
