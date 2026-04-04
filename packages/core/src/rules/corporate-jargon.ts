import { LintRule, LintIssue } from '../types';

const JARGON_TERMS: Array<{ regex: RegExp; suggestion: string }> = [
  {
    regex: /\bsynergy\b/gi,
    suggestion: "Consider replacing 'synergy' with 'collaboration' or 'combined effort'.",
  },
  {
    regex: /\bleverage\b/gi,
    suggestion: "Consider replacing 'leverage' with 'use', 'build on', or 'take advantage of'. (Ignore if referring to financial leverage.)",
  },
  {
    regex: /\bparadigm\s+shift\b/gi,
    suggestion: "Consider replacing 'paradigm shift' with 'fundamental change' or 'new approach'.",
  },
  {
    regex: /\bcircle\s+back\b/gi,
    suggestion: "Consider replacing 'circle back' with 'follow up', 'revisit', or 'return to this'.",
  },
  {
    regex: /\bmove\s+the\s+needle\b/gi,
    suggestion: "Consider replacing 'move the needle' with 'make progress', 'drive improvement', or 'create measurable change'.",
  },
  {
    regex: /\bbandwidth\b/gi,
    suggestion: "Consider replacing 'bandwidth' with 'capacity', 'time', or 'availability'. (Ignore if referring to technical bandwidth.)",
  },
  {
    regex: /\bdeep\s+dive\b/gi,
    suggestion: "Consider replacing 'deep dive' with 'thorough analysis', 'close look', or 'detailed review'.",
  },
  {
    regex: /\blow[\s-]hanging\s+fruit\b/gi,
    suggestion: "Consider replacing 'low-hanging fruit' with 'quick wins', 'easy improvements', or 'straightforward changes'.",
  },
  {
    regex: /\bboil\s+the\s+ocean\b/gi,
    suggestion: "Consider replacing 'boil the ocean' with 'overscope', 'take on too much', or 'try to solve everything at once'.",
  },
  {
    regex: /\bnet[\s-]net\b/gi,
    suggestion: "Consider replacing 'net-net' with 'bottom line', 'in summary', or 'the key takeaway'.",
  },
  {
    regex: /\btake\s+(?:it\s+)?offline\b/gi,
    suggestion: "Consider replacing 'take offline' with 'discuss separately', 'follow up one-on-one', or 'continue outside this meeting'.",
  },
];

export const corporateJargonRule: LintRule = {
  name: 'corporate-jargon',
  severity: 'info',
  description: 'Avoid overused corporate buzzwords; use plain, clear language',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of JARGON_TERMS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'corporate-jargon',
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
