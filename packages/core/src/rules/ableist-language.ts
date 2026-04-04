import { LintRule, LintIssue } from '../types';

const ABLEIST_TERMS: Array<{ regex: RegExp; suggestion: string }> = [
  {
    regex: /\bblind\s+spot\b/gi,
    suggestion: "Consider replacing 'blind spot' with 'gap', 'oversight', or 'unexamined area'.",
  },
  {
    regex: /\btone[\s-]?deaf\b/gi,
    suggestion: "Consider replacing 'tone deaf' with 'out of touch', 'insensitive', or 'unaware'.",
  },
  {
    regex: /\bfalling\s+on\s+deaf\s+ears\b/gi,
    suggestion: "Consider replacing 'falling on deaf ears' with 'being ignored' or 'not getting traction'.",
  },
  {
    regex: /\blame\b/gi,
    suggestion: "Consider replacing 'lame' with 'weak', 'unconvincing', or 'ineffective'.",
  },
  {
    regex: /\bcrazy\b/gi,
    suggestion: "Consider replacing 'crazy' with 'surprising', 'intense', 'remarkable', or 'chaotic'.",
  },
  {
    regex: /\binsane\b/gi,
    suggestion: "Consider replacing 'insane' with 'extreme', 'remarkable', or 'extraordinary'.",
  },
  {
    regex: /\bcrippling\b/gi,
    suggestion: "Consider replacing 'crippling' with 'debilitating', 'severe', or 'significant'.",
  },
];

export const ableistLanguageRule: LintRule = {
  name: 'ableist-language',
  severity: 'warning',
  description: 'Avoid ableist metaphors; use plain-English alternatives',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of ABLEIST_TERMS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'ableist-language',
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
