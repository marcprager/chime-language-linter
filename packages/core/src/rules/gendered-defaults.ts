import { LintRule, LintIssue } from '../types';

const GENDERED_TERMS: Array<{ regex: RegExp; suggestion: string }> = [
  {
    regex: /\bguys\b/gi,
    suggestion: "Consider replacing 'guys' with 'team', 'folks', 'everyone', or 'y'all'.",
  },
  {
    regex: /\bmanpower\b/gi,
    suggestion: "Consider replacing 'manpower' with 'staffing', 'workforce', or 'personnel'.",
  },
  {
    regex: /\bchairman\b/gi,
    suggestion: "Consider replacing 'chairman' with 'chair' or 'chairperson'.",
  },
  {
    regex: /\bmankind\b/gi,
    suggestion: "Consider replacing 'mankind' with 'humankind', 'humanity', or 'people'.",
  },
  {
    regex: /\bhis\s*\/\s*her\b/gi,
    suggestion: "Consider replacing 'his/her' with 'their' for gender-inclusive language.",
  },
  {
    regex: /\bman[\s-]?made\b/gi,
    suggestion: "Consider replacing 'manmade' with 'synthetic', 'artificial', or 'manufactured'.",
  },
];

export const genderedDefaultsRule: LintRule = {
  name: 'gendered-defaults',
  severity: 'warning',
  description: 'Use gender-neutral language for inclusive communication',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of GENDERED_TERMS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'gendered-defaults',
            severity: 'warning',
            message: suggestion,
            suggestion,
            autoFixable: false,
          });
        }
      }
    }

    return issues;
  },
};
