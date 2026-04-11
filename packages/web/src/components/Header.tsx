interface HeaderProps {
  wordCount: number;
  charCount: number;
  hasText: boolean;
}

export default function Header({ wordCount, charCount, hasText }: HeaderProps) {
  return (
    <header className="mb-8">
      {/* Green accent top bar */}
      <div className="h-1 w-16 bg-gradient-to-r from-chime-500 to-chime-400 rounded-full mb-6" />

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            <span className="text-chime-600">Feedback</span> LX
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Interactive feedback quality checker for Chime content authors
          </p>
        </div>

        {hasText && (
          <div className="text-xs text-slate-400 font-mono tabular-nums animate-fade-in-up">
            {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'}
            <span className="mx-1.5 text-slate-300">&middot;</span>
            {charCount.toLocaleString()} {charCount === 1 ? 'char' : 'chars'}
          </div>
        )}
      </div>

      {/* What does this check? */}
      <details className="mt-4 text-sm">
        <summary className="text-chime-600 font-medium cursor-pointer hover:text-chime-700 transition-colors select-none">
          What does this check?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-chime-200 space-y-1.5 text-slate-500 text-xs animate-fade-in-up">
          <p><span className="font-medium text-slate-600">Voice & Tone</span> &ndash; Coaching-oriented, measured language aligned with Chime values</p>
          <p><span className="font-medium text-slate-600">Accuracy</span> &ndash; Correct references to Chime values, frameworks, and cited sources</p>
          <p><span className="font-medium text-slate-600">Inclusivity</span> &ndash; Growth-oriented, identity-respectful language</p>
          <p><span className="font-medium text-slate-600">Style</span> &ndash; Formatting, terminology, and internal-vs-external distinctions</p>
        </div>
      </details>
    </header>
  );
}
