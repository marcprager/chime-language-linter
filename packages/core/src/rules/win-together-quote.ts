import { LintRule, LintIssue } from '../types';

const OFFICIAL_QUOTE =
  'We hold each other accountable. We ask for open, honest feedback, and Chime In to provide it to others. We believe that clarity is kindness.';

const QUOTE_REGEX = /Win Together\b[^\u201C\u201D"\n]*[\u201C\u201D"]([^\u201C\u201D"]+)[\u201C\u201D"]/gi;

export const winTogetherQuoteRule: LintRule = {
  name: 'win-together-quote',
  severity: 'error',
  description: 'Win Together quotes should match the official wording exactly',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');
    const fullText = text;

    const regex = new RegExp(QUOTE_REGEX.source, QUOTE_REGEX.flags);
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
          matched: quotedText,
          context: lines[lineNum - 1] || '',
          rule: 'win-together-quote',
          severity: 'error',
          message: 'The Win Together quote does not match the official wording. Please verify the exact text.',
          suggestion: `Use the official quote: "${OFFICIAL_QUOTE}"`,
          autoFixable: true,
        });
      }
    }

    return issues;
  },
  fix(text) {
    const regex = new RegExp(QUOTE_REGEX.source, QUOTE_REGEX.flags);
    return text.replace(regex, (fullMatch, quotedText) => {
      if (quotedText.trim() === OFFICIAL_QUOTE) return fullMatch;
      return fullMatch.replace(quotedText, OFFICIAL_QUOTE);
    });
  },
};
