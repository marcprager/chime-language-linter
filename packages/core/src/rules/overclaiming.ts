import { LintRule, LintIssue } from '../types';

const OVERCLAIM_PHRASES: Array<{ regex: RegExp; suggestion: string }> = [
  {
    regex: /\bresearch\s+proves\b/gi,
    suggestion: "'Research proves' overclaims. Consider 'research suggests', 'studies indicate', or cite the specific source.",
  },
  {
    regex: /\beveryone\s+knows\b/gi,
    suggestion: "'Everyone knows' is an ungrounded universal claim. Consider 'many people recognize' or cite specific evidence.",
  },
  {
    regex: /\bit'?s\s+obvious\s+that\b/gi,
    suggestion: "'It's obvious that' dismisses those who may not share your view. State the evidence directly.",
  },
  {
    regex: /\bclearly\s+shows\b/gi,
    suggestion: "'Clearly shows' assumes consensus. Consider 'suggests', 'indicates', or 'the data points to'.",
  },
];

export const overclaimingRule: LintRule = {
  name: 'overclaiming',
  severity: 'warning',
  description: 'Avoid overclaiming without evidence; ground statements in specific data or sources',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of OVERCLAIM_PHRASES) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'overclaiming',
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
