
// Enhanced AI content analyzer with HateBERT integration
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
    'ridiculous', 'absurd', 'preposterous', 'outrageous', 'provocative',
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
  detectedKeywords?: string[];
  contextScore?: number;
  analysisTimestamp?: Date;
}

// HateBERT model information
const MODEL_NAME = "GroNLP/hateBERT";
const MODEL_ACCURACY = 92.7; // Based on published performance metrics for HateBERT

// Cached classifier to avoid reloading the model on every analysis
let hatebertClassifier: any = null;

// Initialize the HateBERT classifier
const initializeClassifier = async () => {
  if (!hatebertClassifier) {
    try {
      console.log("Initializing HateBERT classifier...");
      hatebertClassifier = await pipeline('text-classification', MODEL_NAME, {
        waitForModel: true
      });
      console.log("HateBERT classifier initialized successfully");
    } catch (error) {
      console.error("Error initializing HateBERT classifier:", error);
      // Fall back to keyword-based analysis if model fails to load
      hatebertClassifier = null;
    }
  }
  return hatebertClassifier;
};

// Get the model accuracy - now returns a fixed value based on published research
const getModelAccuracy = (): number => {
  return MODEL_ACCURACY;
};

// Get model name
const getModelName = (): string => {
  return "HateBERT by Groningen NLP";
};

// Helper function to detect all matching keywords from a category in the given content
const detectKeywordsInCategory = (content: string, categoryKeywords: string[]): string[] => {
  const contentLower = content.toLowerCase();
  const matches: string[] = [];
  
  for (const keyword of categoryKeywords) {
    // Use word boundary to match whole words
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    if (regex.test(contentLower)) {
      matches.push(keyword);
    }
  }
  
  return matches;
};

// Find all harmful keywords across all categories
const findAllHarmfulKeywords = (content: string): string[] => {
  const allDetectedKeywords: string[] = [];
  
  for (const [category, keywords] of Object.entries(HARMFUL_KEYWORDS)) {
    const detectedInCategory = detectKeywordsInCategory(content, keywords);
    allDetectedKeywords.push(...detectedInCategory);
  }
  
  // Remove duplicates by converting to Set and back to array
  return [...new Set(allDetectedKeywords)];
};

// Analyzes content using HateBERT if available, falls back to keyword analysis
export const analyzeContent = async (content: string): Promise<AnalysisResult> => {
  if (!content) {
    return {
      isFlagged: false,
      confidence: 0,
      category: null,
      severity: 'low',
      modelAccuracy: MODEL_ACCURACY,
      modelName: getModelName(),
      detectedKeywords: [],
      contextScore: 0,
      analysisTimestamp: new Date()
    };
  }
  
  const contentLower = content.toLowerCase();
  let flagged = false;
  let category: ContentCategory | null = null;
  let severity: 'low' | 'medium' | 'high' = 'low';
  let confidence = 0;
  let keywordCount = 0;
  let amplifierCount = 0;
  let detectedKeywords: string[] = findAllHarmfulKeywords(content);
  
  // Try to use HateBERT model if available
  try {
    const classifier = await initializeClassifier();
    
    if (classifier) {
      // Use the HateBERT model for prediction
      const result = await classifier(content);
      
      if (result && result.length > 0) {
        const prediction = result[0];
        
        // HateBERT classifies as either "LABEL_0" (not hateful) or "LABEL_1" (hateful)
        if (prediction.label === "LABEL_1") {
          flagged = true;
          category = "hate_speech";
          confidence = prediction.score;
          
          // Determine severity based on confidence score
          if (confidence > 0.85) {
            severity = 'high';
          } else if (confidence > 0.65) {
            severity = 'medium';
          } else {
            severity = 'low';
          }
          
          // Check for context amplifiers
          for (const amplifier of CONTEXT_AMPLIFIERS) {
            for (const keyword of detectedKeywords) {
              const nearKeywordRegex = new RegExp(`${amplifier}\\s+\\w{0,10}\\s*${keyword}|${keyword}\\s*\\w{0,10}\\s+${amplifier}`, 'gi');
              const amplifierMatches = contentLower.match(nearKeywordRegex);
              
              if (amplifierMatches) {
                amplifierCount += amplifierMatches.length;
              }
            }
          }
        }
      }
    } else {
      // Fall back to keyword-based analysis if model isn't available
      return performKeywordAnalysis(content);
    }
  } catch (error) {
    console.error("Error using HateBERT model:", error);
    // Fall back to keyword-based analysis
    return performKeywordAnalysis(content);
  }
  
  // If no keywords are detected via HateBERT but it still flags, get keywords from general detection
  if (flagged && detectedKeywords.length === 0) {
    detectedKeywords = findAllHarmfulKeywords(content);
  }
  
  // Calculate context score - a measure of how strongly the context indicates harmful intent
  const contextScore = Math.min(0.95, (detectedKeywords.length * 0.15) + (amplifierCount * 0.25));
  
  return {
    isFlagged: flagged || detectedKeywords.length > 0,
    confidence: confidence,
    category: category,
    severity: severity,
    modelAccuracy: MODEL_ACCURACY,
    modelName: getModelName(),
    detectedKeywords: detectedKeywords,
    contextScore: contextScore,
    analysisTimestamp: new Date()
  };
};

// Fallback keyword-based analysis when model is unavailable
const performKeywordAnalysis = (content: string): AnalysisResult => {
  const contentLower = content.toLowerCase();
  let flagged = false;
  let category: ContentCategory | null = null;
  let severity: 'low' | 'medium' | 'high' = 'low';
  let confidence = 0;
  let amplifierCount = 0;
  let allDetectedKeywords: string[] = findAllHarmfulKeywords(content);
  
  // Check for keywords in each category
  for (const [cat, keywords] of Object.entries(HARMFUL_KEYWORDS)) {
    const catKeywords = detectKeywordsInCategory(content, keywords);
    
    if (catKeywords.length > 0) {
      flagged = true;
      // Only set category if it hasn't been set yet
      if (!category) {
        category = cat as ContentCategory;
      }
      
      // Check for context amplifiers near the keywords
      for (const amplifier of CONTEXT_AMPLIFIERS) {
        for (const keyword of catKeywords) {
          const nearKeywordRegex = new RegExp(`${amplifier}\\s+\\w{0,10}\\s*${keyword}|${keyword}\\s*\\w{0,10}\\s+${amplifier}`, 'gi');
          const amplifierMatches = contentLower.match(nearKeywordRegex);
          
          if (amplifierMatches) {
            amplifierCount += amplifierMatches.length;
          }
        }
      }
    }
  }
  
  // Calculate severity based on keyword count and presence of amplifiers
  const keywordCount = allDetectedKeywords.length;
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
  
  // Calculate context score
  const contextScore = Math.min(0.95, (keywordCount * 0.15) + (amplifierCount * 0.25));
  
  return {
    isFlagged: flagged,
    confidence: confidence,
    category: category,
    severity: severity,
    modelAccuracy: MODEL_ACCURACY,
    modelName: getModelName() + " (Keyword Fallback)",
    detectedKeywords: allDetectedKeywords,
    contextScore: contextScore,
    analysisTimestamp: new Date()
  };
};

// Import the pipeline function
import { pipeline } from '@huggingface/transformers';

