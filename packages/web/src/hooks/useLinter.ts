import { useState, useEffect, useCallback, useRef } from 'react';
import { lintText, fixText, LintIssue, LintResult, Severity } from '@chime-linter/core';
import { useDebounce } from './useDebounce';
import { trackEvent } from '../lib/analytics';

function findMatchIndex(text: string, line: number, column: number, matched: string): number {
  const lines = text.split('\n');
  let index = 0;
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    index += lines[i].length + 1;
  }
  index += column - 1;
  if (text.substring(index, index + matched.length) === matched) {
    return index;
  }
  const searchStart = Math.max(0, index - 10);
  const searchEnd = Math.min(text.length, index + matched.length + 10);
  const nearbyIndex = text.indexOf(matched, searchStart);
  if (nearbyIndex !== -1 && nearbyIndex <= searchEnd) {
    return nearbyIndex;
  }
  return index;
}

// Known auto-fix replacements for per-issue fixes
const SINGLE_FIX_MAP: Record<string, (matched: string) => string> = {
  'em-dash': () => '\u2013',
  struggle: () => 'challenge',
  'hard-mode': () => 'Advanced',
  // Identity labels
  'identity-labels': (m) => {
    const lower = m.toLowerCase();
    if (lower.match(/rockstars?/)) return 'team members who consistently deliver';
    if (lower.match(/top\s+performers?/)) return 'strong contributors';
    if (lower.match(/low\s+performers?/)) return 'team members with room to grow';
    if (lower.match(/underperformers?|under\s+performers?/)) return 'team members with development opportunities';
    if (lower.match(/stars/)) return 'team members who consistently deliver';
    if (lower.match(/drivers/)) return 'key contributors';
    if (lower.match(/pro/)) return 'experienced team member';
    if (lower.match(/bottom/)) return 'team members with growth opportunities';
    return m;
  },
  // Shame framing
  'shame-framing': (m) => {
    const lower = m.toLowerCase();
    if (lower.match(/lowest\s+score/)) return 'area with the most room for growth';
    if (lower.match(/worst\s+performing/)) return 'most opportunity for improvement';
    if (lower.match(/weakest/)) return 'greatest area for development';
    if (lower.match(/failed/)) return m.replace(/failed/i, 'has an opportunity to improve');
    return m;
  },
  // Loaded language
  'loaded-language': (m) => {
    const lower = m.toLowerCase();
    if (lower.match(/addictive/)) return 'compelling';
    if (lower.match(/addiction/)) return 'strong preference';
    if (lower.match(/secret\s+weapon/)) return 'key strength';
    if (lower.match(/game[\s-]changer/)) return 'significant improvement';
    if (lower.match(/revolutionary/)) return 'innovative';
    if (lower.match(/crushing\s+it/)) return 'excelling';
    if (lower.match(/killing\s+it/)) return 'excelling';
    return m;
  },
  // Clinical terms
  'clinical-terms': (m) => {
    const lower = m.toLowerCase();
    if (lower === 'ego') return 'mindset';
    if (lower === 'catastrophizing') return 'assuming the worst';
    if (lower === 'spiral') return 'cycle';
    if (lower === 'panic') return 'concern';
    if (lower === 'shrink') return 'counselor';
    if (lower === 'triggered') return 'prompted';
    return m;
  },
  // Proprietary framework
  'proprietary-framework': (m) => {
    if (m.match(/SBI/i)) return 'the SBI framework';
    if (m.match(/SARA/i)) return 'the SARA model';
    return m;
  },
};

export type SeverityFilter = 'all' | Severity;

export interface UseLinterReturn {
  text: string;
  setText: (text: string) => void;
  result: LintResult | null;
  filter: SeverityFilter;
  setFilter: (filter: SeverityFilter) => void;
  filteredIssues: LintIssue[];
  score: number;
  autoFixableCount: number;
  copyFeedback: boolean;
  isDebouncing: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleIssueClick: (issue: LintIssue) => void;
  handleFixSingle: (issue: LintIssue) => void;
  handleFixAll: () => void;
  handleCopyClean: () => Promise<void>;
  wordCount: number;
  charCount: number;
}

export function useLinter(): UseLinterReturn {
  const [text, setText] = useState('');
  const [result, setResult] = useState<LintResult | null>(null);
  const [filter, setFilter] = useState<SeverityFilter>('all');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const debouncedText = useDebounce(text, 300);

  // Track session on mount
  useEffect(() => {
    trackEvent('session');
  }, []);

  // Track debounce state
  useEffect(() => {
    if (text !== debouncedText && text.trim() !== '') {
      setIsDebouncing(true);
    }
  }, [text, debouncedText]);

  useEffect(() => {
    setIsDebouncing(false);
    if (debouncedText.trim() === '') {
      setResult(null);
      return;
    }
    const linted = lintText(debouncedText);
    setResult(linted);
    trackEvent('check');
  }, [debouncedText]);

  const filteredIssues = result
    ? filter === 'all'
      ? result.issues
      : result.issues.filter((i) => i.severity === filter)
    : [];

  const summary = result?.summary ?? { errors: 0, warnings: 0, info: 0 };
  const score = Math.max(0, Math.round(100 - (summary.errors * 6 + summary.warnings * 3 + summary.info * 1)));
  const autoFixableCount = result?.issues.filter((i) => i.autoFixable).length ?? 0;

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;

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

  const handleFixSingle = useCallback(
    (issue: LintIssue) => {
      if (!issue.autoFixable) return;
      const fixFn = SINGLE_FIX_MAP[issue.rule];
      if (!fixFn) return;

      const start = findMatchIndex(text, issue.line, issue.column, issue.matched);
      const end = start + issue.matched.length;
      const replacement = fixFn(issue.matched);
      const newText = text.substring(0, start) + replacement + text.substring(end);
      setText(newText);
      trackEvent('fix_single');
    },
    [text],
  );

  const handleFixAll = useCallback(() => {
    const cleaned = fixText(text);
    setText(cleaned);
    trackEvent('fix_all');
  }, [text]);

  const handleCopyClean = useCallback(async () => {
    const cleaned = fixText(text);
    try {
      await navigator.clipboard.writeText(cleaned);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = cleaned;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
    trackEvent('copy');
  }, [text]);

  return {
    text,
    setText,
    result,
    filter,
    setFilter,
    filteredIssues,
    score,
    autoFixableCount,
    copyFeedback,
    isDebouncing,
    textareaRef,
    handleIssueClick,
    handleFixSingle,
    handleFixAll,
    handleCopyClean,
    wordCount,
    charCount,
  };
}
