import { LintRule, LintIssue } from '../types';

const VAGUE_CITATION_PHRASES = [
  'research shows',
  'research suggests',
  'research indicates',
  'research finds',
  'studies show',
  'studies find',
  'studies suggest',
  'studies indicate',
  'data shows',
  'data suggests',
  'data indicates',
  'evidence shows',
  'evidence suggests',
  'evidence indicates',
  'experts say',
  'experts agree',
  'according to research',
  'according to studies',
];

/**
 * Check if a sentence (or the next sentence) contains a citation-like reference:
 * a 4-digit year (19xx/20xx), a parenthetical with a name, or a named source.
 */
function hasCitation(sentence: string, nextSentence?: string): boolean {
  const yearPattern = /\b(19|20)\d{2}\b/;
  // Parenthetical citation like (Smith, 2020) or (Harvard Business Review)
  const parenCitation = /\([A-Z][a-z]+.*?\)/;
  // Named source patterns
  const namedSource = /\b(according to [A-Z]|per [A-Z]|from [A-Z])/;

  const toCheck = [sentence, nextSentence].filter(Boolean).join(' ');
  return yearPattern.test(toCheck) || parenCitation.test(toCheck) || namedSource.test(toCheck);
}

export const unattributedStatsRule: LintRule = {
  name: 'unattributed-stats',
  severity: 'error',
  description: 'Statistical claims should include a named source, author, or year',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    // Work with sentences rather than lines for citation checking
    const fullText = text;
    // Split into rough sentences
    const sentences = fullText.split(/(?<=[.!?])\s+/);

    for (let si = 0; si < sentences.length; si++) {
      const sentence = sentences[si];
      const nextSentence = sentences[si + 1];

      for (const phrase of VAGUE_CITATION_PHRASES) {
        const phraseRegex = new RegExp(`\\b${phrase}\\b`, 'gi');
        if (phraseRegex.test(sentence) && !hasCitation(sentence, nextSentence)) {
          // Find the line number of this phrase in the original text
          const lowerText = text.toLowerCase();
          const lowerPhrase = phrase.toLowerCase();
          let searchFrom = 0;
          let idx: number;

          while ((idx = lowerText.indexOf(lowerPhrase, searchFrom)) !== -1) {
            const beforeMatch = text.substring(0, idx);
            const lineNum = beforeMatch.split('\n').length;
            const lineStart = beforeMatch.lastIndexOf('\n') + 1;
            const col = idx - lineStart + 1;
            const line = lines[lineNum - 1] || '';

            // Verify this occurrence is in a sentence without citation
            const sentenceStart = Math.max(
              text.lastIndexOf('.', idx),
              text.lastIndexOf('!', idx),
              text.lastIndexOf('?', idx),
              0,
            );
            const sentenceEnd = Math.min(
              ...[text.indexOf('.', idx), text.indexOf('!', idx), text.indexOf('?', idx)]
                .filter((x) => x !== -1)
                .concat([text.length]),
            );
            const localSentence = text.substring(sentenceStart, sentenceEnd);

            // Check next sentence too
            const nextSentEnd = Math.min(
              ...[
                text.indexOf('.', sentenceEnd + 1),
                text.indexOf('!', sentenceEnd + 1),
                text.indexOf('?', sentenceEnd + 1),
              ]
                .filter((x) => x !== -1)
                .concat([text.length]),
            );
            const localNextSentence = text.substring(sentenceEnd, nextSentEnd);

            if (!hasCitation(localSentence, localNextSentence)) {
              issues.push({
                file,
                line: lineNum,
                column: col,
                matched: text.substring(idx, idx + phrase.length),
                context: line,
                rule: 'unattributed-stats',
                severity: 'error',
                message: `"${phrase}" appears without a specific source. Consider attributing this claim to a named study, author, or year.`,
                suggestion: 'Add a specific source, author name, or publication year',
                autoFixable: false,
              });
            }

            searchFrom = idx + phrase.length;
          }
          // Only report the first occurrence of each phrase to avoid duplicates
          break;
        }
      }
    }

    // Deduplicate by line+column
    const seen = new Set<string>();
    return issues.filter((issue) => {
      const key = `${issue.line}:${issue.column}:${issue.matched}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },
};
