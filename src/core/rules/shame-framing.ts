import type { LintRule } from "../types.js";
import { findMatches } from "../utils.js";

const PATTERNS = [
  "lowest score",
  "worst performing",
  "worst performer",
  "bottom[- ]ranked",
  "bottom of the (?:list|rankings?|pile)",
  "dead last",
  "failed to meet",
  "falling behind",
  "falling short",
  "underperform(?:ing|ed|er|ers)?",
  "weakest",
  "poorest performer",
];

export const shameFramingRule: LintRule = {
  name: "shame-framing",
  check(text) {
    const pattern = new RegExp(`\\b(?:${PATTERNS.join("|")})\\b`, "gi");
    return findMatches(
      text,
      pattern,
      "shame-framing",
      "error",
      (m) => `"${m[0]}" is shame-based framing`,
      "Reframe using opportunity language, e.g. \"area for growth\" or \"opportunity to develop\"",
    );
  },
};
