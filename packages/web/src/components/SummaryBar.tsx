import ScoreRing from './ScoreRing';

interface SummaryBarProps {
  score: number;
  errors: number;
  warnings: number;
  info: number;
}

export default function SummaryBar({ score, errors, warnings, info }: SummaryBarProps) {
  const total = errors + warnings + info;

  return (
    <div className="flex items-center gap-5 mb-5 p-4 bg-white rounded-xl border border-slate-200 shadow-card animate-fade-in-up">
      <ScoreRing score={score} size={64} />

      <div className="flex-1">
        {total === 0 ? (
          <p className="text-sm font-medium text-chime-600">
            No issues found -- your content looks great!
          </p>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-700 mb-2">
              {total} {total === 1 ? 'issue' : 'issues'} found
            </p>
            <div className="flex items-center gap-4 text-xs">
              {errors > 0 && (
                <span className="inline-flex items-center gap-1.5 font-medium text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                  {errors} {errors === 1 ? 'error' : 'errors'}
                </span>
              )}
              {warnings > 0 && (
                <span className="inline-flex items-center gap-1.5 font-medium text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  {warnings} {warnings === 1 ? 'warning' : 'warnings'}
                </span>
              )}
              {info > 0 && (
                <span className="inline-flex items-center gap-1.5 font-medium text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                  {info} {info === 1 ? 'suggestion' : 'suggestions'}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
