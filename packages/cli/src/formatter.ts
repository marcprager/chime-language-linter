import { LintResult, LintIssue, Severity } from '@chime-linter/core/src/types';

// ANSI color codes
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';

function severityColor(severity: Severity): string {
  switch (severity) {
    case 'error':
      return RED;
    case 'warning':
      return YELLOW;
    case 'info':
      return BLUE;
  }
}

function underlinePointer(context: string, column: number, matchLength: number): string {
  const leadingSpaces = ' '.repeat(column - 1);
  const carets = '^'.repeat(Math.max(1, matchLength));
  return `  ${DIM}|${RESET} ${leadingSpaces}${carets}`;
}

export function formatPretty(result: LintResult): string {
  if (result.issues.length === 0) {
    return '';
  }

  const lines: string[] = [];

  for (const issue of result.issues) {
    const color = severityColor(issue.severity);

    // file:line:col severity [rule] message
    lines.push(
      `${BOLD}${issue.file}:${issue.line}:${issue.column}${RESET} ` +
      `${color}${issue.severity}${RESET} ` +
      `${DIM}[${issue.rule}]${RESET} ${issue.message}`
    );

    // Context line
    lines.push(`  ${DIM}|${RESET} ${issue.context}`);

    // Pointer line
    lines.push(underlinePointer(issue.context, issue.column, issue.matched.length));

    // Suggestion
    if (issue.suggestion) {
      lines.push(`  ${DIM}Suggestion: ${issue.suggestion}${RESET}`);
    }

    lines.push('');
  }

  return lines.join('\n');
}

export function formatJson(result: LintResult): string {
  return JSON.stringify(result, null, 2);
}

export function formatSummary(result: LintResult): string {
  const lines: string[] = [];
  const divider = '\u2500'.repeat(30);
  lines.push(divider);

  const { errors, warnings, info } = result.summary;
  const total = errors + warnings + info;

  if (total === 0) {
    lines.push(`\u2713 All clean! ${result.filesScanned} files scanned`);
  } else {
    const parts: string[] = [];
    if (errors > 0) parts.push(`${RED}${errors} error${errors !== 1 ? 's' : ''}${RESET}`);
    if (warnings > 0) parts.push(`${YELLOW}${warnings} warning${warnings !== 1 ? 's' : ''}${RESET}`);
    if (info > 0) parts.push(`${BLUE}${info} info${RESET}`);

    lines.push(`\u2717 ${parts.join(', ')}`);
    lines.push(`  ${result.filesScanned} file${result.filesScanned !== 1 ? 's' : ''} scanned, ${result.cleanFiles} clean`);
  }

  return lines.join('\n');
}
