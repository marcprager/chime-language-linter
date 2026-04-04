import { LintRule, LintIssue } from '../types';

const FILLER_PHRASES: Array<{
  regex: RegExp;
  suggestion: string;
  autoFixable: boolean;
}> = [
  {
    regex: /\bin\s+order\s+to\b/gi,
    suggestion: "Simplify 'in order to' to 'to'.",
    autoFixable: true,
  },
  {
    regex: /\bat\s+the\s+end\s+of\s+the\s+day\b/gi,
    suggestion: "Remove 'at the end of the day' or replace with 'ultimately' or 'in practice'.",
    autoFixable: false,
  },
  {
    regex: /\bit\s+goes\s+without\s+saying\b/gi,
    suggestion: "If it goes without saying, consider removing this phrase entirely.",
    autoFixable: false,
  },
  {
    regex: /\bneedless\s+to\s+say\b/gi,
    suggestion: "If needless to say, consider removing this phrase entirely.",
    autoFixable: false,
  },
  {
    regex: /\bas\s+a\s+matter\s+of\s+fact\b/gi,
    suggestion: "Remove 'as a matter of fact' or replace with 'in fact' or just state the fact.",
    autoFixable: false,
  },
  {
    regex: /\bin\s+terms\s+of\b/gi,
    suggestion: "Remove 'in terms of' or rephrase with 'regarding', 'for', or restructure the sentence.",
    autoFixable: false,
  },
  {
    regex: /\bwith\s+regard\s+to\b/gi,
    suggestion: "Simplify 'with regard to' to 'about', 'regarding', or 'on'.",
    autoFixable: false,
  },
];

export const fillerPhrasesRule: LintRule = {
  name: 'filler-phrases',
  severity: 'info',
  description: 'Remove filler phrases that add no meaning; keep writing concise',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion, autoFixable } of FILLER_PHRASES) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'filler-phrases',
            severity: 'info',
            message: suggestion,
            suggestion,
            autoFixable,
          });
        }
      }
    }

    return issues;
  },
  fix(text) {
    return text.replace(/\bin\s+order\s+to\b/gi, (match) => {
      if (match[0] === match[0].toUpperCase()) return 'To';
      return 'to';
    });
  },
};
