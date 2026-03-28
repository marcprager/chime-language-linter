import type { LintRule } from "../types.js";
import { findMatches } from "../utils.js";

const LABELS = [
  "drivers?",
  "rockstars?",
  "pros?",
  "ninjas?",
  "wizards?",
  "superstars?",
  "heroes",
  "hero",
  "all[- ]stars?",
];

export const identityLabelsRule: LintRule = {
  name: "identity-labels",
  check(text) {
    const pattern = new RegExp(`\\b(?:${LABELS.join("|")})\\b`, "gi");
    return findMatches(
      text,
      pattern,
      "identity-labels",
      "warning",
      (m) => `"${m[0]}" is an identity label \u2013 describe behaviour instead`,
      `Use phrases like "with confidence" or "with clarity"`,
    );
  },
};
