import type { LintRule } from "../types.js";
import { findMatches } from "../utils.js";

const PATTERNS = [
  "research (?:shows?|suggests?|indicates?|has shown|proves?|confirms?)",
  "studies (?:show|suggest|indicate|have shown|prove|confirm)",
  "data (?:shows?|suggests?|indicates?|proves?|confirms?)",
  "(?:evidence|science) (?:shows?|suggests?|indicates?|proves?|confirms?)",
  "according to (?:research|studies|data|science|evidence|experts?)",
  "it(?:'s| is| has been) (?:proven|shown|demonstrated|established) that",
  "\\d+%\\s+of\\s+(?:people|employees|managers|leaders|teams|workers|organizations)",
  "statistically",
];

export const unattributedStatsRule: LintRule = {
  name: "unattributed-stats",
  check(text) {
    const pattern = new RegExp(`(?:${PATTERNS.join("|")})`, "gi");
    return findMatches(
      text,
      pattern,
      "unattributed-stats",
      "error",
      (m) => `"${m[0]}" \u2013 cite a specific source`,
      "Name the study, author, or publication (e.g. \"Gallup, 2023\")",
    );
  },
};
