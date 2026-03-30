export type Severity = 'error' | 'warning' | 'info';

export interface LintIssue {
  file: string;
  line: number;
  column: number;
  matched: string;
  context: string;
  rule: string;
  severity: Severity;
  message: string;
  suggestion?: string;
  autoFixable: boolean;
}

export interface LintResult {
  issues: LintIssue[];
  filesScanned: number;
  cleanFiles: number;
  summary: { errors: number; warnings: number; info: number };
}

export interface LintRule {
  name: string;
  severity: Severity;
  description: string;
  check: (text: string, file: string) => LintIssue[];
  fix?: (text: string) => string;
}

export interface LintOptions {
  severity?: Severity;
  fix?: boolean;
}
