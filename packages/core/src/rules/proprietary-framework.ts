import { LintRule, LintIssue } from '../types';

const PATTERNS: Array<{ regex: RegExp; framework: string }> = [
  { regex: /\bChime'?s\s+SBI\b/gi, framework: 'SBI' },
  { regex: /\bour\s+SBI\s+framework\b/gi, framework: 'SBI' },
  { regex: /\bChime'?s\s+SARA\b/gi, framework: 'SARA' },
  { regex: /\bour\s+SARA\s+(?:model|framework)\b/gi, framework: 'SARA' },
  { regex: /\bour\s+SARA\b/gi, framework: 'SARA' },
  { regex: /\bChime'?s\s+SARA\s+model\b/gi, framework: 'SARA' },
];

export const proprietaryFrameworkRule: LintRule = {
  name: 'proprietary-framework',
  severity: 'error',
  description: 'SBI and SARA are industry-standard frameworks, not proprietary to Chime',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, framework } of PATTERNS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'proprietary-framework',
            severity: 'error',
            message: `${framework} is an industry-standard framework, not proprietary to Chime. Consider saying "the ${framework} framework" instead of implying ownership.`,
            suggestion: `Use "the ${framework} framework" or "the ${framework} model" without possessive language`,
            autoFixable: false,
          });
        }
      }
    }

    return issues;
  },
};
