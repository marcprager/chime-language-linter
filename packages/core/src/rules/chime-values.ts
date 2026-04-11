import { LintRule, LintIssue } from '../types';

const CHIME_VALUES = [
  'Member Obsessed',
  'Be Bold',
  'Win Together',
  'Respect the Rules',
  'Be an Owner',
];

/**
 * Common morphological variants that Levenshtein distance won't catch
 * because the edit distance is too large (e.g. "Winning Together" → 4 edits).
 */
const KNOWN_VARIANTS: Record<string, string> = {
  'winning together': 'Win Together',
  'won together': 'Win Together',
  'member obsession': 'Member Obsessed',
  'being bold': 'Be Bold',
  'bold moves': 'Be Bold',
  'respecting the rules': 'Respect the Rules',
  'follow the rules': 'Respect the Rules',
  'being an owner': 'Be an Owner',
  'own it': 'Be an Owner',
};

/**
 * Compute the Levenshtein distance between two strings.
 */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[m][n];
}

/**
 * Generate candidate phrases from text that might be attempts at Chime values.
 * We look for sequences of 2-4 words that are close to known values.
 */
function findNearMatchCandidates(
  line: string,
  lineIndex: number,
  file: string,
): LintIssue[] {
  const issues: LintIssue[] = [];
  const words = line.split(/\s+/);

  for (const value of CHIME_VALUES) {
    const valueWords = value.split(/\s+/);
    const valueWordCount = valueWords.length;

    // Slide a window of the same word count across the line
    for (let start = 0; start <= words.length - valueWordCount; start++) {
      const candidate = words.slice(start, start + valueWordCount).join(' ');

      // Strip trailing punctuation for comparison
      const candidateClean = candidate.replace(/[.,;:!?'")\]]+$/, '').replace(/^['"(\[]+/, '');

      // Skip if it's an exact match (that's correct usage)
      if (candidateClean === value) continue;

      // Check known morphological variants first (e.g. "Winning Together" → "Win Together")
      const knownValue = KNOWN_VARIANTS[candidateClean.toLowerCase()];
      if (knownValue === value) {
        const col = line.indexOf(candidate);
        if (col === -1) continue;

        issues.push({
          file,
          line: lineIndex + 1,
          column: col + 1,
          matched: candidate,
          context: line,
          rule: 'chime-values',
          severity: 'error',
          message: `"${candidate}" looks like it might be the Chime value "${value}" but doesn't match exactly. Consider using the official wording.`,
          suggestion: `Replace with "${value}"`,
          autoFixable: true,
        });
        continue;
      }

      // Skip if cleaned candidate is much shorter/longer than the value
      if (candidateClean.length < value.length * 0.6 || candidateClean.length > value.length * 1.5) continue;

      const dist = levenshtein(candidateClean.toLowerCase(), value.toLowerCase());
      const threshold = Math.min(2, Math.floor(value.length * 0.2));

      // Only flag if close enough to be a plausible attempt at the value
      if (dist > 0 && dist <= threshold) {
        const col = line.indexOf(candidate);
        if (col === -1) continue;

        issues.push({
          file,
          line: lineIndex + 1,
          column: col + 1,
          matched: candidate,
          context: line,
          rule: 'chime-values',
          severity: 'error',
          message: `"${candidate}" looks like it might be the Chime value "${value}" but doesn't match exactly. Consider using the official wording.`,
          suggestion: `Replace with "${value}"`,
          autoFixable: true,
        });
      }
    }
  }

  return issues;
}

export const chimeValuesRule: LintRule = {
  name: 'chime-values',
  severity: 'error',
  description: 'Chime values should use their official exact wording',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      issues.push(...findNearMatchCandidates(lines[i], i, file));
    }

    return issues;
  },
  fix(text) {
    let result = text;
    for (const value of CHIME_VALUES) {
      const valueWords = value.split(/\s+/);
      const valueWordCount = valueWords.length;
      const lines = result.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const words = lines[i].split(/\s+/);
        for (let start = words.length - valueWordCount; start >= 0; start--) {
          const candidate = words.slice(start, start + valueWordCount).join(' ');
          const candidateClean = candidate.replace(/[.,;:!?'")\]]+$/, '').replace(/^['"(\[]+/, '');
          if (candidateClean === value) continue;

          let shouldReplace = false;

          // Check known variants
          if (KNOWN_VARIANTS[candidateClean.toLowerCase()] === value) {
            shouldReplace = true;
          } else {
            // Check Levenshtein distance
            if (candidateClean.length >= value.length * 0.6 && candidateClean.length <= value.length * 1.5) {
              const dist = levenshtein(candidateClean.toLowerCase(), value.toLowerCase());
              const threshold = Math.min(2, Math.floor(value.length * 0.2));
              if (dist > 0 && dist <= threshold) {
                shouldReplace = true;
              }
            }
          }

          if (shouldReplace) {
            const prefix = candidate.match(/^['"(\[]+/)?.[0] ?? '';
            const suffix = candidate.match(/[.,;:!?'")\]]+$/)?.[0] ?? '';
            words.splice(start, valueWordCount, prefix + value + suffix);
          }
        }
        lines[i] = words.join(' ');
      }
      result = lines.join('\n');
    }
    return result;
  },
};
