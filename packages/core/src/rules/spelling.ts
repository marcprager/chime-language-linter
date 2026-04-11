import { LintRule, LintIssue } from '../types';

/**
 * Curated dictionary of commonly misspelled words in Chime People Development content.
 * Maps misspelling → correct spelling.
 */
const MISSPELLINGS: Record<string, string> = {
  // Chime-specific terms
  'chimers': 'Chimers',   // lowercase
  'chimer': 'Chimer',
  'workday': 'Workday',   // lowercase when referring to the product
  'chime in': 'Chime In', // the act of providing feedback (Chime value)

  // Chime values misspellings (supplement the chime-values rule with pure typos)
  'memmber obsessed': 'Member Obsessed',
  'memeber obsessed': 'Member Obsessed',
  'member obsesed': 'Member Obsessed',
  'member obssessed': 'Member Obsessed',
  'member obsesssed': 'Member Obsessed',
  'be bolld': 'Be Bold',
  'winn together': 'Win Together',
  'win togther': 'Win Together',
  'win toghether': 'Win Together',
  'win togethr': 'Win Together',
  'repect the rules': 'Respect the Rules',
  'repsect the rules': 'Respect the Rules',
  'respect the ruls': 'Respect the Rules',
  'be an onwer': 'Be an Owner',
  'be an owener': 'Be an Owner',

  // Common business English misspellings
  'accomodate': 'accommodate',
  'acheive': 'achieve',
  'acheiving': 'achieving',
  'achievment': 'achievement',
  'achivement': 'achievement',
  'accross': 'across',
  'agressive': 'aggressive',
  'aknowledge': 'acknowledge',
  'acknowledgement': 'acknowledgment',
  'alot': 'a lot',
  'amoung': 'among',
  'apparant': 'apparent',
  'apparantly': 'apparently',
  'assesment': 'assessment',
  'assesments': 'assessments',
  'assessement': 'assessment',
  'beleive': 'believe',
  'beleives': 'believes',
  'buisness': 'business',
  'busines': 'business',
  'calender': 'calendar',
  'catagory': 'category',
  'collegues': 'colleagues',
  'colleages': 'colleagues',
  'collabarate': 'collaborate',
  'collabaration': 'collaboration',
  'comittee': 'committee',
  'commitee': 'committee',
  'committment': 'commitment',
  'commited': 'committed',
  'comunicate': 'communicate',
  'comunicating': 'communicating',
  'comunication': 'communication',
  'concensus': 'consensus',
  'consistant': 'consistent',
  'consistantly': 'consistently',
  'decison': 'decision',
  'definately': 'definitely',
  'definitly': 'definitely',
  'develope': 'develop',
  'developement': 'development',
  'diligance': 'diligence',
  'dissapoint': 'disappoint',
  'dissappoint': 'disappoint',
  'embarass': 'embarrass',
  'embarras': 'embarrass',
  'employes': 'employees',
  'employess': 'employees',
  'enviroment': 'environment',
  'enviorment': 'environment',
  'excercise': 'exercise',
  'explaination': 'explanation',
  'facillitate': 'facilitate',
  'faciliate': 'facilitate',
  'favourble': 'favorable',
  'favourable': 'favorable',
  'fourty': 'forty',
  'fulfil': 'fulfill',
  'gaurantee': 'guarantee',
  'guidence': 'guidance',
  'guidlines': 'guidelines',
  'harrass': 'harass',
  'harrassment': 'harassment',
  'heirarchy': 'hierarchy',
  'hierachy': 'hierarchy',
  'immediatly': 'immediately',
  'imediately': 'immediately',
  'independant': 'independent',
  'independantly': 'independently',
  'indispensible': 'indispensable',
  'influance': 'influence',
  'interpetation': 'interpretation',
  'knowlege': 'knowledge',
  'knowledgable': 'knowledgeable',
  'liason': 'liaison',
  'liasion': 'liaison',
  'maintainance': 'maintenance',
  'managment': 'management',
  'managable': 'manageable',
  'millenial': 'millennial',
  'millenials': 'millennials',
  'mispelling': 'misspelling',
  'neccessary': 'necessary',
  'necessery': 'necessary',
  'negotitate': 'negotiate',
  'noticable': 'noticeable',
  'occassion': 'occasion',
  'occassionally': 'occasionally',
  'occured': 'occurred',
  'occurence': 'occurrence',
  'oppurtunity': 'opportunity',
  'opprotunity': 'opportunity',
  'oportunity': 'opportunity',
  'organise': 'organize',
  'organisation': 'organization',
  'outpreform': 'outperform',
  'particpate': 'participate',
  'participaton': 'participation',
  'performace': 'performance',
  'performence': 'performance',
  'persue': 'pursue',
  'personnell': 'personnel',
  'personell': 'personnel',
  'posession': 'possession',
  'potental': 'potential',
  'preceed': 'precede',
  'privelege': 'privilege',
  'priveledge': 'privilege',
  'probaly': 'probably',
  'proffesional': 'professional',
  'profesional': 'professional',
  'proficent': 'proficient',
  'progess': 'progress',
  'publically': 'publicly',
  'questionairre': 'questionnaire',
  'questionaire': 'questionnaire',
  'reciept': 'receipt',
  'recieve': 'receive',
  'recieved': 'received',
  'recieving': 'receiving',
  'recomend': 'recommend',
  'recomendation': 'recommendation',
  'refered': 'referred',
  'referance': 'reference',
  'relevent': 'relevant',
  'relavant': 'relevant',
  'rember': 'remember',
  'remmember': 'remember',
  'reponsible': 'responsible',
  'responsibilty': 'responsibility',
  'resourse': 'resource',
  'resourses': 'resources',
  'restaraunt': 'restaurant',
  'reveiw': 'review',
  'rythm': 'rhythm',
  'schdule': 'schedule',
  'seperate': 'separate',
  'seperately': 'separately',
  'sincerely': 'sincerely',
  'strategize': 'strategize',
  'strenght': 'strength',
  'strenghts': 'strengths',
  'succesful': 'successful',
  'successfull': 'successful',
  'sugest': 'suggest',
  'sugestion': 'suggestion',
  'superseede': 'supersede',
  'surreptious': 'surreptitious',
  'sustainble': 'sustainable',
  'targetting': 'targeting',
  'thier': 'their',
  'threshhold': 'threshold',
  'tommorow': 'tomorrow',
  'tommorrow': 'tomorrow',
  'transfered': 'transferred',
  'truely': 'truly',
  'unfortunatly': 'unfortunately',
  'untill': 'until',
  'visability': 'visibility',
  'vulnerble': 'vulnerable',
  'wierd': 'weird',
  'wether': 'whether',
  'wich': 'which',
  'writting': 'writing',

  // HR / People-specific terms
  'onboading': 'onboarding',
  'onbording': 'onboarding',
  'offboading': 'offboarding',
  'feedbck': 'feedback',
  'feedack': 'feedback',
  'peformance': 'performance',
  'compesation': 'compensation',
  'compensaton': 'compensation',
  'attrition': 'attrition',
  'retenton': 'retention',
  'retetion': 'retention',
  'engagment': 'engagement',
  'engagament': 'engagement',
  'stakeholer': 'stakeholder',
  'stakehoder': 'stakeholder',
  'accountablity': 'accountability',
  'accountabilty': 'accountability',
  'transparancy': 'transparency',
  'transparencey': 'transparency',
  'mentorsip': 'mentorship',
  'mentorsihp': 'mentorship',
  'competancy': 'competency',
  'competancies': 'competencies',
};

// Build a case-insensitive lookup map
const LOOKUP = new Map<string, string>();
for (const [wrong, right] of Object.entries(MISSPELLINGS)) {
  LOOKUP.set(wrong.toLowerCase(), right);
}

// Build regex pattern from all misspelled words, sorted longest-first to avoid partial matches
const sortedWords = Object.keys(MISSPELLINGS).sort((a, b) => b.length - a.length);
const PATTERN = new RegExp(
  `\\b(${sortedWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'gi',
);

export const spellingRule: LintRule = {
  name: 'spelling',
  severity: 'error',
  description: 'Catches common misspellings in Chime People Development content',
  check(text, file) {
    const issues: LintIssue[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      PATTERN.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = PATTERN.exec(lines[i])) !== null) {
        const wrong = match[1];
        const correct = LOOKUP.get(wrong.toLowerCase());
        if (!correct) continue;

        // Skip if the text already matches the correct spelling exactly
        if (wrong === correct) continue;

        issues.push({
          file,
          line: i + 1,
          column: match.index + 1,
          matched: wrong,
          context: lines[i],
          rule: 'spelling',
          severity: 'error',
          message: `"${wrong}" appears to be misspelled. Did you mean "${correct}"?`,
          suggestion: `Replace with "${correct}"`,
          autoFixable: true,
        });
      }
    }

    return issues;
  },
  fix(text) {
    return text.replace(PATTERN, (match) => {
      const correct = LOOKUP.get(match.toLowerCase());
      return correct || match;
    });
  },
};
