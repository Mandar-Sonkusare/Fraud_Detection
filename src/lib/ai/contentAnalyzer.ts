
// Enhanced AI content analyzer - Uses simulated NLP techniques
import { ContentCategory } from '@/lib/mock-data';

// Expanded harmful keywords to detect
const HARMFUL_KEYWORDS = {
  hate_speech: ['hate', 'racist', 'racism', 'discrimination', 'bigot', 'bigotry', 'sexist', 'homophobic'],
  violence: ['kill', 'attack', 'hurt', 'violent', 'bomb', 'shoot', 'assault', 'death', 'murder'],
  harassment: ['harass', 'stalking', 'bully', 'bullying', 'threaten', 'intimidate', 'doxx'],
  misinformation: ['fake news', 'conspiracy', 'hoax', 'misinformation', 'disinformation', 'propaganda'],
  scam: ['scam', 'fraud', 'free money', 'get rich quick', 'pyramid scheme', 'ponzi', 'crypto scam'],
  explicit: ['nsfw', 'xxx', 'porn', 'explicit', 'adult content'],
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
