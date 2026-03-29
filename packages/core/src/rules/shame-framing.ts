import { LintRule, LintIssue } from '../types';

const SHAME_PATTERNS: Array<{ regex: RegExp; term: string; suggestion: string }> = [
  {
    regex: /\blowest\s+score\b/gi,
    term: 'lowest score',
    suggestion: "Consider reframing 'lowest score' with opportunity language, such as 'area with the most room for growth'",
  },
  {
    regex: /\bworst\s+performing\b/gi,
    term: 'worst performing',
    suggestion: "Consider reframing 'worst performing' with opportunity language, such as 'area with the most opportunity for improvement'",
  },
  {
    regex: /\bweakest\b/gi,
    term: 'weakest',
    suggestion: "Consider reframing 'weakest' with opportunity language, such as 'greatest area for development'",
  },
  {
    regex: /\bfailed\s+(?:to|the|at|in)\b/gi,
    term: 'failed',
    suggestion: "Consider reframing with growth language, such as 'has an opportunity to improve' or 'did not yet meet expectations'",
  },
];

export const shameFramingRule: LintRule = {
  name: 'shame-framing',
  severity: 'warning',
  description: 'Avoid shame-based framing; use opportunity-oriented language instead',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, term, suggestion } of SHAME_PATTERNS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'shame-framing',
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
