const RULE_CATEGORIES: Record<string, string> = {
  'em-dash': 'Style',
  struggle: 'Voice & Tone',
  'chime-values': 'Accuracy',
  'win-together-quote': 'Accuracy',
  'proprietary-framework': 'Accuracy',
  'unattributed-stats': 'Accuracy',
  profanity: 'Voice & Tone',
  'identity-labels': 'Inclusivity',
  'shame-framing': 'Inclusivity',
  'loaded-language': 'Voice & Tone',
  'clinical-terms': 'Voice & Tone',
  'hard-mode': 'Style',
  'fabricated-green-heart': 'Style',
  'level-labels': 'Style',
  'double-dash': 'Style',
  'emoji-density': 'Voice & Tone',
  'absolute-language': 'Voice & Tone',
  'accusatory-framing': 'Voice & Tone',
  'paragraph-length': 'Scannability',
};

const RULE_FRIENDLY_NAMES: Record<string, string> = {
  'em-dash': 'Dash formatting',
  struggle: 'Word choice',
  'chime-values': 'Chime values reference',
  'win-together-quote': 'Win Together quote',
  'proprietary-framework': 'Framework attribution',
  'unattributed-stats': 'Source citation',
  profanity: 'Inappropriate language',
  'identity-labels': 'Identity-first language',
  'shame-framing': 'Growth-oriented framing',
  'loaded-language': 'Measured language',
  'clinical-terms': 'Plain-language alternatives',
  'hard-mode': 'Terminology',
  'fabricated-green-heart': 'Decorative emoji',
  'level-labels': 'Internal terminology',
  'double-dash': 'Dash formatting',
  'emoji-density': 'Emoji density',
  'absolute-language': 'Measured claims',
  'accusatory-framing': 'Growth-oriented framing',
  'paragraph-length': 'Paragraph length',
};

export function getRuleCategory(rule: string): string {
  return RULE_CATEGORIES[rule] ?? 'General';
}

export function getRuleFriendlyName(rule: string): string {
  return RULE_FRIENDLY_NAMES[rule] ?? rule;
}
