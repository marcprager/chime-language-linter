import { LintRule, LintIssue } from '../types';

/**
 * Flags double hyphens (--) that should be en dashes (–).
 * Common in drafted content and GPT outputs.
 */
export const doubleDashRule: LintRule = {
  name: 'double-dash',
  severity: 'error',
  description: 'Double hyphens should be en dashes',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');
    // Match -- that is NOT inside a code-like context (not preceded/followed by another -)
    const regex = /(?<!-)--(?!-)/g;

    for (let i = 0; i < lines.length; i++) {
      regex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(lines[i])) !== null) {
        issues.push({
          file,
          line: i + 1,
          column: match.index + 1,
          matched: match[0],
          context: lines[i],
          rule: 'double-dash',
          severity: 'error',
          message: 'Use an en dash (\u2013) instead of a double hyphen (--).',
          suggestion: 'Replace -- with \u2013',
          autoFixable: true,
        });
      }
    }
    return issues;
  },
  fix(text) {
    return text.replace(/(?<!-)--(?!-)/g, '\u2013');
  },
};
