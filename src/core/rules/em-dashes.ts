import type { LintRule } from "../types.js";
import { findMatches } from "../utils.js";

export const emDashesRule: LintRule = {
  name: "em-dashes",
  check(text) {
    return findMatches(
      text,
      /\u2014/g,
      "em-dashes",
      "error",
      "Use an en dash (\u2013) instead of an em dash (\u2014)",
      "Replace with \u2013 (en dash)",
    );
  },
};
