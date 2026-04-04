import { LintRule, LintIssue } from '../types';

const SANDWICH_PHRASES: Array<{ regex: RegExp }> = [
  { regex: /\bfeedback\s+sandwich\b/gi },
  { regex: /\bsandwich\s+method\b/gi },
  { regex: /\bsandwich\s+approach\b/gi },
];

const SUGGESTION = 'The feedback sandwich dilutes the message. Lead with specific, direct feedback.';

export const feedbackSandwichRule: LintRule = {
  name: 'feedback-sandwich',
  severity: 'warning',
  description: 'The feedback sandwich pattern dilutes constructive feedback; use direct, specific delivery instead',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex } of SANDWICH_PHRASES) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'feedback-sandwich',
            severity: 'warning',
            message: SUGGESTION,
            suggestion: SUGGESTION,
            autoFixable: false,
          });
        }
      }
    }

    return issues;
  },
};
