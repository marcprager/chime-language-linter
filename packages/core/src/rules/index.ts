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
};
