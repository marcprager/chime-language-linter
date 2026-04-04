import { LintRule, LintIssue } from '../types';

interface LabelPattern {
  regex: RegExp;
  replacement: string;
  suggestion: string;
}

const POSITIVE_LABELS: LabelPattern[] = [
  {
    regex: /\brockstars?\b/gi,
    replacement: 'team members who consistently deliver',
    suggestion: "Consider replacing '{matched}' with 'team members who consistently deliver' or 'high-impact contributors'",
  },
  {
    regex: /\bstars\b/gi,
    replacement: 'team members who consistently deliver',
    suggestion: "Consider replacing '{matched}' with 'team members who consistently deliver'",
  },
  {
    regex: /\btop\s+performers?\b/gi,
    replacement: 'strong contributors',
    suggestion: "Consider replacing '{matched}' with 'team members who consistently deliver' or 'strong contributors'",
  },
  {
    regex: /\bdrivers\b/gi,
    replacement: 'key contributors',
    suggestion: "Consider replacing '{matched}' with 'key contributors' or 'team members who drive results' (ignore if not referring to people)",
  },
  {
    regex: /\bpro\b/gi,
    replacement: 'experienced team member',
    suggestion: "Consider replacing '{matched}' with 'experienced team member' or 'skilled contributor' (ignore if not a people label)",
  },
];

const NEGATIVE_LABELS: LabelPattern[] = [
  {
    regex: /\blow\s+performers?\b/gi,
    replacement: 'team members with room to grow',
    suggestion: "Consider using opportunity-framed language like 'team members with room to grow' instead of '{matched}'",
  },
  {
    regex: /\bunderperformers?\b/gi,
    replacement: 'team members with development opportunities',
    suggestion: "Consider using opportunity-framed language like 'team members with development opportunities' instead of '{matched}'",
  },
  {
    regex: /\bunder\s+performers?\b/gi,
    replacement: 'team members with development opportunities',
    suggestion: "Consider using opportunity-framed language like 'team members with development opportunities' instead of '{matched}'",
  },
  {
    regex: /\bbottom\s+(?:performers?|(?:\d+\s*)?%|percent|tier|quartile|\d{1,2})\b/gi,
    replacement: 'team members with growth opportunities',
    suggestion: "Consider using opportunity-framed language instead of '{matched}'. For example, 'team members with growth opportunities'",
  },
];

const ALL_PATTERNS = [...POSITIVE_LABELS, ...NEGATIVE_LABELS];

export const identityLabelsRule: LintRule = {
  name: 'identity-labels',
  severity: 'warning',
  description: 'Avoid labeling people with fixed identity terms; use behavior-based language instead',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of ALL_PATTERNS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'identity-labels',
            severity: 'warning',
            message: suggestion.replace('{matched}', match[0]),
            suggestion: suggestion.replace('{matched}', match[0]),
            autoFixable: true,
          });
        }
      }
    }

    return issues;
  },
  fix(text) {
    let result = text;
    for (const { regex, replacement } of ALL_PATTERNS) {
      result = result.replace(regex, replacement);
    }
    return result;
  },
};
