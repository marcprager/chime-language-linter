import type { LintRule, LintResult, LintIssue } from "./types.js";
import { emDashesRule } from "./rules/em-dashes.js";
import { struggleRule } from "./rules/struggle.js";
import { identityLabelsRule } from "./rules/identity-labels.js";
import { loadedLanguageRule } from "./rules/loaded-language.js";
import { shameFramingRule } from "./rules/shame-framing.js";
import { clinicalTermsRule } from "./rules/clinical-terms.js";
import { debriefLanguageRule } from "./rules/debrief-language.js";
import { profanityRule } from "./rules/profanity.js";
import { frameworkClaimsRule } from "./rules/framework-claims.js";
import { unattributedStatsRule } from "./rules/unattributed-stats.js";
import { chimeValuesRule } from "./rules/chime-values.js";

const ALL_RULES: LintRule[] = [
  emDashesRule,
  struggleRule,
  identityLabelsRule,
  loadedLanguageRule,
  shameFramingRule,
  clinicalTermsRule,
  debriefLanguageRule,
  profanityRule,
  frameworkClaimsRule,
  unattributedStatsRule,
  chimeValuesRule,
];

export function lint(text: string): LintResult {
  const issues: LintIssue[] = [];

  for (const rule of ALL_RULES) {
    issues.push(...rule.check(text));
  }

  // Sort by line, then column
  issues.sort((a, b) => a.line - b.line || a.column - b.column);

  const score = computeScore(issues);
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const summary =
    issues.length === 0
      ? "No issues found \u2013 content looks great!"
      : `Found ${issues.length} issue${issues.length === 1 ? "" : "s"}: ${errors} error${errors === 1 ? "" : "s"}, ${warnings} warning${warnings === 1 ? "" : "s"} \u2013 score: ${score}/100`;

  return { issues, score, summary };
}

function computeScore(issues: LintIssue[]): number {
  let deductions = 0;
  for (const issue of issues) {
    deductions += issue.severity === "error" ? 10 : 5;
  }
  return Math.max(0, 100 - deductions);
}
