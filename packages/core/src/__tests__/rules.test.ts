import { lintText, fixText } from '../engine';
import { LintResult } from '../types';

describe('Clean text passes', () => {
  const cleanText = `
# Chime People Development Guide

Our values are Member Obsessed, Be Bold, Win Together, Respect the Rules, and Be an Owner.

This is a challenge we face together. Our team members consistently deliver great results.

According to Smith (2023), feedback improves performance by 30%.

Win Together means: "We hold each other accountable. We ask for open, honest feedback, and Chime In to provide it to others. We believe that clarity is kindness."

This is an area for growth that we can develop together.

The SBI framework helps structure feedback effectively.
  `.trim();

  it('should produce no issues for clean text', () => {
    const result = lintText(cleanText, 'guide.md');
    expect(result.issues).toHaveLength(0);
  });
});

describe('Em dash rule', () => {
  it('should flag em dashes', () => {
    const result = lintText('Use this \u2014 not that', 'test.md');
    const emDashIssues = result.issues.filter(i => i.rule === 'em-dash');
    expect(emDashIssues.length).toBeGreaterThan(0);
    expect(emDashIssues[0].severity).toBe('error');
    expect(emDashIssues[0].autoFixable).toBe(true);
  });

  it('should auto-fix em dashes to en dashes', () => {
    const fixed = fixText('Use this \u2014 not that');
    expect(fixed).toContain('\u2013');
    expect(fixed).not.toContain('\u2014');
  });
});

describe('Struggle rule', () => {
  it('should flag "struggle"', () => {
    const result = lintText('Many people struggle with feedback.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'struggle');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('error');
  });

  it('should auto-fix "struggle" to "challenge"', () => {
    const fixed = fixText('Many people struggle with feedback.');
    expect(fixed).toContain('challenge');
    expect(fixed).not.toMatch(/\bstruggle\b/i);
  });
});

describe('Chime values rule', () => {
  it('should flag misspelled values', () => {
    const result = lintText('Our value is Member Obsesed.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'chime-values');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should not flag correct values', () => {
    const result = lintText('We are Member Obsessed and we Be Bold.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'chime-values');
    expect(issues).toHaveLength(0);
  });
});

describe('Win Together quote rule', () => {
  it('should flag misquoted Win Together text', () => {
    const result = lintText(
      'Win Together: "We hold each other accountable and we work hard together."',
      'test.md'
    );
    const issues = result.issues.filter(i => i.rule === 'win-together-quote');
    expect(issues.length).toBeGreaterThan(0);
  });
});

describe('Proprietary framework rule', () => {
  it('should flag "Chime\'s SBI"', () => {
    const result = lintText("We use Chime's SBI framework for reviews.", 'test.md');
    const issues = result.issues.filter(i => i.rule === 'proprietary-framework');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should flag "our SARA model"', () => {
    const result = lintText('Our SARA model helps with difficult conversations.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'proprietary-framework');
    expect(issues.length).toBeGreaterThan(0);
  });
});

describe('Unattributed stats rule', () => {
  it('should flag "research shows" without citation', () => {
    const result = lintText('Research shows that feedback is important.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'unattributed-stats');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should not flag stats with citations', () => {
    const result = lintText('Research shows (Smith, 2023) that feedback is important.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'unattributed-stats');
    expect(issues).toHaveLength(0);
  });
});

describe('Profanity rule', () => {
  it('should flag profanity', () => {
    const result = lintText('What the hell is going on?', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'profanity');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('error');
  });
});

describe('Identity labels rule', () => {
  it('should flag "rockstars"', () => {
    const result = lintText('Our rockstars delivered this quarter.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'identity-labels');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('warning');
  });

  it('should flag "low performers"', () => {
    const result = lintText('Low performers need extra coaching.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'identity-labels');
    expect(issues.length).toBeGreaterThan(0);
  });
});

describe('Shame framing rule', () => {
  it('should flag "lowest score"', () => {
    const result = lintText('This team had the lowest score in the survey.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'shame-framing');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('warning');
  });
});

describe('Loaded language rule', () => {
  it('should flag "game-changer"', () => {
    const result = lintText('This tool is a game-changer for our team.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'loaded-language');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should flag "killing it"', () => {
    const result = lintText('The sales team is killing it this quarter.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'loaded-language');
    expect(issues.length).toBeGreaterThan(0);
  });
});

describe('Clinical terms rule', () => {
  it('should flag "triggered"', () => {
    const result = lintText('The feedback triggered a strong reaction.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'clinical-terms');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('warning');
  });
});

describe('Hard mode rule', () => {
  it('should flag "Hard Mode"', () => {
    const result = lintText('Try Hard Mode for experienced coaches.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'hard-mode');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should auto-fix "Hard Mode" to "Advanced"', () => {
    const fixed = fixText('Try Hard Mode for experienced coaches.');
    expect(fixed).toContain('Advanced');
  });
});

describe('Level labels rule', () => {
  it('should flag "L3" in prose', () => {
    const result = lintText('This course is designed for L3 individual contributors.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'level-labels');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('info');
  });
});

describe('Smart filtering', () => {
  it('should skip code blocks in markdown', () => {
    const mdText = `
# Guide

\`\`\`js
const struggle = "test"; // em dash — here
\`\`\`

This is clean prose.
    `.trim();
    const result = lintText(mdText, 'test.md');
    expect(result.issues).toHaveLength(0);
  });

  it('should skip inline code in markdown', () => {
    const result = lintText('Use the `struggle` variable for testing.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'struggle');
    expect(issues).toHaveLength(0);
  });

  it('should skip script tags in HTML', () => {
    const html = `
<html>
<body>
<p>Clean text here.</p>
<script>
const struggle = "test";
const dash = "—";
</script>
</body>
</html>
    `.trim();
    const result = lintText(html, 'test.html');
    expect(result.issues).toHaveLength(0);
  });
});

describe('Severity filtering', () => {
  it('should only return errors when severity is "error"', () => {
    const text = 'Our rockstars struggle with em dashes — all the time.';
    const result = lintText(text, 'test.md', { severity: 'error' });
    for (const issue of result.issues) {
      expect(issue.severity).toBe('error');
    }
  });
});

describe('Fix text', () => {
  it('should apply all auto-fixes', () => {
    const text = 'People struggle with em dashes — and Hard Mode is tough.';
    const fixed = fixText(text);
    expect(fixed).not.toContain('\u2014');
    expect(fixed).toContain('\u2013');
    expect(fixed).not.toMatch(/\bstruggle\b/i);
    expect(fixed).toContain('Advanced');
  });
});
