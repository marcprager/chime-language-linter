import { LintRule, LintIssue } from '../types';

export const hardModeRule: LintRule = {
  name: 'hard-mode',
  severity: 'warning',
  description: '"Hard Mode" can feel exclusionary; consider using "Advanced" instead',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');
    const regex = /\bhard\s+mode\b/gi;

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
          rule: 'hard-mode',
          severity: 'warning',
          message: 'Consider replacing "Hard Mode" with "Advanced" for a more inclusive framing',
          suggestion: 'Replace with "Advanced"',
          autoFixable: true,
        });
      }
    }

    return issues;
  },
  fix(text) {
    return text.replace(/\bhard\s+mode\b/gi, (match) => {
      // Preserve capitalization pattern
      if (match[0] === match[0].toUpperCase()) {
        return 'Advanced';
      }
      return 'advanced';
    });
  },
};
