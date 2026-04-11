import { LintRule, LintIssue } from '../types';

/**
 * Flags hedge words and weak qualifiers that undermine confidence in
 * People Development content. These are fine in casual speech but
 * weaken written guidance and action plans.
 */

const HEDGE_PATTERNS: Array<{ regex: RegExp; matched: string; suggestion: string }> = [
  {
    regex: /\bperhaps\b/gi,
    matched: 'perhaps',
    suggestion: 'Consider removing "perhaps" or committing to a concrete recommendation.',
  },
  {
    regex: /\bmaybe\b/gi,
    matched: 'maybe',
    suggestion: 'Consider removing "maybe" or stating the recommendation directly.',
  },
  {
    regex: /\bsomewhat\b/gi,
    matched: 'somewhat',
    suggestion: 'Consider replacing "somewhat" with a specific qualifier or removing it.',
  },
  {
    regex: /\bsort\s+of\b/gi,
    matched: 'sort of',
    suggestion: '"Sort of" is imprecise. Consider stating what you mean directly.',
  },
  {
    regex: /\bkind\s+of\b/gi,
    matched: 'kind of',
    suggestion: '"Kind of" is imprecise. Consider stating what you mean directly.',
  },
  {
    regex: /\bjust\s+(?:a\s+)?(?:thought|idea|suggestion)\b/gi,
    matched: 'just a thought',
    suggestion: 'Avoid minimizing your recommendation. State it with confidence.',
  },
  {
    regex: /\bit\s+seems\s+like\b/gi,
    matched: 'it seems like',
    suggestion: 'Consider stating the observation directly rather than hedging with "it seems like."',
  },
  {
    regex: /\bwe\s+(?:might|could)\s+(?:want\s+to|consider|think\s+about|try)\b/gi,
    matched: 'we might want to',
    suggestion: 'Consider a direct recommendation: "We should..." or "We recommend..." instead of hedging.',
  },
  {
    regex: /\bi\s+(?:think|feel\s+like|would\s+say)\b/gi,
    matched: 'I think',
    suggestion: 'In guidance documents, state recommendations directly rather than framing them as personal opinion.',
  },
  {
    regex: /\bprobably\b/gi,
    matched: 'probably',
    suggestion: 'Consider removing "probably" or specifying the uncertainty with data.',
  },
  {
    regex: /\ba\s+bit\b/gi,
    matched: 'a bit',
    suggestion: 'Consider replacing "a bit" with a specific amount or removing it.',
  },
  {
    regex: /\bbasically\b/gi,
    matched: 'basically',
    suggestion: '"Basically" rarely adds value. Consider removing it.',
  },
];

export const hedgeWordsRule: LintRule = {
  name: 'hedge-words',
  severity: 'info',
  description: 'Flags hedge words and weak qualifiers that undermine confidence in written guidance',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of HEDGE_PATTERNS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'hedge-words',
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
