
// Enhanced AI content analyzer - In a real app, this would call a backend API where the model runs
import { ContentCategory } from '@/lib/mock-data';

// Expanded harmful keywords to detect
const HARMFUL_KEYWORDS = {
  hate_speech: [
    'hate', 'racist', 'discrimination', 'bigot', 'bigotry', 'sexist', 'homophobic',
    'transphobic', 'xenophobic', 'anti-semitic', 'islamophobic', 'prejudice',
    'hateful', 'supremacist', 'derogatory'
  ],
  violence: [
    'kill', 'attack', 'hurt', 'violent', 'bomb', 'shoot', 'murder', 'assault',
    'stab', 'destroy', 'threat', 'threatening', 'behead', 'massacre', 'slaughter',
    'torture', 'execute', 'assassinate', 'eliminate', 'punish'
  ],
  harassment: [
    'harass', 'stalking', 'bully', 'threaten', 'intimidate', 'doxx', 'doxing',
    'troll', 'abusive', 'insult', 'humiliate', 'mock', 'shame', 'torment'
  ],
  misinformation: [
    'fake news', 'conspiracy', 'hoax', 'propaganda', 'misleading', 'false',
    'debunked', 'disinformation', 'fabricated', 'lying', 'untrue', 'false narrative'
  ],
  scam: [
    'scam', 'fraud', 'free money', 'get rich quick', 'pyramid scheme', 'ponzi',
    'investment opportunity', 'wire transfer', 'nigerian prince', 'lottery winner',
    'phishing', 'fake login', 'claim your prize', 'bitcoin scheme', 'crypto scam'
  ],
  explicit: [
    'nsfw', 'xxx', 'porn', 'pornographic', 'sexual', 'obscene', 'explicit content',
    'adult content', 'nude', 'erotic', 'indecent'
  ],
  boycott: [
    'boycott', 'cancel', 'cancelling', 'blacklist', 'ban', 'shut down',
    'stop supporting', 'defund', 'no platform'
  ],
};

interface AnalysisResult {
  isFlagged: boolean;
  confidence: number;
  category: ContentCategory | null;
  severity: 'low' | 'medium' | 'high';
}

export const analyzeContent = (content: string): AnalysisResult => {
  if (!content) {
    return {
      isFlagged: false,
      confidence: 0,
      category: null,
      severity: 'low'
    };
  }
  
  const contentLower = content.toLowerCase();
  let flagged = false;
  let category: ContentCategory | null = null;
  let severity: 'low' | 'medium' | 'high' = 'low';
  let confidence = 0;
  let maxScore = 0;

  // Check for keywords in each category with improved scoring
  for (const [cat, keywords] of Object.entries(HARMFUL_KEYWORDS)) {
    let categoryScore = 0;
    let matchedKeywords = 0;
    
    for (const keyword of keywords) {
      // Create a regex for exact matches and word boundaries
      const regex = new RegExp(`\\b${keyword}\\b|\\b${keyword}s\\b|\\b${keyword}ing\\b`, 'gi');
      const matches = contentLower.match(regex);
      
      if (matches && matches.length > 0) {
        matchedKeywords++;
        
        // Score based on repetition and prominence
        const keywordCount = matches.length;
        let keywordScore = 0;
        
        if (keywordCount > 2) {
          keywordScore = 0.9;
        } else if (keywordCount > 1) {
          keywordScore = 0.75;
        } else {
          keywordScore = 0.6;
        }
        
        // Add to total category score
        categoryScore += keywordScore;
      }
    }
    
    // If we found matches, calculate final category score
    if (matchedKeywords > 0) {
      // Normalize score based on number of matched keywords
      const normalizedScore = categoryScore / matchedKeywords;
      
      // If this category has a higher score than previous ones, use it
      if (normalizedScore > maxScore) {
        maxScore = normalizedScore;
        category = cat as ContentCategory;
        flagged = true;
        
        // Assign severity based on score
        if (normalizedScore > 0.8) {
          severity = 'high';
        } else if (normalizedScore > 0.65) {
          severity = 'medium';
        } else {
          severity = 'low';
        }
        
        confidence = normalizedScore;
      }
    }
  }

  // Consider post length for context - shorter posts with flagged content are more severe
  if (flagged && content.length < 50 && severity !== 'high') {
    severity = severity === 'low' ? 'medium' : 'high';
    confidence = Math.min(confidence + 0.1, 0.99);
  }

  return {
    isFlagged: flagged,
    confidence: confidence,
    category: category,
    severity: severity
  };
};
