import { LintRule, LintIssue } from '../types';

const HEDGING_PHRASES: Array<{ regex: RegExp; suggestion: string }> = [
  {
    regex: /\bI\s+just\s+feel\s+like\b/gi,
    suggestion: "Consider removing 'I just feel like' and stating your observation directly.",
  },
  {
    regex: /\bit\s+seems\s+like\s+maybe\b/gi,
    suggestion: "Consider removing 'It seems like maybe' and stating what you see directly.",
  },
  {
    regex: /\bI\s+think\s+perhaps\b/gi,
    suggestion: "Consider removing 'I think perhaps' and making a direct recommendation.",
  },
  {
    regex: /\bsort\s+of\b/gi,
    suggestion: "Consider removing 'sort of' for more direct language. (Ignore if used as a descriptor, e.g. 'a sort of hybrid.')",
  },
  {
    regex: /\bkind\s+of\b/gi,
    suggestion: "Consider removing 'kind of' for more direct language. (Ignore if used as a descriptor, e.g. 'a kind of pattern.')",
  },
];

export const passiveHedgingRule: LintRule = {
  name: 'passive-hedging',
  severity: 'warning',
  description: 'Hedging language undermines directness; be clear about what you observe or recommend',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of HEDGING_PHRASES) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'passive-hedging',
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
