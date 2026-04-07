import { LintRule, LintIssue } from '../types';

/**
 * Flags passive-voice constructions that weaken ownership and clarity.
 * Only flags patterns common in People/HR writing that obscure who is acting.
 */

const PASSIVE_PATTERNS: Array<{ regex: RegExp; suggestion: string }> = [
  {
    regex: /\b(?:is|are|was|were|been|be)\s+being\s+(?:given|provided|offered|shared|delivered|communicated|rolled\s+out)\b/gi,
    suggestion: 'Consider rewriting in active voice to clarify who is responsible for this action.',
  },
  {
    regex: /\bfeedback\s+(?:is|was|were)\s+(?:given|provided|received|shared|delivered|collected)\b/gi,
    suggestion: 'Consider making the actor explicit: who gave, shared, or collected the feedback?',
  },
  {
    regex: /\b(?:it\s+)?(?:was|is|has\s+been)\s+(?:decided|determined|agreed|noted|observed|recommended|suggested|proposed|identified|raised|flagged|escalated)\b/gi,
    suggestion: 'Who decided, recommended, or identified this? Consider naming the actor for accountability.',
  },
  {
    regex: /\b(?:should|could|will|can)\s+be\s+(?:addressed|handled|resolved|discussed|reviewed|considered|explored|assessed|evaluated|monitored|tracked)\b/gi,
    suggestion: 'Consider naming who will take this action for clearer ownership.',
  },
  {
    regex: /\bneeds\s+to\s+be\s+(?:addressed|done|completed|improved|fixed|changed|updated|reviewed|communicated)\b/gi,
    suggestion: 'Who needs to do this? Consider rewriting with a clear owner.',
  },
];

export const passiveVoiceRule: LintRule = {
  name: 'passive-voice',
  severity: 'info',
  description: 'Flags passive constructions that obscure ownership and weaken clarity',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of PASSIVE_PATTERNS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'passive-voice',
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
