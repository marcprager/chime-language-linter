import type { LintRule } from "../types.js";
import { findMatches } from "../utils.js";

const PROFANITY = [
  "damn",
  "dammit",
  "hell",
  "shit(?:ty)?",
  "bullshit",
  "ass(?:hole)?",
  "crap(?:py)?",
  "piss(?:ed)?",
  "wtf",
  "stfu",
  "lmao",
  "af\\b",
  "dumpster fire",
  "hot mess",
  "train ?wreck",
  "no[- ]brainer",
  "sucks?",
  "blows",
  "screw(?:ed|ing)?",
  "freaking",
  "frickin[g']?",
  "hella",
  "dope",
  "lit\\b",
  "vibe check",
  "lowkey",
  "highkey",
  "sus\\b",
  "slay",
  "bruh",
  "fam\\b",
  "yolo",
  "yeet",
];

export const profanityRule: LintRule = {
  name: "profanity",
  check(text) {
    const pattern = new RegExp(`\\b(?:${PROFANITY.join("|")})`, "gi");
    return findMatches(
      text,
      pattern,
      "profanity",
      "error",
      (m) => `"${m[0]}" is profane or overly casual for professional content`,
      "Use professional, inclusive language",
    );
  },
};
