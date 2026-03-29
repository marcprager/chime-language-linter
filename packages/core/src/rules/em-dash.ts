import { LintRule, LintIssue } from '../types';

function findAllOccurrences(
  text: string,
  search: string,
  file: string,
  rule: string,
  severity: 'error' | 'warning' | 'info',
  message: string,
  suggestion: string,
  autoFixable: boolean,
): LintIssue[] {
  const issues: LintIssue[] = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let col = 0;
    while ((col = lines[i].indexOf(search, col)) !== -1) {
      issues.push({
        file,
        line: i + 1,
        column: col + 1,
        matched: search,
        context: lines[i],
        rule,
        severity,
        message,
        suggestion,
        autoFixable,
      });
      col += search.length;
    }
  }
  return issues;
}

export const emDashRule: LintRule = {
  name: 'em-dash',
  severity: 'error',
  description: 'Em dashes (\u2014) should be replaced with en dashes (\u2013)',
  check(text, file) {
    return findAllOccurrences(
      text,
      '\u2014',
      file,
      'em-dash',
      'error',
      'Consider using an en dash (\u2013) instead of an em dash (\u2014)',
      'Replace \u2014 with \u2013',
      true,
    );
  },
  fix(text) {
    return text.replace(/\u2014/g, '\u2013');
  },
};
