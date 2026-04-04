import { LintRule, LintIssue } from '../types';

const CLINICAL_TERMS: Array<{ regex: RegExp; term: string; replacement: string; alternative: string }> = [
  {
    regex: /\bego\b/gi,
    term: 'ego',
    replacement: 'mindset',
    alternative: 'self-confidence, self-perception, or mindset',
  },
  {
    regex: /\bcatastrophizing\b/gi,
    term: 'catastrophizing',
    replacement: 'assuming the worst',
    alternative: 'overthinking, assuming the worst, or focusing on worst-case scenarios',
  },
  {
    regex: /\bspiral\b/gi,
    term: 'spiral',
    replacement: 'cycle',
    alternative: 'cycle, pattern, or downward trend',
  },
  {
    regex: /\bpanic\b/gi,
    term: 'panic',
    replacement: 'concern',
    alternative: 'concern, urgency, or stress',
  },
  {
    regex: /\bshrink\b/gi,
    term: 'shrink',
    replacement: 'counselor',
    alternative: 'therapist, counselor, or mental health professional',
  },
  {
    regex: /\btriggered\b/gi,
    term: 'triggered',
    replacement: 'prompted',
    alternative: 'activated, prompted, or affected',
  },
];

export const clinicalTermsRule: LintRule = {
  name: 'clinical-terms',
  severity: 'warning',
  description: 'Clinical or psychological terms may not land well outside clinical contexts; consider plain-English alternatives',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, alternative } of CLINICAL_TERMS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'clinical-terms',
            severity: 'warning',
            message: `"${match[0]}" is a clinical term that may not resonate in all contexts. Consider using ${alternative} instead. (This may be appropriate if used in a clinical or medical context.)`,
            suggestion: `Consider replacing with: ${alternative}`,
            autoFixable: true,
          });
        }
      }
    }

    return issues;
  },
  fix(text) {
    let result = text;
    for (const { regex, replacement } of CLINICAL_TERMS) {
      result = result.replace(regex, replacement);
    }
    return result;
  },
};
