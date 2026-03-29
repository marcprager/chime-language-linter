import { LintRule, LintIssue } from '../types';

export const levelLabelsRule: LintRule = {
  name: 'level-labels',
  severity: 'info',
  description: 'Internal level labels (L2, M3, etc.) may not be meaningful to all audiences',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    // Match patterns like L2, L3, L4, L5, M3, M4, M5, optionally followed by IC or space+IC
    const regex = /\b([LM][2-9])\s*(?:IC)?\b/g;

    for (let i = 0; i < lines.length; i++) {
      regex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(lines[i])) !== null) {
        issues.push({
          file,
          line: i + 1,
          column: match.index + 1,
          matched: match[0].trim(),
          context: lines[i],
          rule: 'level-labels',
          severity: 'info',
          message: `"${match[0].trim()}" is an internal level label. Consider whether your audience will understand this shorthand, and add context if needed.`,
          suggestion: 'Consider adding context or using a descriptive role title alongside the level label',
          autoFixable: false,
        });
      }
    }

    return issues;
  },
};
