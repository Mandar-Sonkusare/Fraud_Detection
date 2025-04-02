
// Simulated AI content analyzer - In a real app, this would call a backend API where the model runs
import { ContentCategory } from '@/lib/mock-data';

// Harmful keywords to detect
const HARMFUL_KEYWORDS = {
  hate_speech: ['hate', 'racist', 'discrimination', 'bigot'],
  violence: ['kill', 'attack', 'hurt', 'violent', 'bomb', 'shoot'],
  harassment: ['harass', 'stalking', 'bully', 'threaten'],
  misinformation: ['fake news', 'conspiracy', 'hoax'],
  scam: ['scam', 'fraud', 'free money', 'get rich quick', 'pyramid scheme'],
  explicit: ['nsfw', 'xxx', 'porn'],
};

interface AnalysisResult {
  isFlagged: boolean;
  confidence: number;
  category: ContentCategory | null;
  severity: 'low' | 'medium' | 'high';
}

export const analyzeContent = (content: string): AnalysisResult => {
  const contentLower = content.toLowerCase();
  let flagged = false;
  let category: ContentCategory | null = null;
  let severity: 'low' | 'medium' | 'high' = 'low';
  let confidence = 0;

  // Check for keywords in each category
  for (const [cat, keywords] of Object.entries(HARMFUL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (contentLower.includes(keyword)) {
        flagged = true;
        category = cat as ContentCategory;
        
        // Calculate severity based on repetition and prominence
        const keywordCount = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
        
        if (keywordCount > 2) {
          severity = 'high';
          confidence = 0.9;
        } else if (keywordCount > 1) {
          severity = 'medium';
          confidence = 0.75;
        } else {
          severity = 'low';
          confidence = 0.6;
        }
        
        // Once we've found a match, no need to check other keywords in this category
        break;
      }
    }
    
    // If we've already flagged content, no need to check other categories
    if (flagged) break;
  }

  return {
    isFlagged: flagged,
    confidence: confidence,
    category: category,
    severity: severity
  };
};
