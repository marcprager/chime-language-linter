import type { LintRule } from "../types.js";
import { findMatches } from "../utils.js";

export const struggleRule: LintRule = {
  name: "struggle",
  check(text) {
    return findMatches(
      text,
      /\bstruggles?\b|\bstruggling\b|\bstruggled\b/gi,
      "struggle",
      "warning",
      (m) => `Avoid "${m[0]}" \u2013 it can feel deficit-focused`,
      `Use "challenge," "stretch," or "difficulty" instead`,
    );
  },
};
