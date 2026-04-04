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
            <span className="text-chime-600">Chime</span> Language Linter
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Helping you write with clarity and care
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
    </header>
  );
}
