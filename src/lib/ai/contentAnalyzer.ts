
// Enhanced AI content analyzer - Uses simulated NLP techniques
import { ContentCategory } from '@/lib/mock-data';

// Expanded harmful keywords to detect
const HARMFUL_KEYWORDS = {
  hate_speech: [
    'hate', 'racist', 'racism', 'discrimination', 'bigot', 'bigotry', 'sexist', 'homophobic',
    'prejudice', 'xenophobia', 'islamophobia', 'antisemitism', 'bigoted', 'supremacist', 'nazi',
    'whites', 'blacks', 'jews', 'muslims', 'immigrants', 'foreigners', 'ethnics', 'slur', 'derogatory',
    'offensive', 'intolerant', 'abusive', 'nigger', 'kike', 'spic', 'chink', 'wetback', 'raghead',
    'towelhead', 'allah akbar', 'genocide', 'ethnic cleansing', 'white power', 'black power', 'segregation',
    'apartheid', 'prejudiced', 'stereotyping', 'stereotypical', 'stereotype', 'bias', 'biased', 'hater',
    'misogyny', 'misogynist', 'misandry', 'sexist', 'transphobic', 'homophobic', 'queerphobic', 'biphobic',
    'ageist', 'ableist', 'classist', 'elitist', 'nationalist', 'fascist', 'nazi', 'neo-nazi', 'kkk',
    'white supremacy', 'black supremacy', 'religious hatred', 'racial hatred', 'racial profiling', 
    'oppression', 'oppressive', 'subjugation', 'marginalization', 'prejudicial', 'discriminatory',
    'segregationist', 'supremacy', 'superiority', 'inferior', 'subhuman', 'dehumanize', 'dehumanizing',
    'othering', 'us versus them', 'purge', 'purification', 'racial purity', 'pure race', 'mongrel',
    'halfbreed', 'mulatto', 'miscegeny', 'race traitor', 'race mixing', 'cultural marxism',
    'replacement theory', 'white genocide', 'great replacement', 'jewish question', 'jewish conspiracy'
  ],
  
  violence: [
    'kill', 'attack', 'hurt', 'violent', 'bomb', 'shoot', 'assault', 'death', 'murder',
    'aggression', 'intimidation', 'brutality', 'bloodshed', 'slaughter', 'massacre', 'carnage',
    'butchery', 'gore', 'warfare', 'combat', 'fight', 'battle', 'skirmish', 'riot', 'insurrection',
    'rebellion', 'revolt', 'revolution', 'coup', 'overthrow', 'terrorism', 'terrorist', 'militants',
    'guerrilla', 'insurgent', 'extremist', 'radical', 'fundamentalist', 'jihadist', 'martyr',
    'kamikaze', 'suicide bomber', 'bombing', 'explosion', 'detonate', 'blow up', 'gunfire',
    'shooting', 'sniper', 'gunman', 'shooter', 'assassin', 'hitman', 'mercenary', 'militant',
    'soldier', 'warrior', 'fighter', 'brawler', 'thug', 'gangster', 'mobster', 'criminal',
    'felon', 'outlaw', 'bandit', 'pirate', 'hijacker', 'kidnapper', 'abductor', 'hostage',
    'captive', 'prisoner', 'detainee', 'inmate', 'convict', 'offender', 'perpetrator',
    'assailant', 'aggressor', 'attacker', 'assaulter', 'mugger', 'robber', 'burglar',
    'looter', 'vandal', 'arsonist', 'pyromaniac', 'saboteur', 'anarchist', 'chaos',
    'mayhem', 'pandemonium', 'havoc', 'destruction', 'devastation', 'annihilation'
  ],
  
  harassment: [
    'harass', 'stalking', 'bully', 'bullying', 'threaten', 'intimidate', 'doxx',
    'vexation', 'aggravation', 'annoyance', 'pestering', 'badgering', 'bothering',
    'hassling', 'hounding', 'plaguing', 'tormenting', 'disturbing', 'molesting',
    'provoking', 'agitating', 'irritating', 'exasperating', 'perturbing', 'cyberbullying',
    'trolling', 'flaming', 'griefing', 'baiting', 'catfishing', 'mobbing', 'dogpiling',
    'pile-on', 'gang-up', 'witch hunt', 'cancel', 'cancelling', 'shaming', 'humiliating',
    'embarrassing', 'mocking', 'ridiculing', 'belittling', 'demeaning', 'degrading',
    'unwanted', 'unwelcome', 'uninvited', 'intrusive', 'invasive', 'boundary',
    'boundaries', 'consent', 'nonconsensual', 'follow', 'following', 'stalk', 'spy',
    'spying', 'monitor', 'monitoring', 'track', 'tracking', 'surveilling', 'surveillance',
    'watching', 'leering', 'ogling', 'staring', 'gawking', 'lurking', 'creeping',
    'shadowing', 'pursuing', 'chasing', 'hunting', 'preying', 'prowling',
    'intimidation', 'coercion', 'blackmail', 'extortion', 'threats', 'menacing',
    'terrorizing', 'frightening', 'scaring', 'alarming', 'panic', 'distress',
    'obsessive', 'fixated', 'infatuated', 'enamored', 'lovesick', 'smitten',
    'restraining order', 'no contact', 'cease and desist', 'distance', 'avoidance'
  ],
  
  misinformation: [
    'fake news', 'conspiracy', 'hoax', 'misinformation', 'disinformation', 'propaganda',
    'lie', 'falsehood', 'fabrication', 'deception', 'fraud', 'trick', 'myth',
    'rumor', 'gossip', 'hearsay', 'speculation', 'conjecture', 'assumption',
    'distortion', 'misrepresentation', 'exaggeration', 'hyperbole', 'embellishment', 
    'spin', 'slant', 'bias', 'prejudice', 'untruth', 'scam', 'sham', 'pretense',
    'charade', 'facade', 'cover-up', 'plot', 'scheme', 'collusion', 'cabal', 
    'frame-up', 'setup', 'sting', 'ruse', 'ploy', 'gimmick', 'stunt', 'trickery',
    'deceit', 'duplicity', 'treachery', 'betrayal', 'double-dealing', 'two-faced',
    'hypocrisy', 'manipulation', 'brainwashing', 'indoctrination', 'gaslighting',
    'mislead', 'delude', 'deceive', 'fool', 'dupe', 'hoodwink', 'bamboozle',
    'con', 'swindle', 'cheat', 'bluff', 'feint', 'dodge', 'evasion', 'sidestep',
    'misdirection', 'diversion', 'distraction', 'red herring', 'smokescreen',
    'camouflage', 'disguise', 'mask', 'veil', 'cloak', 'shroud', 'obscure',
    'cloud', 'fog', 'haze', 'murk', 'confusion', 'bewilderment', 'perplexity'
  ],
  
  scam: [
    'scam', 'fraud', 'free money', 'get rich quick', 'pyramid scheme', 'ponzi', 'crypto scam',
    'swindle', 'con', 'deceit', 'cheat', 'forgery', 'giveaway', 'lottery win',
    'inheritance', 'instant wealth', 'miracle investment', 'multi-level marketing',
    'chain letter', 'phishing', 'spoofing', 'malware', 'dupe', 'mark', 'sucker',
    'victim', 'prey', 'target', 'gullible', 'naive', 'trusting', 'credulous',
    'unsuspecting', 'innocent', 'unwary', 'careless', 'reckless', 'rash', 
    'impulsive', 'foolish', 'silly', 'stupid', 'idiotic', 'moronic', 'ludicrous',
    'ridiculous', 'absurd', 'preposterous', 'outrageous', 'unbelievable',
    'implausible', 'doubtful', 'questionable', 'suspicious', 'shady', 'dodgy',
    'sketchy', 'murky', 'unclear', 'vague', 'obscure', 'cryptic', 'mysterious',
    'puzzling', 'confusing', 'bewildering', 'inexplicable', 'incomprehensible',
    'unintelligible', 'chaotic', 'lawless', 'unruly', 'wild', 'untamed', 'rough',
    'tough', 'hard', 'difficult', 'challenging', 'demanding', 'strenuous', 'arduous'
  ],
  
  explicit: [
    'nsfw', 'xxx', 'porn', 'explicit', 'adult content', 'pornographic', 'erotic',
    'obscene', 'lewd', 'lascivious', 'salacious', 'prurient', 'licentious',
    'debauched', 'depraved', 'perverted', 'indecent', 'vulgar', 'crude', 'coarse',
    'raunchy', 'racy', 'naughty', 'dirty', 'filthy', 'smutty', 'nasty', 'gross',
    'disgusting', 'offensive', 'shocking', 'scandalous', 'outrageous', 'provocative',
    'suggestive', 'titillating', 'arousing', 'sensual', 'seductive', 'sexy', 'hot',
    'steamy', 'sultry', 'lustful', 'passionate', 'intimate', 'carnal', 'fleshly',
    'physical', 'bodily', 'sexual', 'mature', 'restricted', 'adult-only', 'X-rated',
    'R-rated', 'unrated', 'uncensored', 'raw', 'unfiltered', 'graphic', 'detailed',
    'vivid', 'hardcore', 'softcore', 'fetish', 'kink', 'BDSM', 'bondage', 'discipline',
    'domination', 'submission', 'sadism', 'masochism', 'taboo', 'forbidden', 'illicit',
    'immoral', 'unethical', 'sinful', 'wicked', 'evil', 'corrupt', 'degenerate',
    'debased', 'perverse', 'twisted', 'sick', 'warped', 'abnormal', 'deviant',
    'unnatural', 'bizarre', 'weird', 'freaky', 'strange', 'odd', 'unusual', 'eccentric'
  ],
};

// Context words that increase the severity when found near harmful words
const CONTEXT_AMPLIFIERS = [
  'very', 'extremely', 'absolutely', 'definitely', 'all', 'every', 'always',
  'must', 'should', 'need to', 'going to', 'will', 'shall'
];

interface AnalysisResult {
  isFlagged: boolean;
  confidence: number;
  category: ContentCategory | null;
  severity: 'low' | 'medium' | 'high';
  modelAccuracy?: number;
  modelName?: string;
}

// Simulated ML model prediction accuracy (would be replaced by real model in production)
const getModelAccuracy = (): number => {
  // Return a realistic accuracy between 85-98%
  return 85 + Math.random() * 13;
};

export const analyzeContent = (content: string): AnalysisResult => {
  if (!content) {
    return {
      isFlagged: false,
      confidence: 0,
      category: null,
      severity: 'low',
      modelAccuracy: 0,
      modelName: "Sentinel Content Moderator v2.4"
    };
  }
  
  const contentLower = content.toLowerCase();
  let flagged = false;
  let category: ContentCategory | null = null;
  let severity: 'low' | 'medium' | 'high' = 'low';
  let confidence = 0;
  let keywordCount = 0;
  let amplifierCount = 0;

  // Check for keywords in each category
  for (const [cat, keywords] of Object.entries(HARMFUL_KEYWORDS)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = contentLower.match(regex);
      
      if (matches && matches.length > 0) {
        flagged = true;
        category = cat as ContentCategory;
        keywordCount += matches.length;
        
        // Check for context amplifiers near the keywords
        for (const amplifier of CONTEXT_AMPLIFIERS) {
          const nearKeywordRegex = new RegExp(`${amplifier}\\s+\\w{0,10}\\s*${keyword}|${keyword}\\s*\\w{0,10}\\s+${amplifier}`, 'gi');
          const amplifierMatches = contentLower.match(nearKeywordRegex);
          
          if (amplifierMatches) {
            amplifierCount += amplifierMatches.length;
          }
        }
        
        // Once we've found matches for this category, no need to check other keywords in it
        break;
      }
    }
    
    // If we've already flagged content in this category, no need to check other categories
    if (flagged) break;
  }
  
  // Calculate severity based on keyword count and presence of amplifiers
  if (keywordCount > 0) {
    if (keywordCount > 2 || amplifierCount > 1) {
      severity = 'high';
      confidence = 0.85 + (keywordCount * 0.02);
    } else if (keywordCount > 1 || amplifierCount > 0) {
      severity = 'medium';
      confidence = 0.70 + (keywordCount * 0.02);
    } else {
      severity = 'low';
      confidence = 0.60;
    }
    
    // Cap confidence at 0.98
    confidence = Math.min(confidence, 0.98);
  }
  
  // Calculate model accuracy (simulated)
  const modelAccuracy = getModelAccuracy();
  
  return {
    isFlagged: flagged,
    confidence: confidence,
    category: category,
    severity: severity,
    modelAccuracy: modelAccuracy,
    modelName: "Sentinel Content Moderator v2.4" // Simulated model name
  };
};
