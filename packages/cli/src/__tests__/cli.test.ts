import { lintText, applyFixes, lintFiles } from '../index';

describe('CLI linting', () => {
  it('should produce no issues for a clean file', () => {
    const text = 'This is perfectly clean content with no issues at all.';
    const issues = lintText(text, 'clean.md');
    expect(issues).toHaveLength(0);
  });

  it('should produce errors for em dashes', () => {
    const text = 'This is some text \u2014 with an em dash';
    const issues = lintText(text, 'test.md');
    const emDashIssues = issues.filter((i) => i.rule === 'em-dash');
    expect(emDashIssues.length).toBeGreaterThan(0);
    expect(emDashIssues[0].severity).toBe('error');
    expect(emDashIssues[0].autoFixable).toBe(true);
  });

  it('should fix em dashes with applyFixes', () => {
    const text = 'This is some text \u2014 with an em dash';
    const fixed = applyFixes(text);
    expect(fixed).not.toContain('\u2014');
    expect(fixed).toContain('\u2013');
  });

  it('should report correct line and column for issues', () => {
    const text = 'Line one\nLine two \u2014 here\nLine three';
    const issues = lintText(text, 'test.md');
    const emDashIssues = issues.filter((i) => i.rule === 'em-dash');
    expect(emDashIssues.length).toBeGreaterThan(0);
    expect(emDashIssues[0].line).toBe(2);
    expect(emDashIssues[0].column).toBe(10);
  });

  it('should filter issues by severity', () => {
    const text = 'This is some text \u2014 with an em dash';
    const errorIssues = lintText(text, 'test.md', { severity: 'error' });
    const warningIssues = lintText(text, 'test.md', { severity: 'warning' });

    // em-dash is an error, so filtering for warnings should exclude it
    const emDashErrors = errorIssues.filter((i) => i.rule === 'em-dash');
    const emDashWarnings = warningIssues.filter((i) => i.rule === 'em-dash');
    expect(emDashErrors.length).toBeGreaterThan(0);
    expect(emDashWarnings).toHaveLength(0);
  });
});
