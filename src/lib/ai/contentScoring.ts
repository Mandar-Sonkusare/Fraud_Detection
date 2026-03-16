// Content scoring system with subclusters for severity analysis
import { ContentCategory } from '@/lib/mock-data';

// Define subclusters for each harmful category with severity scores
export const SUBCLUSTERS = {
  hate_speech: {
    extreme: {
      keywords: [
        'genocide', 'ethnic cleansing', 'nazi', 'supremacist', 'racial purity', 
        'pure race', 'subhuman', 'dehumanize', 'racial hatred', 'white genocide', 
        'nigger', 'kike', 'spic', 'chink', 'wetback', 'raghead', 'towelhead',
        'great replacement', 'jewish question', 'jewish conspiracy'
      ],
      score: -1.0
    },
    severe: {
      keywords: [
        'hate', 'racist', 'racism', 'bigot', 'bigotry', 'sexist', 'homophobic',
        'antisemitism', 'islamophobia', 'xenophobia', 'white supremacy', 'black supremacy',
        'prejudice', 'discrimination', 'intolerant', 'abusive', 'white power', 'black power',
        'segregation', 'apartheid', 'race traitor', 'race mixing', 'cultural marxism',
        'replacement theory'
      ],
      score: -0.75
    },
    moderate: {
      keywords: [
        'prejudiced', 'stereotyping', 'stereotypical', 'stereotype', 'bias', 'biased', 'hater',
        'misogyny', 'misogynist', 'misandry', 'transphobic', 'queerphobic', 'biphobic',
        'ageist', 'ableist', 'classist', 'elitist', 'nationalist', 'fascist', 'neo-nazi', 'kkk',
        'religious hatred', 'racial profiling', 'oppression', 'oppressive'
      ],
      score: -0.5
    },
    mild: {
      keywords: [
        'subjugation', 'marginalization', 'prejudicial', 'discriminatory',
        'segregationist', 'supremacy', 'superiority', 'inferior', 
        'dehumanizing', 'othering', 'us versus them', 'purge', 'purification',
        'mongrel', 'halfbreed', 'mulatto', 'miscegeny', 'whites', 'blacks', 
        'jews', 'muslims', 'immigrants', 'foreigners', 'ethnics', 'slur', 'derogatory',
        'offensive', 'allah akbar'
      ],
      score: -0.25
    }
  },
  
  violence: {
    extreme: {
      keywords: [
        'kill', 'murder', 'slaughter', 'massacre', 'carnage', 'butchery', 
        'terrorism', 'terrorist', 'suicide bomber', 'bombing', 'explosion', 'detonate', 
        'blow up', 'shooting', 'sniper', 'gunman', 'shooter', 'assassin', 'death',
        'annihilation', 'overthrow', 'gunfire'
      ],
      score: -1.0
    },
    severe: {
      keywords: [
        'attack', 'hurt', 'violent', 'bomb', 'shoot', 'assault', 
        'bloodshed', 'gore', 'warfare', 'combat', 'fight', 'battle', 
        'insurrection', 'rebellion', 'revolt', 'revolution', 'coup',
        'militants', 'guerrilla', 'insurgent', 'extremist', 'radical', 
        'fundamentalist', 'jihadist', 'martyr', 'kamikaze'
      ],
      score: -0.75
    },
    moderate: {
      keywords: [
        'aggression', 'intimidation', 'brutality', 'skirmish', 'riot', 
        'hitman', 'mercenary', 'militant', 'soldier', 'warrior', 'fighter', 
        'brawler', 'thug', 'gangster', 'mobster', 'criminal', 'felon', 'outlaw', 
        'bandit', 'pirate', 'hijacker', 'kidnapper', 'abductor', 'hostage',
        'captive', 'prisoner', 'detainee', 'inmate', 'convict', 'offender'
      ],
      score: -0.5
    },
    mild: {
      keywords: [
        'perpetrator', 'assailant', 'aggressor', 'attacker', 'assaulter', 
        'mugger', 'robber', 'burglar', 'looter', 'vandal', 'arsonist', 
        'pyromaniac', 'saboteur', 'anarchist', 'chaos', 'mayhem', 'pandemonium', 
        'havoc', 'destruction', 'devastation'
      ],
      score: -0.25
    }
  },
  
  harassment: {
    extreme: {
      keywords: [
        'harass', 'stalking', 'bully', 'cyberbullying', 'doxx',
        'restraining order', 'no contact', 'cease and desist', 
        'intimidation', 'coercion', 'blackmail', 'extortion', 'threats', 
        'terrorizing', 'molesting', 'obsessive', 'fixated'
      ],
      score: -1.0
    },
    severe: {
      keywords: [
        'bullying', 'threaten', 'intimidate', 'trolling', 'flaming', 
        'griefing', 'baiting', 'catfishing', 'mobbing', 'dogpiling',
        'pile-on', 'gang-up', 'witch hunt', 'cancel', 'cancelling', 
        'menacing', 'frightening', 'scaring', 'alarming', 'panic', 'distress'
      ],
      score: -0.75
    },
    moderate: {
      keywords: [
        'vexation', 'aggravation', 'annoyance', 'pestering', 'badgering', 
        'bothering', 'hassling', 'hounding', 'plaguing', 'tormenting', 
        'disturbing', 'provoking', 'agitating', 'irritating', 'exasperating', 
        'perturbing', 'shaming', 'humiliating', 'embarrassing', 'mocking', 
        'ridiculing', 'belittling', 'demeaning', 'degrading'
      ],
      score: -0.5
    },
    mild: {
      keywords: [
        'unwanted', 'unwelcome', 'uninvited', 'intrusive', 'invasive', 
        'boundary', 'boundaries', 'consent', 'nonconsensual', 'follow', 
        'following', 'stalk', 'spy', 'spying', 'monitor', 'monitoring', 
        'track', 'tracking', 'surveilling', 'surveillance', 'watching', 
        'leering', 'ogling', 'staring', 'gawking', 'lurking', 'creeping',
        'shadowing', 'pursuing', 'chasing', 'hunting', 'preying', 'prowling',
        'infatuated', 'enamored', 'lovesick', 'smitten', 'distance', 'avoidance'
      ],
      score: -0.25
    }
  },
  
  misinformation: {
    extreme: {
      keywords: [
        'fake news', 'conspiracy', 'hoax', 'misinformation', 'disinformation', 'propaganda',
        'lie', 'falsehood', 'fabrication', 'deception', 'fraud', 'cover-up',
        'collusion', 'cabal', 'frame-up', 'setup'
      ],
      score: -1.0
    },
    severe: {
      keywords: [
        'trick', 'myth', 'rumor', 'gossip', 'hearsay', 'distortion', 
        'misrepresentation', 'exaggeration', 'hyperbole', 'embellishment', 
        'spin', 'slant', 'bias', 'prejudice', 'untruth', 'sham',
        'charade', 'facade', 'plot', 'scheme'
      ],
      score: -0.75
    },
    moderate: {
      keywords: [
        'pretense', 'sting', 'ruse', 'ploy', 'gimmick', 'stunt', 'trickery',
        'deceit', 'duplicity', 'treachery', 'betrayal', 'double-dealing', 'two-faced',
        'hypocrisy', 'manipulation', 'brainwashing', 'indoctrination', 'gaslighting',
        'mislead', 'delude', 'deceive', 'fool', 'dupe', 'hoodwink', 'bamboozle'
      ],
      score: -0.5
    },
    mild: {
      keywords: [
        'con', 'swindle', 'cheat', 'bluff', 'feint', 'dodge', 'evasion', 'sidestep',
        'misdirection', 'diversion', 'distraction', 'red herring', 'smokescreen',
        'camouflage', 'disguise', 'mask', 'veil', 'cloak', 'shroud', 'obscure',
        'cloud', 'fog', 'haze', 'murk', 'confusion', 'bewilderment', 'perplexity',
        'speculation', 'conjecture', 'assumption'
      ],
      score: -0.25
    }
  },
  
  scam: {
    extreme: {
      keywords: [
        'scam', 'fraud', 'free money', 'get rich quick', 'pyramid scheme', 'ponzi', 'crypto scam',
        'swindle', 'con', 'inheritance', 'instant wealth', 'miracle investment', 'phishing',
        'spoofing', 'malware'
      ],
      score: -1.0
    },
    severe: {
      keywords: [
        'deceit', 'cheat', 'forgery', 'giveaway', 'lottery win', 'multi-level marketing',
        'chain letter', 'victim', 'prey', 'target', 'gullible', 'naive', 'trusting', 'credulous',
        'unsuspecting', 'innocent', 'unwary'
      ],
      score: -0.75
    },
    moderate: {
      keywords: [
        'careless', 'reckless', 'rash', 'impulsive', 'foolish', 'silly', 'stupid', 'idiotic', 
        'moronic', 'ludicrous', 'ridiculous', 'absurd', 'preposterous', 'outrageous',
        'dupe', 'mark', 'sucker'
      ],
      score: -0.5
    },
    mild: {
      keywords: [
        'provocative', 'suggestive', 'titillating', 'arousing', 'sensual', 'seductive', 'sexy', 'hot',
        'steamy', 'sultry', 'lustful', 'passionate', 'intimate', 'carnal', 'fleshly',
        'physical', 'bodily', 'sexual', 'mature', 'restricted', 'adult-only', 'X-rated',
        'R-rated', 'unrated', 'uncensored', 'raw', 'unfiltered', 'graphic', 'detailed',
        'vivid', 'hardcore', 'softcore', 'taboo', 'forbidden', 'illicit', 'immoral', 'unethical',
        'sinful', 'wicked', 'evil', 'corrupt', 'degenerate', 'bizarre', 'weird', 'freaky',
        'strange', 'odd', 'unusual', 'eccentric', 'fetish', 'kink', 'BDSM', 'bondage', 'discipline',
        'domination', 'submission', 'sadism', 'masochism'
      ],
      score: -0.25
    }
  },
  
  explicit: {
    extreme: {
      keywords: [
        'nsfw', 'xxx', 'porn', 'explicit', 'adult content', 'pornographic', 'erotic',
        'obscene', 'hardcore', 'softcore', 'fetish', 'kink', 'BDSM', 'bondage', 'discipline',
        'domination', 'submission', 'sadism', 'masochism'
      ],
      score: -1.0
    },
    severe: {
      keywords: [
        'lewd', 'lascivious', 'salacious', 'prurient', 'licentious',
        'debauched', 'depraved', 'perverted', 'indecent', 'vulgar', 'crude', 'coarse',
        'raunchy', 'racy', 'naughty', 'dirty', 'filthy', 'smutty', 'nasty', 'gross'
      ],
      score: -0.75
    },
    moderate: {
      keywords: [
        'disgusting', 'offensive', 'shocking', 'scandalous', 'outrageous', 'provocative',
        'suggestive', 'titillating', 'arousing', 'sensual', 'seductive', 'sexy', 'hot',
        'steamy', 'sultry', 'lustful', 'passionate', 'intimate', 'taboo', 'forbidden',
      ],
      score: -0.5
    },
    mild: {
      keywords: [
        'carnal', 'fleshly', 'physical', 'bodily', 'sexual', 'mature', 'restricted', 
        'adult-only', 'X-rated', 'R-rated', 'unrated', 'uncensored', 'raw', 'unfiltered', 
        'graphic', 'detailed', 'vivid', 'illicit', 'immoral', 'unethical', 'sinful', 
        'wicked', 'evil', 'corrupt', 'degenerate', 'debased', 'perverse', 'twisted', 
        'sick', 'warped', 'abnormal', 'deviant', 'unnatural', 'bizarre', 'weird', 
        'freaky', 'strange', 'odd', 'unusual', 'eccentric'
      ],
      score: -0.25
    }
  }
};

// Calculate severity score for a given text based on detected keywords
export const calculateSeverityScores = (text: string): {
  categoryScores: Record<string, number>;
  subclusterScores: Record<string, Record<string, number>>;
  matchedKeywords: Record<string, Record<string, string[]>>;
  averageScore: number;
} => {
  const contentLower = text.toLowerCase();
  const categoryScores: Record<string, number> = {};
  const subclusterScores: Record<string, Record<string, number>> = {};
  const matchedKeywords: Record<string, Record<string, string[]>> = {};
  let totalScore = 0;
  let matchCount = 0;
  
  // For each category and its subclusters
  for (const [category, subclusters] of Object.entries(SUBCLUSTERS)) {
    subclusterScores[category] = {};
    matchedKeywords[category] = {};
    let categoryScore = 0;
    let categoryMatchCount = 0;
    
    // Check each subcluster
    for (const [subcluster, data] of Object.entries(subclusters)) {
      const { keywords, score } = data as { keywords: string[], score: number };
      matchedKeywords[category][subcluster] = [];
      
      // Check for keyword matches
      for (const keyword of keywords) {
        // Use word boundary to match whole words
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(contentLower)) {
          matchedKeywords[category][subcluster].push(keyword);
          categoryScore += score;
          categoryMatchCount++;
          totalScore += score;
          matchCount++;
        }
      }
      
      // Calculate subcluster score (average if multiple matches)
      const matchesInSubcluster = matchedKeywords[category][subcluster].length;
      if (matchesInSubcluster > 0) {
        subclusterScores[category][subcluster] = (score * matchesInSubcluster) / matchesInSubcluster;
      } else {
        subclusterScores[category][subcluster] = 0;
      }
    }
    
    // Calculate category score (average if multiple matches)
    if (categoryMatchCount > 0) {
      categoryScores[category] = categoryScore / categoryMatchCount;
    } else {
      categoryScores[category] = 0;
    }
  }
  
  // Calculate overall average score
  const averageScore = matchCount > 0 ? totalScore / matchCount : 0;
  
  return {
    categoryScores,
    subclusterScores,
    matchedKeywords,
    averageScore
  };
};

// Generate confusion matrix data for visualization
export const generateConfusionMatrix = (
  matchedKeywords: Record<string, Record<string, string[]>>
): {
  matrix: number[][];
  labels: string[];
} => {
  const categories = Object.keys(SUBCLUSTERS);
  const matrix: number[][] = Array(categories.length).fill(0).map(() => Array(categories.length).fill(0));
  
  // Count co-occurrences of categories
  for (let i = 0; i < categories.length; i++) {
    const category1 = categories[i];
    const category1Matches = Object.values(matchedKeywords[category1] || {}).flat().length;
    
    // Set diagonal (self-correlation)
    matrix[i][i] = category1Matches;
    
    // Set correlations between different categories
    for (let j = i + 1; j < categories.length; j++) {
      const category2 = categories[j];
      const category2Matches = Object.values(matchedKeywords[category2] || {}).flat().length;
      
      // Co-occurrence is min of the two categories (intersection estimate)
      const coOccurrence = Math.min(category1Matches, category2Matches);
      
      // Set symmetrically
      matrix[i][j] = coOccurrence;
      matrix[j][i] = coOccurrence;
    }
  }
  
  return {
    matrix,
    labels: categories.map(c => c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()))
  };
}; 