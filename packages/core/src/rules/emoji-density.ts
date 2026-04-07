import { LintRule, LintIssue } from '../types';

/**
 * Flags lines with excessive emoji usage (3+ emojis on a single line).
 * Chime tone is warm but not "corporate-perky."
 */

// Matches most common emoji ranges (emoticons, symbols, flags, etc.)
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1FA00}-\u{1FA9F}\u{1FB00}-\u{1FBFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu;

function countEmojis(line: string): number {
  const matches = line.match(EMOJI_REGEX);
  return matches ? matches.length : 0;
}

export const emojiDensityRule: LintRule = {
  name: 'emoji-density',
  severity: 'warning',
  description: 'Avoid excessive emoji usage; Chime tone is warm, not perky',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const count = countEmojis(lines[i]);
      if (count >= 3) {
        issues.push({
          file,
          line: i + 1,
          column: 1,
          matched: `${count} emojis`,
          context: lines[i],
          rule: 'emoji-density',
          severity: 'warning',
          message: `This line has ${count} emojis. Chime tone is warm but measured \u2013 consider reducing to 1\u20132 per line or removing decorative emojis.`,
          suggestion: 'Reduce to 1\u20132 emojis per line, or let the content carry the tone',
          autoFixable: false,
        });
      }
    }
    return issues;
  },
};
