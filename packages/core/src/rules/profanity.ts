import { LintRule, LintIssue } from '../types';

const PROFANE_WORDS = [
  'damn',
  'dammit',
  'hell',
  'shit',
  'bullshit',
  'ass',
  'asshole',
  'bastard',
  'bitch',
  'crap',
  'fuck',
  'fucking',
  'piss',
  'dick',
];

export const profanityRule: LintRule = {
  name: 'profanity',
  severity: 'error',
  description: 'Profanity should not appear in professional content',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const word of PROFANE_WORDS) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'profanity',
            severity: 'error',
            message: `Consider removing or replacing "${match[0]}" with more professional language`,
            suggestion: 'Use professional language appropriate for all audiences',
            autoFixable: false,
          });
        }
      }
    }

    return issues;
  },
};
