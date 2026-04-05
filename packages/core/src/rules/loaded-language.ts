import { LintRule, LintIssue } from '../types';

const LOADED_TERMS: Array<{ regex: RegExp; term: string; replacement: string; suggestion: string }> = [
  {
    regex: /\baddiction\b/gi,
    term: 'addiction',
    replacement: 'strong preference',
    suggestion: "Consider replacing 'addiction' with more measured language like 'strong preference' or 'habit'",
  },
  {
    regex: /\baddictive\b/gi,
    term: 'addictive',
    replacement: 'compelling',
    suggestion: "Consider replacing 'addictive' with 'compelling' or 'engaging'",
  },
  {
    regex: /\bsecret\s+weapon\b/gi,
    term: 'secret weapon',
    replacement: 'key strength',
    suggestion: "Consider replacing 'secret weapon' with 'key strength' or 'differentiator'",
  },
  {
    regex: /\bgame[\s-]?changer\b/gi,
    term: 'game-changer',
    replacement: 'breakthrough',
    suggestion: "Consider replacing 'game-changer' with 'significant improvement' or 'meaningful shift'",
  },
  {
    regex: /\brevolutionary\b/gi,
    term: 'revolutionary',
    replacement: 'innovative',
    suggestion: "Consider replacing 'revolutionary' with 'innovative' or 'significant'",
  },
  {
    regex: /\bcrushing\s+it\b/gi,
    term: 'crushing it',
    replacement: 'excelling',
    suggestion: "Consider replacing 'crushing it' with 'excelling' or 'delivering strong results'",
  },
  {
    regex: /\bkilling\s+it\b/gi,
    term: 'killing it',
    replacement: 'excelling',
    suggestion: "Consider replacing 'killing it' with 'excelling' or 'delivering strong results'",
  },
];

export const loadedLanguageRule: LintRule = {
  name: 'loaded-language',
  severity: 'warning',
  description: 'Avoid hyperbolic or loaded language; use precise, measured terms instead',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      for (const { regex, suggestion } of LOADED_TERMS) {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(lines[i])) !== null) {
          issues.push({
            file,
            line: i + 1,
            column: match.index + 1,
            matched: match[0],
            context: lines[i],
            rule: 'loaded-language',
            severity: 'warning',
            message: suggestion,
            suggestion,
            autoFixable: true,
          });
        }
      }
    }

    return issues;
  },
  fix(text) {
    let result = text;
    for (const { regex, replacement } of LOADED_TERMS) {
      result = result.replace(regex, replacement);
    }
    return result;
  },
};
