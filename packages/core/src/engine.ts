import { LintRule, LintIssue, LintResult, LintOptions } from './types';
import { allRules } from './rules';
import { extractLintableText, getFileType } from './filters';

export function lintText(text: string, file: string = '<input>', options?: LintOptions): LintResult {
  const fileType = getFileType(file);
  const segments = extractLintableText(text, fileType);

  const applicableRules = options?.severity
    ? allRules.filter(r => r.severity === options.severity)
    : allRules;

  const issues: LintIssue[] = [];

  for (const segment of segments) {
    for (const rule of applicableRules) {
      const segIssues = rule.check(segment.text, file);
      // Adjust line/col based on segment offset
      for (const issue of segIssues) {
        issues.push({
          ...issue,
          line: issue.line + segment.lineOffset,
          column: issue.column + segment.colOffset,
        });
      }
    }
  }

  // Deduplicate issues by file+line+column+rule
  const seen = new Set<string>();
  const deduped = issues.filter(issue => {
    const key = `${issue.file}:${issue.line}:${issue.column}:${issue.rule}:${issue.matched}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by line, then column
  deduped.sort((a, b) => a.line - b.line || a.column - b.column);

  const summary = {
    errors: deduped.filter(i => i.severity === 'error').length,
    warnings: deduped.filter(i => i.severity === 'warning').length,
    info: deduped.filter(i => i.severity === 'info').length,
  };

  return {
    issues: deduped,
    filesScanned: 1,
    cleanFiles: deduped.length === 0 ? 1 : 0,
    summary,
  };
}

export function fixText(text: string, file: string = '<input>'): string {
  let result = text;
  for (const rule of allRules) {
    if (rule.fix) {
      result = rule.fix(result);
    }
  }
  return result;
}

export function mergeResults(results: LintResult[]): LintResult {
  const allIssues = results.flatMap(r => r.issues);
  return {
    issues: allIssues,
    filesScanned: results.reduce((sum, r) => sum + r.filesScanned, 0),
    cleanFiles: results.reduce((sum, r) => sum + r.cleanFiles, 0),
    summary: {
      errors: allIssues.filter(i => i.severity === 'error').length,
      warnings: allIssues.filter(i => i.severity === 'warning').length,
      info: allIssues.filter(i => i.severity === 'info').length,
    },
  };
}
