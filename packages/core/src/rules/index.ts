import { LintRule } from '../types';
import { emDashRule } from './em-dash';
import { struggleRule } from './struggle';
import { chimeValuesRule } from './chime-values';
import { winTogetherQuoteRule } from './win-together-quote';
import { proprietaryFrameworkRule } from './proprietary-framework';
import { unattributedStatsRule } from './unattributed-stats';
import { profanityRule } from './profanity';
import { identityLabelsRule } from './identity-labels';
import { shameFramingRule } from './shame-framing';
import { loadedLanguageRule } from './loaded-language';
import { clinicalTermsRule } from './clinical-terms';
import { hardModeRule } from './hard-mode';
import { fabricatedGreenHeartRule } from './fabricated-green-heart';
import { levelLabelsRule } from './level-labels';
import { passiveHedgingRule } from './passive-hedging';
import { absoluteLanguageRule } from './absolute-language';
import { genderedDefaultsRule } from './gendered-defaults';
import { ableistLanguageRule } from './ableist-language';
import { corporateJargonRule } from './corporate-jargon';
import { fillerPhrasesRule } from './filler-phrases';
import { nicenessFramingRule } from './niceness-framing';
import { feedbackSandwichRule } from './feedback-sandwich';
import { overclaimingRule } from './overclaiming';

export const allRules: LintRule[] = [
  emDashRule,
  struggleRule,
  chimeValuesRule,
  winTogetherQuoteRule,
  proprietaryFrameworkRule,
  unattributedStatsRule,
  profanityRule,
  identityLabelsRule,
  shameFramingRule,
  loadedLanguageRule,
  clinicalTermsRule,
  hardModeRule,
  fabricatedGreenHeartRule,
  levelLabelsRule,
  passiveHedgingRule,
  absoluteLanguageRule,
  genderedDefaultsRule,
  ableistLanguageRule,
  corporateJargonRule,
  fillerPhrasesRule,
  nicenessFramingRule,
  feedbackSandwichRule,
  overclaimingRule,
];

export {
  emDashRule,
  struggleRule,
  chimeValuesRule,
  winTogetherQuoteRule,
  proprietaryFrameworkRule,
  unattributedStatsRule,
  profanityRule,
  identityLabelsRule,
  shameFramingRule,
  loadedLanguageRule,
  clinicalTermsRule,
  hardModeRule,
  fabricatedGreenHeartRule,
  levelLabelsRule,
  passiveHedgingRule,
  absoluteLanguageRule,
  genderedDefaultsRule,
  ableistLanguageRule,
  corporateJargonRule,
  fillerPhrasesRule,
  nicenessFramingRule,
  feedbackSandwichRule,
  overclaimingRule,
};
