import type { LintRule } from "../types.js";
import { findMatches } from "../utils.js";

const TERMS = [
  "ego",
  "catastrophi[sz]ing",
  "spirall?ing",
  "spiral",
  "triggered",
  "dysregulat(?:ed|ion)",
  "narcissis(?:t|tic|m)",
  "passive[- ]aggressive",
  "projecting",
  "deflecting",
  "gaslighting",
  "codependen(?:t|ce|cy)",
  "trauma[- ]response",
  "attachment style",
];

export const debriefLanguageRule: LintRule = {
  name: "debrief-language",
  check(text) {
    const pattern = new RegExp(`\\b(?:${TERMS.join("|")})\\b`, "gi");
    return findMatches(
      text,
      pattern,
      "debrief-language",
      "warning",
      (m) => `"${m[0]}" feels diagnostic \u2013 use accessible debrief language`,
      "Describe the observable behaviour or experience instead",
    );
  },
};
