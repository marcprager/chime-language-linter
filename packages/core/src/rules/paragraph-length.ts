import { LintRule, LintIssue } from '../types';

/**
 * Flags paragraphs that are too long for exec-skimmable content.
 * Chime internal docs should be scannable: short paragraphs, bullets, whitespace.
 *
 * A "paragraph" is a contiguous block of non-blank lines with 4+ sentences.
 */

const SENTENCE_END = /[.!?]["'\u201D\u2019)]*\s/g;
const MIN_SENTENCES = 5;
const MIN_CHAR_LENGTH = 300;

export const paragraphLengthRule: LintRule = {
  name: 'paragraph-length',
  severity: 'info',
  description: 'Long paragraphs reduce scannability; consider breaking into bullets or shorter blocks',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    let paragraphStart = -1;
    let paragraphText = '';

    const checkParagraph = (endLine: number) => {
      if (paragraphStart === -1 || paragraphText.length < MIN_CHAR_LENGTH) return;

      SENTENCE_END.lastIndex = 0;
      let sentenceCount = 0;
      while (SENTENCE_END.exec(paragraphText) !== null) {
        sentenceCount++;
      }
      // Count the last sentence (may not end with space)
      if (paragraphText.trim().length > 0 && /[.!?]["'\u201D\u2019)]*$/.test(paragraphText.trim())) {
        sentenceCount++;
      }

      if (sentenceCount >= MIN_SENTENCES) {
        issues.push({
          file,
          line: paragraphStart + 1,
          column: 1,
          matched: `${sentenceCount} sentences, ${paragraphText.length} chars`,
          context: lines[paragraphStart],
          rule: 'paragraph-length',
          severity: 'info',
          message: `This paragraph has ${sentenceCount} sentences (${paragraphText.length} characters). Consider breaking it into shorter blocks or bullet points for scannability.`,
          suggestion: 'Break into shorter paragraphs or use bullet points',
          autoFixable: false,
        });
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();

      if (trimmed === '') {
        checkParagraph(i);
        paragraphStart = -1;
        paragraphText = '';
      } else {
        if (paragraphStart === -1) {
          paragraphStart = i;
          paragraphText = trimmed;
        } else {
          paragraphText += ' ' + trimmed;
        }
      }
    }
    // Check the last paragraph
    checkParagraph(lines.length);

    return issues;
  },
};
