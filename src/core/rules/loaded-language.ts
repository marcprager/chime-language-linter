import type { LintRule } from "../types.js";
import { findMatches } from "../utils.js";

const TERMS = [
  "addiction",
  "addicted",
  "secret weapon",
  "game[- ]changer",
  "game[- ]changing",
  "silver bullet",
  "magic bullet",
  "holy grail",
  "crushing it",
  "killing it",
  "destroyed",
  "annihilated",
  "blown away",
  "mind[- ]blowing",
  "insane(?:ly)?",
  "crazy",
  "obsessed",
];

export const loadedLanguageRule: LintRule = {
  name: "loaded-language",
  check(text) {
    const pattern = new RegExp(`\\b(?:${TERMS.join("|")})\\b`, "gi");
    return findMatches(
      text,
      pattern,
      "loaded-language",
      "warning",
      (m) => `"${m[0]}" is loaded or hyperbolic language`,
      "Use more measured, precise language",
    );
  },
};
