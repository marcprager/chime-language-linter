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

The Situation-Behavior-Impact (SBI) framework helps structure feedback effectively.
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

  it('should flag "struggled"', () => {
    const result = lintText('He struggled with the feedback.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'struggle');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should flag "struggling"', () => {
    const result = lintText('She is struggling with delivery.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'struggle');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should auto-fix "struggle" to "challenge"', () => {
    const fixed = fixText('Many people struggle with feedback.');
    expect(fixed).toContain('challenge');
    expect(fixed).not.toMatch(/\bstruggle\b/i);
  });

  it('should auto-fix verb forms of "struggle"', () => {
    expect(fixText('He struggled with it.')).toContain('faced challenges');
    expect(fixText('She is struggling.')).toContain('facing challenges');
    expect(fixText('He struggles daily.')).toContain('challenges');
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

  it('should flag "Winning Together" as incorrect value name', () => {
    const result = lintText('We believe in Winning Together as a team.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'chime-values');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].matched).toContain('Winning Together');
  });

  it('should auto-fix misspelled values', () => {
    const fixed = fixText('We are Member Obsesed.');
    expect(fixed).toContain('Member Obsessed');
  });

  it('should auto-fix "Winning Together" to "Win Together"', () => {
    const fixed = fixText('We believe in Winning Together.');
    expect(fixed).toContain('Win Together');
    expect(fixed).not.toContain('Winning Together');
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

  it('should flag misquoted Win Together text with indirect attribution', () => {
    const result = lintText(
      'As our Win Together value says, \u201CWe believe clarity is kindness.\u201D',
      'test.md'
    );
    const issues = result.issues.filter(i => i.rule === 'win-together-quote');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should auto-fix misquoted Win Together text', () => {
    const fixed = fixText('Win Together: \u201CWe believe clarity is kindness.\u201D');
    expect(fixed).toContain('We hold each other accountable');
    expect(fixed).toContain('to others');
    expect(fixed).toContain('that clarity is kindness');
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

  it('should flag "gamechanger" without separator', () => {
    const result = lintText('This is a total gamechanger.', 'test.md');
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

  it('should flag hyphenated "Hard-Mode"', () => {
    const result = lintText('Try Hard-Mode for experienced coaches.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'hard-mode');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should auto-fix "Hard Mode" to "Advanced"', () => {
    const fixed = fixText('Try Hard Mode for experienced coaches.');
    expect(fixed).toContain('Advanced');
  });

  it('should preserve all-caps: "HARD MODE" to "ADVANCED"', () => {
    const fixed = fixText('HARD MODE');
    expect(fixed).toBe('ADVANCED');
  });
});

describe('Fabricated green heart rule', () => {
  it('should flag 💚 in CSS content property', () => {
    const css = `.badge::before { content: '💚 Approved'; }`;
    const result = lintText(css, 'test.css');
    const issues = result.issues.filter(i => i.rule === 'fabricated-green-heart');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('warning');
  });

  it('should not flag 💚 in HTML text', () => {
    const result = lintText('<p>We love 💚 Chime!</p>', 'test.html');
    const issues = result.issues.filter(i => i.rule === 'fabricated-green-heart');
    expect(issues).toHaveLength(0);
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
    const text = 'People struggle with em dashes \u2014 and Hard Mode is tough.';
    const fixed = fixText(text);
    expect(fixed).not.toContain('\u2014');
    expect(fixed).toContain('\u2013');
    expect(fixed).not.toMatch(/\bstruggle\b/i);
    expect(fixed).toContain('Advanced');
  });
});

describe('Integration: full sample text', () => {
  const sampleText = [
    'Welcome to Chime\u2019s Feedback Foundations Course',
    '',
    'At Chime, we believe in being Member Obsesed and Winning Together as a team.',
    'As our Win Together value says, "We hold each other accountable.',
    'We ask for open, honest feedback, and Chime In to provide it.',
    'We believe clarity is kindness."',
  ].join('\n');

  it('should detect misspelled "Member Obsesed"', () => {
    const result = lintText(sampleText, 'test.md');
    const issues = result.issues.filter(i => i.rule === 'chime-values');
    const obsesedIssue = issues.find(i => i.matched.includes('Obsesed'));
    expect(obsesedIssue).toBeDefined();
  });

  it('should detect "Winning Together" as incorrect value', () => {
    const result = lintText(sampleText, 'test.md');
    const issues = result.issues.filter(i => i.rule === 'chime-values');
    const winningIssue = issues.find(i => i.matched.includes('Winning'));
    expect(winningIssue).toBeDefined();
  });

  it('should detect misquoted Win Together text', () => {
    const result = lintText(sampleText, 'test.md');
    const issues = result.issues.filter(i => i.rule === 'win-together-quote');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should fix all issues in sample text', () => {
    const fixed = fixText(sampleText);
    expect(fixed).toContain('Member Obsessed');
    expect(fixed).not.toContain('Winning Together');
    expect(fixed).toContain('Win Together');
  });
});

describe('Chime values edge cases', () => {
  it('should not flag correct values with surrounding punctuation', () => {
    const result = lintText('Values: "Member Obsessed," "Be Bold," and "Win Together."', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'chime-values');
    expect(issues).toHaveLength(0);
  });

  it('should flag "Being Bold" as variant of "Be Bold"', () => {
    const result = lintText('We encourage Being Bold in all decisions.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'chime-values');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should flag "Respecting the Rules" as variant', () => {
    const result = lintText('Respecting the Rules is important to us.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'chime-values');
    expect(issues.length).toBeGreaterThan(0);
  });
});

describe('Double dash rule', () => {
  it('should flag double hyphens', () => {
    const result = lintText('Use this -- not that.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'double-dash');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('error');
    expect(issues[0].autoFixable).toBe(true);
  });

  it('should auto-fix double hyphens to en dashes', () => {
    const fixed = fixText('Use this -- not that.');
    expect(fixed).toContain('\u2013');
    expect(fixed).not.toContain('--');
  });

  it('should not flag triple hyphens (markdown hr)', () => {
    const result = lintText('---', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'double-dash');
    expect(issues).toHaveLength(0);
  });
});

describe('Emoji density rule', () => {
  it('should flag lines with 3+ emojis', () => {
    const result = lintText('\uD83C\uDF1F Week 1: Welcome \uD83D\uDC4B\uD83D\uDE4C', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'emoji-density');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('warning');
  });

  it('should not flag lines with 1-2 emojis', () => {
    const result = lintText('Great work \uD83D\uDC4D', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'emoji-density');
    expect(issues).toHaveLength(0);
  });
});

describe('Absolute language rule', () => {
  it('should flag "across every function"', () => {
    const result = lintText('This was heard across every function.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'absolute-language');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('info');
  });

  it('should flag "the single most"', () => {
    const result = lintText('This is the single most important signal.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'absolute-language');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should flag "everyone knows"', () => {
    const result = lintText('Everyone knows this is a problem.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'absolute-language');
    expect(issues.length).toBeGreaterThan(0);
  });
});

describe('Accusatory framing rule', () => {
  it('should flag "culture of niceness"', () => {
    const result = lintText('Chime has a culture of niceness that prevents candor.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'accusatory-framing');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('warning');
  });

  it('should flag "starts at the top"', () => {
    const result = lintText('Inconsistency starts at the top.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'accusatory-framing');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should flag "values eroded"', () => {
    const result = lintText('Values have eroded since the IPO.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'accusatory-framing');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should flag "too nice"', () => {
    const result = lintText('We are too nice to give honest feedback.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'accusatory-framing');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should flag "more mercenary"', () => {
    const result = lintText('The culture has become more mercenary.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'accusatory-framing');
    expect(issues.length).toBeGreaterThan(0);
  });

  it('should not flag growth-oriented language', () => {
    const result = lintText('Leader consistency sets the tone for the organization.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'accusatory-framing');
    expect(issues).toHaveLength(0);
  });
});

describe('Paragraph length rule', () => {
  it('should flag very long paragraphs', () => {
    const longPara = 'Managers are promoted without any formal training or structured onboarding. They figure it out on their own, often with limited guidance. The gap shows up in feedback quality, accountability, and career conversations. Performance management is inconsistent across the organization. Career conversations happen based on who your manager is, not because the system expects them. Performance accountability drifts without any mid-cycle structure to hold the bar. The result is a system that works well for some people and not at all for others.';
    const result = lintText(longPara, 'test.md');
    const issues = result.issues.filter(i => i.rule === 'paragraph-length');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('info');
  });

  it('should not flag short paragraphs', () => {
    const result = lintText('This is a short paragraph. Just two sentences.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'paragraph-length');
    expect(issues).toHaveLength(0);
  });
});

describe('Spelling rule', () => {
  it('should flag common misspellings', () => {
    const result = lintText('We recieved the assesment results.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'spelling');
    expect(issues.length).toBeGreaterThanOrEqual(2);
    expect(issues[0].severity).toBe('error');
    expect(issues[0].autoFixable).toBe(true);
  });

  it('should flag Chime-specific misspellings', () => {
    const result = lintText('Risk chimers score 62% on the survey.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'spelling');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].matched).toBe('chimers');
  });

  it('should auto-fix misspellings', () => {
    const fixed = fixText('We recieved the feedbck from a stakeholer.');
    expect(fixed).toContain('received');
    expect(fixed).toContain('feedback');
    expect(fixed).toContain('stakeholder');
  });

  it('should not flag correctly spelled words', () => {
    const result = lintText('We received the assessment results from Chimers.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'spelling');
    expect(issues).toHaveLength(0);
  });
});

describe('Jargon rule', () => {
  it('should flag undefined acronyms', () => {
    const result = lintText('For Risk LT review, the ICs need guidance.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'jargon');
    expect(issues.length).toBeGreaterThanOrEqual(2);
    expect(issues[0].severity).toBe('info');
  });

  it('should flag corporate jargon', () => {
    const result = lintText('We need to leverage our bandwidth for this sync.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'jargon');
    expect(issues.length).toBeGreaterThanOrEqual(2);
  });

  it('should not flag acronyms already defined in parentheses', () => {
    const result = lintText('The Situation-Behavior-Impact (SBI) framework is useful.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'jargon');
    expect(issues).toHaveLength(0);
  });

  it('should only flag the first occurrence of each term', () => {
    const result = lintText('The LT met Monday. The LT met again Friday.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'jargon');
    const ltIssues = issues.filter(i => i.matched === 'LT');
    expect(ltIssues).toHaveLength(1);
  });
});

describe('Passive voice rule', () => {
  it('should flag passive constructions', () => {
    const result = lintText('It was decided that feedback should be addressed.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'passive-voice');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].severity).toBe('info');
  });

  it('should flag ownership-obscuring patterns', () => {
    const result = lintText('Feedback was provided to the team and needs to be reviewed.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'passive-voice');
    expect(issues.length).toBeGreaterThan(0);
  });
});

describe('Hedge words rule', () => {
  it('should flag hedge words', () => {
    const result = lintText('Perhaps we could consider maybe trying a different approach.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'hedge-words');
    expect(issues.length).toBeGreaterThanOrEqual(2);
    expect(issues[0].severity).toBe('info');
  });

  it('should flag weak qualifiers', () => {
    const result = lintText('I think this is somewhat effective.', 'test.md');
    const issues = result.issues.filter(i => i.rule === 'hedge-words');
    expect(issues.length).toBeGreaterThanOrEqual(2);
  });
});
