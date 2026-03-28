export type Severity = "error" | "warning";

export interface LintIssue {
  rule: string;
  severity: Severity;
  message: string;
  suggestion?: string;
  line: number;
  column: number;
  length: number;
  matchedText: string;
}

export interface LintResult {
  issues: LintIssue[];
  score: number;
  summary: string;
}

export interface LintRule {
  name: string;
  check(text: string): LintIssue[];
}
