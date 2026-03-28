import type { LintIssue, Severity } from "./types.js";

/**
 * Find all regex matches in text and return LintIssues with correct
 * line/column positions.
 */
export function findMatches(
  text: string,
  pattern: RegExp,
  rule: string,
  severity: Severity,
  message: string | ((match: RegExpExecArray) => string),
  suggestion?: string | ((match: RegExpExecArray) => string),
): LintIssue[] {
  const issues: LintIssue[] = [];
  const lineStarts = getLineStarts(text);
  const regex = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const { line, column } = offsetToPosition(lineStarts, match.index);
    issues.push({
      rule,
      severity,
      message: typeof message === "function" ? message(match) : message,
      suggestion: suggestion
        ? typeof suggestion === "function"
          ? suggestion(match)
          : suggestion
        : undefined,
      line,
      column,
      length: match[0].length,
      matchedText: match[0],
    });
  }
  return issues;
}

function getLineStarts(text: string): number[] {
  const starts = [0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") {
      starts.push(i + 1);
    }
  }
  return starts;
}

function offsetToPosition(
  lineStarts: number[],
  offset: number,
): { line: number; column: number } {
  let low = 0;
  let high = lineStarts.length - 1;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (lineStarts[mid] <= offset) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  return { line: low + 1, column: offset - lineStarts[low] + 1 };
}
