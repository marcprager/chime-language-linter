import type { LintRule } from "../types.js";
import type { LintIssue } from "../types.js";

const FRAMEWORKS = [
  "SBI",
  "SARA",
  "GROW",
  "STAR",
  "DISC",
  "MBTI",
  "Myers[- ]Briggs",
  "Gallup",
  "StrengthsFinder",
  "CliftonStrengths",
  "Johari [Ww]indow",
  "Radical Candor",
  "Situational Leadership",
  "SCARF",
];

const PROPRIETARY_SIGNALS = [
  "(?:our|chime'?s?)\\s+(?:proprietary|exclusive|unique|own|signature|original)\\s+",
  "(?:we|chime)\\s+(?:created|invented|developed|designed|built|pioneered)\\s+(?:the\\s+)?",
  "(?:proprietary|exclusive|unique|signature|original)\\s+(?:to\\s+)?(?:us|chime)\\s+",
];

export const frameworkClaimsRule: LintRule = {
  name: "framework-claims",
  check(text) {
    const issues: LintIssue[] = [];
    const lines = text.split("\n");
    let offset = 0;

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const lineText = lines[lineIdx];

      for (const fw of FRAMEWORKS) {
        const fwRegex = new RegExp(`\\b${fw}\\b`, "gi");
        let fwMatch: RegExpExecArray | null;
        while ((fwMatch = fwRegex.exec(lineText)) !== null) {
          // Check if any proprietary signal appears near this framework mention
          for (const signal of PROPRIETARY_SIGNALS) {
            const contextRegex = new RegExp(
              `${signal}${fw}|${fw}\\s+(?:is|are|was)\\s+(?:our|chime'?s?)`,
              "gi",
            );
            if (contextRegex.test(lineText)) {
              issues.push({
                rule: "framework-claims",
                severity: "error",
                message: `Do not imply "${fwMatch[0]}" is proprietary to Chime \u2013 it is an industry framework`,
                suggestion: `Attribute "${fwMatch[0]}" to its original creator or describe it as an industry-standard framework`,
                line: lineIdx + 1,
                column: fwMatch.index + 1,
                length: fwMatch[0].length,
                matchedText: fwMatch[0],
              });
              break;
            }
          }
        }
      }
      offset += lineText.length + 1;
    }
    return issues;
  },
};
