import type { LintRule } from "../types.js";
import { findMatches } from "../utils.js";

const TERMS = [
  "cogniti(?:ve|on)",
  "metacogniti(?:ve|on)",
  "neuroplasticity",
  "amygdala",
  "prefrontal cortex",
  "dopamine",
  "serotonin",
  "cortisol",
  "limbic",
  "autonomic",
  "psychometric",
  "self[- ]actuali[sz]ation",
  "operant conditioning",
  "cognitive dissonance",
  "dunning[- ]kruger",
  "maslows?['\u2019]?s? hierarchy",
  "schema(?:s|ta)?",
  "heuristic",
];

export const clinicalTermsRule: LintRule = {
  name: "clinical-terms",
  check(text) {
    const pattern = new RegExp(`\\b(?:${TERMS.join("|")})\\b`, "gi");
    return findMatches(
      text,
      pattern,
      "clinical-terms",
      "warning",
      (m) => `"${m[0]}" is a clinical term \u2013 pair with a plain-English explanation`,
      "Add a brief, accessible definition or rephrase in everyday language",
    );
  },
};
