import type { TrackConfig } from '../../types/onboarding';
import { TRACK_ICONS } from './TrackIcons';

interface Props {
  track: TrackConfig;
  selected: boolean;
  onSelect: (id: string) => void;
  animDelay: number;
}

export function TrackCard({ track, selected, onSelect, animDelay }: Props) {
  const Icon = TRACK_ICONS[track.id];

  return (
    <button
      onClick={() => onSelect(track.id)}
      style={{ animationDelay: `${animDelay}ms` }}
      className={`
        group relative p-5 rounded-2xl text-left transition-all duration-200 animate-fadeIn
        border bg-white dark:bg-gray-900 cursor-pointer outline-none
        hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-indigo-400
        ${selected
          ? 'border-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-800 shadow-lg -translate-y-0.5'
          : 'border-gray-200 dark:border-gray-700 shadow-sm hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
    >
      {/* Flash overlay — fires once on hover entry */}
      <div className="card-flash absolute inset-0 rounded-2xl bg-white pointer-events-none" />

      <div className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r ${track.gradient}`} />

      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Coloured icon bubble — gradient matches the card's accent bar */}
      <div className={`relative w-10 h-10 mb-3 rounded-xl flex items-center justify-center overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${track.gradient} opacity-20 dark:opacity-30`} />
        <div className={`relative ${selected ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300'} transition-colors`}>
          {Icon && <Icon />}
        </div>
      </div>
      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">{track.label}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">{track.tagline}</p>
    </button>
  );
}
