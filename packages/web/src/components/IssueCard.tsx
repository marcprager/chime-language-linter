import { useState } from 'react';
import { LintIssue } from '@chime-linter/core';

const SEVERITY_STYLES = {
  error: {
    label: 'Needs attention',
    border: 'border-l-red-400',
    badge: 'bg-red-500',
    text: 'text-red-700',
    hoverBg: 'hover:bg-red-50/50',
  },
  warning: {
    label: 'Consider changing',
    border: 'border-l-amber-400',
    badge: 'bg-amber-500',
    text: 'text-amber-700',
    hoverBg: 'hover:bg-amber-50/50',
  },
  info: {
    label: 'Style suggestion',
    border: 'border-l-blue-400',
    badge: 'bg-blue-500',
    text: 'text-blue-700',
    hoverBg: 'hover:bg-blue-50/50',
  },
} as const;

interface IssueCardProps {
  issue: LintIssue;
  onIssueClick: (issue: LintIssue) => void;
  onFix: (issue: LintIssue) => void;
}

export default function IssueCard({ issue, onIssueClick, onFix }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [justFixed, setJustFixed] = useState(false);
  const style = SEVERITY_STYLES[issue.severity];

  const handleFix = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJustFixed(true);
    onFix(issue);
  };

  const handleLocate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIssueClick(issue);
  };

  if (justFixed) {
    return (
      <div className="fix-flash rounded-xl border border-slate-100 p-3 flex items-center gap-2 text-sm text-chime-600 font-medium animate-fade-in-up">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Fixed!
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`group w-full text-left rounded-xl border border-slate-200 border-l-4 ${style.border} bg-white shadow-card ${style.hoverBg} transition-all duration-200 cursor-pointer animate-fade-in-up focus:outline-none focus:ring-2 focus:ring-chime-500/30 focus:ring-offset-1`}
      onClick={() => setExpanded(!expanded)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setExpanded(!expanded);
        }
      }}
    >
      {/* Collapsed: always visible */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold text-white ${style.badge}`}>
              {style.label}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{issue.rule}</span>
          </div>
          <p className={`text-sm font-medium ${style.text} leading-snug`}>
            {issue.message}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {issue.autoFixable && (
            <button
              onClick={handleFix}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-chime-50 text-chime-700 hover:bg-chime-100 active:bg-chime-200 transition-colors"
              aria-label={`Fix: ${issue.rule}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Fix
            </button>
          )}
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded detail */}
      <div className={`issue-detail ${expanded ? 'expanded' : ''}`}>
        <div>
          <div className="px-4 pb-4 pt-0 space-y-2.5 border-t border-slate-100">
            <div className="pt-3">
              {/* Matched text */}
              <div className="flex items-baseline gap-2 text-xs">
                <span className="text-slate-400 font-medium">Found:</span>
                <button
                  onClick={handleLocate}
                  className="px-1.5 py-0.5 bg-slate-50 rounded font-mono text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Click to highlight in editor"
                >
                  &ldquo;{issue.matched}&rdquo;
                </button>
                <span className="text-slate-300 font-mono">
                  Ln {issue.line}, Col {issue.column}
                </span>
              </div>
            </div>

            {/* Suggestion */}
            {issue.suggestion && (
              <div className="flex items-baseline gap-2 text-xs">
                <span className="text-slate-400 font-medium">Try:</span>
                <span className="text-slate-600">{issue.suggestion}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
