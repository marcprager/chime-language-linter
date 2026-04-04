import { LintRule, LintIssue } from '../types';

const NICENESS_PHRASES: Array<{ regex: RegExp; suggestion: string }> = [
  {
    regex: /\bculture\s+of\s+niceness\b/gi,
    suggestion: "'Culture of niceness' can read as reductive. Consider 'high-care culture', 'harmony-first norms', or 'warmth-forward culture'.",
  },
  {
    regex: /\btoo\s+nice\b/gi,
    suggestion: "'Too nice' can be dismissive. Consider 'warmth-forward', 'conflict-averse', or 'high-care'.",
  },
  {
    regex: /\bniceness\s+is\s+the\s+problem\b/gi,
    suggestion: "This framing can feel judgmental. Consider describing the specific dynamic, e.g. 'avoiding hard conversations' or 'prioritizing comfort over clarity'.",
  },
];

export const nicenessFramingRule: LintRule = {
  name: 'niceness-framing',
  severity: 'warning',
  description: "Framing kindness or warmth as 'the problem' can feel dismissive; describe the specific dynamic instead",
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of NICENESS_PHRASES) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'niceness-framing',
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
