import type { LintRule, LintIssue } from "../types.js";

const OFFICIAL_VALUES = [
  "Member Obsessed",
  "Be Bold",
  "Win Together",
  "Respect the Rules",
  "Be an Owner",
];

// Common misspellings / variations that should be flagged
const FUZZY_PATTERNS: Array<{ pattern: RegExp; official: string }> = [
  // Member Obsessed
  { pattern: /\bmember[- ]focused\b/gi, official: "Member Obsessed" },
  { pattern: /\bcustomer[- ]obsessed\b/gi, official: "Member Obsessed" },
  { pattern: /\bmember[- ]first\b/gi, official: "Member Obsessed" },
  { pattern: /\bmember[- ]centric\b/gi, official: "Member Obsessed" },
  { pattern: /\bmembers?[- ]obsession\b/gi, official: "Member Obsessed" },
  { pattern: /\bcustomer[- ]first\b/gi, official: "Member Obsessed" },
  { pattern: /\bclient[- ]obsessed\b/gi, official: "Member Obsessed" },

  // Be Bold
  { pattern: /\bbe brave\b/gi, official: "Be Bold" },
  { pattern: /\bbeing bold\b/gi, official: "Be Bold" },
  { pattern: /\bboldness\b/gi, official: "Be Bold" },
  { pattern: /\btake risks?\b/gi, official: "Be Bold" },
  { pattern: /\bbe fearless\b/gi, official: "Be Bold" },
  { pattern: /\bbe courageous\b/gi, official: "Be Bold" },

  // Win Together
  { pattern: /\bwin as a team\b/gi, official: "Win Together" },
  { pattern: /\bwork together\b/gi, official: "Win Together" },
  { pattern: /\bwinning together\b/gi, official: "Win Together" },
  { pattern: /\bteamwork\b/gi, official: "Win Together" },
  { pattern: /\bcollaborate\b/gi, official: "Win Together" },

  // Respect the Rules
  { pattern: /\bfollow the rules\b/gi, official: "Respect the Rules" },
  { pattern: /\brule follower\b/gi, official: "Respect the Rules" },
  { pattern: /\brespect rules\b/gi, official: "Respect the Rules" },
  { pattern: /\bplay by the rules\b/gi, official: "Respect the Rules" },
  { pattern: /\bcompliance[- ]first\b/gi, official: "Respect the Rules" },

  // Be an Owner
  { pattern: /\btake ownership\b/gi, official: "Be an Owner" },
  { pattern: /\bownership mentality\b/gi, official: "Be an Owner" },
  { pattern: /\bact like (?:an )?owners?\b/gi, official: "Be an Owner" },
  { pattern: /\bowner(?:'s)? mindset\b/gi, official: "Be an Owner" },
  { pattern: /\bown it\b/gi, official: "Be an Owner" },
  { pattern: /\bbe owners?\b/gi, official: "Be an Owner" },
];

function getLineStarts(text: string): number[] {
  const starts = [0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") starts.push(i + 1);
  }
  return starts;
}

function offsetToPosition(lineStarts: number[], offset: number) {
  let low = 0;
  let high = lineStarts.length - 1;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (lineStarts[mid] <= offset) low = mid;
    else high = mid - 1;
  }
  return { line: low + 1, column: offset - lineStarts[low] + 1 };
}

export const chimeValuesRule: LintRule = {
  name: "chime-values",
  check(text) {
    const issues: LintIssue[] = [];
    const lineStarts = getLineStarts(text);

    for (const { pattern, official } of FUZZY_PATTERNS) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        const { line, column } = offsetToPosition(lineStarts, match.index);
        issues.push({
          rule: "chime-values",
          severity: "error",
          message: `"${match[0]}" looks like an incorrect Chime value name`,
          suggestion: `The official value is "${official}"`,
          line,
          column,
          length: match[0].length,
          matchedText: match[0],
        });
      }
    }
    return issues;
  },
};
