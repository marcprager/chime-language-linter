import { LintRule, LintIssue } from '../types';

export const struggleRule: LintRule = {
  name: 'struggle',
  severity: 'error',
  description: 'The word "struggle" can carry negative connotations; consider alternatives',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');
    const regex = /\bstruggles?\b|\bstruggled\b|\bstruggling\b/gi;

    for (let i = 0; i < lines.length; i++) {
      let match: RegExpExecArray | null;
      regex.lastIndex = 0;
      while ((match = regex.exec(lines[i])) !== null) {
        issues.push({
          file,
          line: i + 1,
          column: match.index + 1,
          matched: match[0],
          context: lines[i],
          rule: 'struggle',
          severity: 'error',
          message: 'Consider replacing "struggle" with a more empowering term like "challenge", "stretch", or "difficulty"',
          suggestion: 'Replace with "challenge", "stretch", or "difficulty"',
          autoFixable: true,
        });
      }
    }
    return issues;
  },
  fix(text) {
    return text.replace(/\bstruggles?\b|\bstruggled\b|\bstruggling\b/gi, (match) => {
      const upper = match[0] === match[0].toUpperCase();
      const lower = match.toLowerCase();
      if (lower === 'struggling') return upper ? 'Facing challenges' : 'facing challenges';
      if (lower === 'struggled') return upper ? 'Faced challenges' : 'faced challenges';
      if (lower === 'struggles') return upper ? 'Challenges' : 'challenges';
      return upper ? 'Challenge' : 'challenge';
    });
  },
};
