import { LintRule, LintIssue } from '../types';

export const fabricatedGreenHeartRule: LintRule = {
  name: 'fabricated-green-heart',
  severity: 'warning',
  description: 'Avoid injecting the 💚 emoji via CSS pseudo-elements; use real content instead',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    // Match content properties that contain the green heart emoji
    const contentRegex = /content\s*:\s*['"][^'"]*💚[^'"]*['"]/g;

    for (let i = 0; i < lines.length; i++) {
      contentRegex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = contentRegex.exec(lines[i])) !== null) {
        issues.push({
          file,
          line: i + 1,
          column: match.index + 1,
          matched: match[0],
          context: lines[i],
          rule: 'fabricated-green-heart',
          severity: 'warning',
          message: 'The 💚 emoji appears to be injected via CSS ::before/::after content. Consider using real, accessible content in the HTML instead of fabricating it through CSS.',
          suggestion: 'Move the 💚 into the HTML content so it is accessible to screen readers',
          autoFixable: false,
        });
      }
    }

    return issues;
  },
};
