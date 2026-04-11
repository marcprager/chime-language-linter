import { LintRule, LintIssue } from '../types';

/**
 * Flags undefined acronyms and insider jargon that may confuse employees.
 * Only flags on first occurrence per document.
 */

interface JargonPattern {
  regex: RegExp;
  term: string;
  suggestion: string;
}

const JARGON_PATTERNS: JargonPattern[] = [
  {
    regex: /\bLT\b/g,
    term: 'LT',
    suggestion: 'Consider spelling out "Leadership Team" on first use, or clarify for audiences outside this group.',
  },
  {
    regex: /\bICs?\b/g,
    term: 'IC',
    suggestion: 'Consider spelling out "individual contributor(s)" on first use for clarity.',
  },
  {
    regex: /\bOMX\b/g,
    term: 'OMX',
    suggestion: 'Consider defining "OMX" on first use so all readers understand the acronym.',
  },
  {
    regex: /\bLX\b/g,
    term: 'LX',
    suggestion: 'Consider defining "LX" (Learning Experience) on first use.',
  },
  {
    regex: /\bPBP\b/g,
    term: 'PBP',
    suggestion: 'Consider spelling out "People Business Partner" on first use.',
  },
  {
    regex: /\bHRBP\b/g,
    term: 'HRBP',
    suggestion: 'Consider spelling out "HR Business Partner" on first use.',
  },
  {
    regex: /\bOKRs?\b/g,
    term: 'OKR',
    suggestion: 'Consider spelling out "Objectives and Key Results" on first use.',
  },
  {
    regex: /\bKPIs?\b/g,
    term: 'KPI',
    suggestion: 'Consider spelling out "Key Performance Indicator(s)" on first use.',
  },
  {
    regex: /\bELT\b/g,
    term: 'ELT',
    suggestion: 'Consider spelling out "Executive Leadership Team" on first use.',
  },
  {
    regex: /\bENPS\b/gi,
    term: 'eNPS',
    suggestion: 'Consider spelling out "Employee Net Promoter Score" on first use.',
  },
  {
    regex: /\bDEI\b/g,
    term: 'DEI',
    suggestion: 'Consider spelling out "Diversity, Equity, and Inclusion" on first use.',
  },
  {
    regex: /\bERG\b/g,
    term: 'ERG',
    suggestion: 'Consider spelling out "Employee Resource Group" on first use.',
  },
  {
    regex: /\bPIP\b/g,
    term: 'PIP',
    suggestion: 'Consider spelling out "Performance Improvement Plan" on first use, or use employee-friendly framing.',
  },
  {
    regex: /\bSBI\b/g,
    term: 'SBI',
    suggestion: 'Consider spelling out "Situation-Behavior-Impact" on first use.',
  },
  {
    regex: /\bSARA\b/g,
    term: 'SARA',
    suggestion: 'Consider spelling out "Surprise-Anger-Rationalization-Acceptance" on first use.',
  },
  {
    regex: /\bcadence\b/gi,
    term: 'cadence',
    suggestion: 'Consider using "regular schedule" or "recurring rhythm" instead of "cadence" for broader readability.',
  },
  {
    regex: /\bsync\b/gi,
    term: 'sync',
    suggestion: 'Consider using "meeting" or "check-in" instead of "sync" for broader readability.',
  },
  {
    regex: /\bbandwidth\b/gi,
    term: 'bandwidth',
    suggestion: 'Consider using "capacity" or "availability" instead of "bandwidth" when referring to people.',
  },
  {
    regex: /\blever(?:age)?\b/gi,
    term: 'leverage',
    suggestion: 'Consider using "use," "apply," or "build on" instead of "leverage."',
  },
  {
    regex: /\bsocialize\b/gi,
    term: 'socialize',
    suggestion: 'Consider using "share," "discuss," or "circulate" instead of "socialize" (when referring to ideas).',
  },
  {
    regex: /\bnet[\s-]?net\b/gi,
    term: 'net-net',
    suggestion: 'Consider using "bottom line," "in short," or "the key takeaway" instead of "net-net."',
  },
];

export const jargonRule: LintRule = {
  name: 'jargon',
  severity: 'info',
  description: 'Flags undefined acronyms and insider jargon that may confuse some employees',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');
    const seen = new Set<string>();

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, term, suggestion } of JARGON_PATTERNS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          // Only flag the first occurrence of each term
          if (seen.has(term)) continue;
          seen.add(term);

          // Skip acronyms that are preceded by their expansion in parentheses, e.g. "Situation-Behavior-Impact (SBI)"
          const beforeMatch = lines[i].substring(0, match.index);
          if (/\([^)]*$/.test(beforeMatch) || /\w[^(]*\(\s*$/.test(beforeMatch)) continue;

          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'jargon',
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
