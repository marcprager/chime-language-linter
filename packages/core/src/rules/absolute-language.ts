import { LintRule, LintIssue } from '../types';

const ABSOLUTE_TERMS: Array<{ regex: RegExp; suggestion: string }> = [
  {
    regex: /\balways\b/gi,
    suggestion: "Consider qualifying 'always' \u2013 try 'often', 'consistently', or 'in most cases'.",
  },
  {
    regex: /\bnever\b/gi,
    suggestion: "Consider qualifying 'never' \u2013 try 'rarely', 'seldom', or 'in few cases'.",
  },
  {
    regex: /\bevery\s+single\b/gi,
    suggestion: "Consider qualifying 'every single' \u2013 try 'nearly every' or 'the vast majority'.",
  },
  {
    regex: /\bthe\s+single\s+most\b/gi,
    suggestion: "Consider qualifying 'the single most' \u2013 try 'one of the most' or 'among the most significant'.",
  },
  {
    regex: /\bacross\s+every\b/gi,
    suggestion: "Consider qualifying 'across every' \u2013 try 'across most' or 'across nearly all'.",
  },
  {
    regex: /\bzero\b/gi,
    suggestion: "If not a literal quantity, consider replacing 'zero' with 'minimal', 'negligible', or 'very few'.",
  },
];

export const absoluteLanguageRule: LintRule = {
  name: 'absolute-language',
  severity: 'info',
  description: 'Unqualified absolutes can weaken credibility; consider qualifying claims',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of ABSOLUTE_TERMS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'absolute-language',
            severity: 'info',
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
