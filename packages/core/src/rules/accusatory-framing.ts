import { LintRule, LintIssue } from '../types';

/**
 * Flags language that can read as blame-oriented or accusatory toward
 * leadership, teams, or the organization. Chime's coaching tone is
 * growth-oriented: name the gap, not the fault.
 */

const ACCUSATORY_PATTERNS: Array<{ regex: RegExp; term: string; suggestion: string }> = [
  {
    regex: /\bstarts at the top\b/gi,
    term: 'starts at the top',
    suggestion: 'Consider "leader consistency sets the tone" or "leadership signals shape downstream behavior" \u2013 "starts at the top" can land as accusatory',
  },
  {
    regex: /\bleadership failure\b/gi,
    term: 'leadership failure',
    suggestion: 'Consider "leadership gap" or "opportunity for leaders to model" \u2013 "failure" is blame-oriented',
  },
  {
    regex: /\bculture of niceness\b/gi,
    term: 'culture of niceness',
    suggestion: 'Consider "high-care culture" or "harmony-forward norms" \u2013 "culture of niceness" can feel dismissive of a genuine strength',
  },
  {
    regex: /\btoo nice\b/gi,
    term: 'too nice',
    suggestion: 'Consider "defaults to harmony" or "care-forward, sometimes at the expense of candor" \u2013 "too nice" can feel reductive',
  },
  {
    regex: /\bthrows?\s+(?:\w+\s+){0,2}at\s+(?:them|managers?|employees?|people|chimers?|teams?)\b/gi,
    term: 'throws ... at',
    suggestion: 'Consider "places significant responsibility on" \u2013 "throws at" implies negligence',
  },
  {
    regex: /\bdon'?t\s+care\b/gi,
    term: "don't care",
    suggestion: 'Consider "haven\u2019t prioritized" or "may not be aware" \u2013 "don\u2019t care" assumes intent',
  },
  {
    regex: /\bcomplete(?:ly)?\s+(?:broken|absent|missing|lacking)\b/gi,
    term: 'completely broken/absent',
    suggestion: 'Consider "not yet in place" or "inconsistent" \u2013 absolutes about absence can feel like an indictment',
  },
  {
    regex: /\bvalues?\s+(?:have\s+)?eroded\b/gi,
    term: 'values eroded',
    suggestion: 'Consider "values show up less consistently" or "values are reinforced less frequently in operating rhythms"',
  },
  {
    regex: /\bmore\s+mercenary\b/gi,
    term: 'more mercenary',
    suggestion: 'Consider "more results-focused" or "more transactional" \u2013 "mercenary" carries strong negative judgment',
  },
  {
    regex: /\bshouting\s+into\s+the\s+void\b/gi,
    term: 'shouting into the void',
    suggestion: 'Vivid metaphor \u2013 consider limiting to one use and switching to "low-confidence loop" or "no visible follow-through" on repeat',
  },
];

export const accusatoryFramingRule: LintRule = {
  name: 'accusatory-framing',
  severity: 'warning',
  description: 'Avoid blame-oriented or accusatory framing; use growth-oriented language that names the gap, not the fault',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of ACCUSATORY_PATTERNS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'accusatory-framing',
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
