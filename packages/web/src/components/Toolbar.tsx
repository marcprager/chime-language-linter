import { type SeverityFilter } from '../hooks/useLinter';

interface ToolbarProps {
  filter: SeverityFilter;
  onFilterChange: (filter: SeverityFilter) => void;
  errors: number;
  warnings: number;
  info: number;
  autoFixableCount: number;
  copyFeedback: boolean;
  onFixAll: () => void;
  onCopyClean: () => void;
}

const FILTER_TABS: { key: SeverityFilter; label: string; countKey?: 'errors' | 'warnings' | 'info' }[] = [
  { key: 'all', label: 'All' },
  { key: 'error', label: 'Attention', countKey: 'errors' },
  { key: 'warning', label: 'Consider', countKey: 'warnings' },
  { key: 'info', label: 'Style Tips', countKey: 'info' },
];

const FILTER_ACTIVE_STYLES: Record<SeverityFilter, string> = {
  all: 'bg-slate-800 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-blue-500 text-white',
};

export default function Toolbar({
  filter,
  onFilterChange,
  errors,
  warnings,
  info,
  autoFixableCount,
  copyFeedback,
  onFixAll,
  onCopyClean,
}: ToolbarProps) {
  const counts = { errors, warnings, info };
  const total = errors + warnings + info;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="tablist">
        {FILTER_TABS.map((tab) => {
          const count = tab.countKey ? counts[tab.countKey] : total;
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                isActive
                  ? FILTER_ACTIVE_STYLES[tab.key]
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`ml-1.5 ${isActive ? 'opacity-80' : 'opacity-50'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {autoFixableCount > 0 && (
          <button
            onClick={onFixAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-chime-600 text-white text-xs font-semibold rounded-lg hover:bg-chime-700 active:bg-chime-800 transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Fix All ({autoFixableCount})
          </button>
        )}

        <button
          onClick={onCopyClean}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-sm"
        >
          {copyFeedback ? (
            <>
              <svg className="w-3.5 h-3.5 text-chime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Polished Text
            </>
          )}
        </button>
      </div>
    </div>
  );
}
