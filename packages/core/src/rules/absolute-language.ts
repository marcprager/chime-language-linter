import { LintRule, LintIssue } from '../types';

/**
 * Flags sweeping absolute language that can undermine credibility
 * or sound accusatory. Chime tone is measured and precise.
 *
 * Only flags in prose-like contexts (phrases with surrounding words),
 * not isolated labels or headers.
 */

const ABSOLUTE_PATTERNS: Array<{ regex: RegExp; term: string; suggestion: string }> = [
  {
    regex: /\bacross every\s+\w+/gi,
    term: 'across every',
    suggestion: 'Consider hedging: "across the functions we\u2019ve heard from" or "across most teams"',
  },
  {
    regex: /\beveryone knows\b/gi,
    term: 'everyone knows',
    suggestion: 'Consider "many people recognize" or "it\u2019s widely understood"',
  },
  {
    regex: /\bno one\s+(?:has|does|is|wants|knows|believes|thinks|ever)\b/gi,
    term: 'no one',
    suggestion: 'Consider "few people" or "this hasn\u2019t been common"',
  },
  {
    regex: /\balways\s+(?:results?|leads?|causes?|means?|fails?|happens?)\b/gi,
    term: 'always',
    suggestion: 'Consider "often" or "consistently" \u2013 absolutes invite pushback',
  },
  {
    regex: /\bnever\s+(?:results?|leads?|works?|happens?|gets?|receives?)\b/gi,
    term: 'never',
    suggestion: 'Consider "rarely" or "has not yet" \u2013 absolutes invite pushback',
  },
  {
    regex: /\bthe single most\b/gi,
    term: 'the single most',
    suggestion: 'Consider "one of the most" or "among the most significant" \u2013 superlatives can feel overclaimed',
  },
  {
    regex: /\bthe (?:only|sole) (?:way|reason|cause|answer|solution)\b/gi,
    term: 'the only/sole',
    suggestion: 'Consider "a key factor" or "one of the main reasons" \u2013 singular framing can feel dismissive',
  },
  {
    regex: /\bwithout exception\b/gi,
    term: 'without exception',
    suggestion: 'Consider whether this is literally true \u2013 if not, soften to "consistently" or "in nearly every case"',
  },
  {
    regex: /\buniversally\s+(?:agreed|true|felt|acknowledged|recognized)\b/gi,
    term: 'universally',
    suggestion: 'Consider "broadly" or "widely" \u2013 "universally" is almost never literally accurate',
  },
];

export const absoluteLanguageRule: LintRule = {
  name: 'absolute-language',
  severity: 'info',
  description: 'Avoid sweeping absolutes that can undermine credibility; use measured, precise language',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of ABSOLUTE_PATTERNS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'absolute-language',
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
