import { useState, useEffect, useCallback, useRef } from 'react';
import { lintText, fixText, LintIssue, LintResult } from '@chime-linter/core';

const SEVERITY_CONFIG = {
  error: {
    label: 'Needs attention',
    tech: 'error',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-500',
    text: 'text-red-700',
    dot: 'bg-red-500',
    countText: 'text-red-600',
  },
  warning: {
    label: 'Consider changing',
    tech: 'warning',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-500',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    countText: 'text-amber-600',
  },
  info: {
    label: 'Style suggestion',
    tech: 'info',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-500',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    countText: 'text-blue-600',
  },
} as const;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function findMatchIndex(text: string, line: number, column: number, matched: string): number {
  const lines = text.split('\n');
  let index = 0;
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    index += lines[i].length + 1; // +1 for newline
  }
  index += column - 1;
  // Verify the match is at the expected position
  if (text.substring(index, index + matched.length) === matched) {
    return index;
  }
  // Fallback: search nearby
  const searchStart = Math.max(0, index - 10);
  const searchEnd = Math.min(text.length, index + matched.length + 10);
  const nearbyIndex = text.indexOf(matched, searchStart);
  if (nearbyIndex !== -1 && nearbyIndex <= searchEnd) {
    return nearbyIndex;
  }
  return index;
}

export default function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<LintResult | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debouncedText = useDebounce(text, 300);

  useEffect(() => {
    if (debouncedText.trim() === '') {
      setResult(null);
      return;
    }
    const linted = lintText(debouncedText);
    setResult(linted);
  }, [debouncedText]);

  const handleIssueClick = useCallback(
    (issue: LintIssue) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = findMatchIndex(text, issue.line, issue.column, issue.matched);
      const end = start + issue.matched.length;
      ta.focus();
      ta.setSelectionRange(start, end);
    },
    [text],
  );

  const handleCopyClean = useCallback(async () => {
    const cleaned = fixText(text);
    try {
      await navigator.clipboard.writeText(cleaned);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = cleaned;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  }, [text]);

  const summary = result?.summary ?? { errors: 0, warnings: 0, info: 0 };
  const totalIssues = summary.errors + summary.warnings + summary.info;
  const hasText = text.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Chime Language Linter
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Helping you write with clarity and care
          </p>

          {/* Summary Bar */}
          {hasText && (
            <div className="mt-4 flex items-center gap-4 text-sm">
              {totalIssues === 0 ? (
                <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Looking good! No issues found.
                </span>
              ) : (
                <>
                  {summary.errors > 0 && (
                    <span
                      className={`inline-flex items-center gap-1.5 font-medium ${SEVERITY_CONFIG.error.countText}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${SEVERITY_CONFIG.error.dot} inline-block`}
                      />
                      {summary.errors} {summary.errors === 1 ? 'error' : 'errors'}
                    </span>
                  )}
                  {summary.warnings > 0 && (
                    <span
                      className={`inline-flex items-center gap-1.5 font-medium ${SEVERITY_CONFIG.warning.countText}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${SEVERITY_CONFIG.warning.dot} inline-block`}
                      />
                      {summary.warnings} {summary.warnings === 1 ? 'warning' : 'warnings'}
                    </span>
                  )}
                  {summary.info > 0 && (
                    <span
                      className={`inline-flex items-center gap-1.5 font-medium ${SEVERITY_CONFIG.info.countText}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${SEVERITY_CONFIG.info.dot} inline-block`}
                      />
                      {summary.info} {summary.info === 1 ? 'suggestion' : 'suggestions'}
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </header>

        {/* Textarea */}
        <div className="mb-4">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your content here to check for language issues..."
            className="w-full h-64 p-4 bg-white border border-slate-200 rounded-lg shadow-sm resize-y placeholder-slate-400 transition-shadow"
            spellCheck={false}
          />
        </div>

        {/* Copy Clean Text Button */}
        {hasText && (
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={handleCopyClean}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 active:bg-slate-900 transition-colors shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              {copyFeedback ? 'Copied!' : 'Copy Clean Text'}
            </button>
            {totalIssues > 0 && (
              <span className="text-xs text-slate-400">
                Applies all available auto-fixes and copies the result
              </span>
            )}
          </div>
        )}

        {/* Issues List */}
        {result && result.issues.length > 0 && (
          <div className="issues-list space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Issues Found
            </h2>
            {result.issues.map((issue, i) => {
              const config = SEVERITY_CONFIG[issue.severity];
              return (
                <button
                  key={`${issue.line}-${issue.column}-${issue.rule}-${i}`}
                  onClick={() => handleIssueClick(issue)}
                  className={`w-full text-left p-4 rounded-lg border ${config.bg} ${config.border} hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Badge row */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white ${config.badge}`}
                        >
                          {config.label}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {issue.rule}
                        </span>
                      </div>

                      {/* Message */}
                      <p className={`text-sm font-medium ${config.text} mb-1`}>
                        {issue.message}
                      </p>

                      {/* Matched text */}
                      <p className="text-xs text-slate-500">
                        Matched:{' '}
                        <code className="px-1 py-0.5 bg-white/70 rounded text-slate-700 font-mono">
                          {issue.matched}
                        </code>
                      </p>

                      {/* Suggestion */}
                      {issue.suggestion && (
                        <p className="mt-1.5 text-xs text-slate-600">
                          <span className="font-medium">Suggestion:</span>{' '}
                          {issue.suggestion}
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <span className="text-xs text-slate-400 font-mono whitespace-nowrap shrink-0">
                      Ln {issue.line}, Col {issue.column}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Empty state when no text */}
        {!hasText && (
          <div className="text-center py-16 text-slate-400">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <p className="text-sm">
              Start typing or paste your text above to get feedback
            </p>
          </div>
        )}

        {/* All clear state */}
        {hasText && result && result.issues.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-green-600 font-medium">
              Your text looks great! No issues found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
