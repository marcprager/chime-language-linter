import { LintRule, LintIssue } from '../types';

const OFFICIAL_QUOTE =
  'We hold each other accountable. We ask for open, honest feedback, and Chime In to provide it to others. We believe that clarity is kindness.';

export const winTogetherQuoteRule: LintRule = {
  name: 'win-together-quote',
  severity: 'error',
  description: 'Win Together quotes should match the official wording exactly',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    // Look for "Win Together" followed by a colon or in quotes, then capture the quoted text
    // Pattern 1: Win Together: "some quote"
    // Pattern 2: Win Together: some quote (until end of paragraph or period-period pattern)
    const fullText = text;

    // Find all occurrences of "Win Together" followed by a quote-like context
    const regex = /Win Together["":][\s]*["""]([^"""]+)["""]/gi;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(fullText)) !== null) {
      const quotedText = match[1].trim();

      if (quotedText !== OFFICIAL_QUOTE) {
        // Find the line number
        const beforeMatch = fullText.substring(0, match.index);
        const lineNum = beforeMatch.split('\n').length;
        const lineStart = beforeMatch.lastIndexOf('\n') + 1;
        const col = match.index - lineStart + 1;

        issues.push({
          file,
          line: lineNum,
          column: col,
          matched: quotedText.substring(0, 50) + (quotedText.length > 50 ? '...' : ''),
          context: lines[lineNum - 1] || '',
          rule: 'win-together-quote',
          severity: 'error',
          message: 'The Win Together quote does not match the official wording. Please verify the exact text.',
          suggestion: `Use the official quote: "${OFFICIAL_QUOTE}"`,
          autoFixable: false,
        });
      }
    }

    return issues;
  },
};
