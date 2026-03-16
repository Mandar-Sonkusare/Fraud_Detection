// Fraud Detection Content Analyzer
import { ContentCategory } from '@/lib/mock-data';

// Backend API base
const BACKEND_API_BASE = 'http://localhost:8000';

// Fraud detection keywords organized by fraud type
export const FRAUD_KEYWORDS = {
  phishing: [
    'verify your account', 'suspended account', 'click here immediately',
    'urgent action required', 'confirm your identity', 'update your information',
    'your account will be closed', 'unauthorized login attempt', 'security breach',
    'verify your email', 'confirm your password', 'account verification',
    'suspicious activity detected', 'login from new device', 'protect your account',
    'reset password', 'account locked', 'verify now', 'immediate action',
    'click link below', 'verify identity', 'account security', 'suspicious login'
  ],
  
  impersonation: [
    'official bank', 'customer care', 'support team', 'verified account',
    'this is your bank', 'we are contacting you from', 'bank representative',
    'customer service', 'official support', 'trusted partner', 'authorized dealer',
    'official account', 'verified support', 'bank security', 'official message',
    'from your bank', 'banking services', 'official communication'
  ],
  
  scam: [
    'free money', 'get rich quick', 'guaranteed returns', 'no risk investment',
    'limited time offer', 'act now', 'exclusive opportunity', 'you have won',
    'claim your prize', 'inheritance', 'lottery winner', 'congratulations you won',
    'claim your reward', 'free gift', 'no purchase necessary', 'winner selected',
    'free iphone', 'free ipad', 'free laptop', 'giveaway', 'contest winner',
    'retweet to win', 'share to win', 'like and share', 'tag friends to win',
    'guaranteed win', 'instant money', 'easy money', 'quick cash'
  ],
  
  financial_fraud: [
    'send money', 'wire transfer', 'bitcoin', 'cryptocurrency investment',
    'double your money', 'investment opportunity', 'trading signals',
    'forex trading', 'binary options', 'pyramid scheme', 'ponzi scheme',
    'multi-level marketing', 'mlm opportunity', 'passive income',
    'crypto investment', 'trading bot', 'automated trading', 'guaranteed profit',
    'risk-free investment', 'high returns', 'investment program'
  ],
  
  fake_giveaway: [
    'free iphone', 'free ipad', 'free laptop', 'giveaway', 'contest winner',
    'retweet to win', 'share to win', 'like and share', 'tag friends to win',
    'free prize', 'win now', 'free offer', 'no strings attached'
  ]
};

// Context amplifiers that increase fraud risk
const FRAUD_AMPLIFIERS = [
  'urgent', 'immediately', 'now', 'asap', 'hurry', 'limited time',
  'act now', 'don\'t miss', 'exclusive', 'guaranteed', '100%',
  'free', 'no cost', 'no risk', 'instant', 'quick', 'easy'
];

interface FraudAnalysisResult {
  isFlagged: boolean;
  confidence: number;
  category: ContentCategory | null;
  categories?: ContentCategory[];
  severity: 'low' | 'medium' | 'high';
  modelAccuracy?: number;
  modelName?: string;
  detectedKeywords?: string[];
  contextScore?: number;
  analysisTimestamp?: Date;
  keywordsPerCategory?: Record<string, string[]>;
  fraudType?: 'normal' | 'suspicious' | 'fraudulent';
  riskScore?: number;
  detectedPatterns?: string[];
}

// Model information
const MODEL_NAME = "Fraud Detection System";
const MODEL_ACCURACY = 92.5;

// Helper function to detect keywords in a category
const detectKeywordsInCategory = (content: string, categoryKeywords: string[]): string[] => {
  const contentLower = content.toLowerCase();
  const matches: string[] = [];
  
  for (const keyword of categoryKeywords) {
    // Use word boundary or phrase matching
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'gi');
    if (regex.test(contentLower)) {
      matches.push(keyword);
    }
  }
  
  return [...new Set(matches)]; // Remove duplicates
};

// Find all fraud keywords across all categories
const findAllFraudKeywords = (content: string): string[] => {
  const allDetectedKeywords: string[] = [];
  
  for (const [category, keywords] of Object.entries(FRAUD_KEYWORDS)) {
    const detectedInCategory = detectKeywordsInCategory(content, keywords);
    allDetectedKeywords.push(...detectedInCategory);
  }
  
  return [...new Set(allDetectedKeywords)];
};

// Find keywords categorized by their category
const findKeywordsByCategory = (content: string): Record<string, string[]> => {
  const keywordsPerCategory: Record<string, string[]> = {};
  
  for (const [category, keywords] of Object.entries(FRAUD_KEYWORDS)) {
    const detectedInCategory = detectKeywordsInCategory(content, keywords);
    if (detectedInCategory.length > 0) {
      keywordsPerCategory[category] = detectedInCategory;
    }
  }
  
  return keywordsPerCategory;
};

// Map fraud types to content categories
const mapFraudTypeToCategory = (fraudType: string, patterns: string[]): ContentCategory => {
  if (patterns.includes('phishing')) return 'phishing';
  if (patterns.includes('impersonation')) return 'phishing'; // Similar to phishing
  if (patterns.includes('scam')) return 'scam';
  if (patterns.includes('financial_fraud')) return 'scam';
  if (patterns.includes('fake_giveaway')) return 'scam';
  return 'scam'; // Default
};

// Analyzes content for fraud detection
export const analyzeContent = async (content: string): Promise<FraudAnalysisResult> => {
  if (!content) {
    return {
      isFlagged: false,
      confidence: 0,
      category: null,
      categories: [],
      severity: 'low',
      modelAccuracy: MODEL_ACCURACY,
      modelName: MODEL_NAME,
      detectedKeywords: [],
      contextScore: 0,
      analysisTimestamp: new Date(),
      keywordsPerCategory: {},
      fraudType: 'normal',
      riskScore: 0,
      detectedPatterns: []
    };
  }
  
  const contentLower = content.toLowerCase();
  let flagged = false;
  let category: ContentCategory | null = null;
  let categories: ContentCategory[] = [];
  let severity: 'low' | 'medium' | 'high' = 'low';
  let confidence = 0;
  let detectedKeywords: string[] = findAllFraudKeywords(content);
  let keywordsPerCategory = findKeywordsByCategory(content);
  let fraudType: 'normal' | 'suspicious' | 'fraudulent' = 'normal';
  let riskScore = 0;
  let detectedPatterns: string[] = [];
  
  // Identify all detected categories
  for (const catKey in keywordsPerCategory) {
    if (keywordsPerCategory[catKey].length > 0) {
      detectedPatterns.push(catKey);
      const mappedCategory = mapFraudTypeToCategory(catKey, detectedPatterns);
      if (!categories.includes(mappedCategory)) {
        categories.push(mappedCategory);
      }
    }
  }
  
  // Set the primary category
  if (categories.length > 0) {
    let maxKeywords = 0;
    for (const cat of categories) {
      // Count keywords for this category
      let catKeywordCount = 0;
      for (const pattern of detectedPatterns) {
        catKeywordCount += keywordsPerCategory[pattern]?.length || 0;
      }
      if (catKeywordCount > maxKeywords) {
        maxKeywords = catKeywordCount;
        category = cat;
      }
    }
    flagged = true;
  }
  
  // Try backend ML models for fraud prediction
  try {
    const resp = await fetch(`${BACKEND_API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: content, 
        model_name: 'mlp' 
      })
    });
    
    if (resp.ok) {
      const data = await resp.json();
      
      // Map backend prediction to our types
      fraudType = data.prediction as 'normal' | 'suspicious' | 'fraudulent';
      const backendConfidence = typeof data.confidence === 'number' ? data.confidence : 0.75;
      riskScore = typeof data.risk_score === 'number' ? data.risk_score : 0;
      detectedPatterns = data.detected_patterns || detectedPatterns;
      
      // Determine severity based on fraud type and risk score
      if (fraudType === 'fraudulent') {
        severity = riskScore > 80 ? 'high' : 'medium';
        confidence = Math.max(backendConfidence, 0.8);
      } else if (fraudType === 'suspicious') {
        severity = riskScore > 60 ? 'medium' : 'low';
        confidence = Math.max(backendConfidence, 0.6);
      } else {
        severity = 'low';
        confidence = backendConfidence;
      }
      
      // Use keyword detection to enrich categories
      detectedKeywords = findAllFraudKeywords(content);
      keywordsPerCategory = findKeywordsByCategory(content);
      
      // Update categories based on detected patterns
      categories = [];
      for (const pattern of detectedPatterns) {
        const mappedCategory = mapFraudTypeToCategory(pattern, detectedPatterns);
        if (!categories.includes(mappedCategory)) {
          categories.push(mappedCategory);
        }
      }
      
      if (categories.length > 0 && !category) {
        category = categories[0];
      }
      
      // If backend says fraudulent but no category, set default
      if (fraudType !== 'normal' && !category) {
        category = 'scam';
        categories = ['scam'];
      }
      
      flagged = fraudType !== 'normal' || detectedKeywords.length > 0;
      
      return {
        isFlagged: flagged,
        confidence: confidence,
        category: category,
        categories: categories,
        severity: severity,
        modelAccuracy: MODEL_ACCURACY,
        modelName: `Fraud Detection ${data.model || 'MLP'}`,
        detectedKeywords: detectedKeywords,
        contextScore: Math.min(0.95, (detectedKeywords.length * 0.15) + (riskScore / 100)),
        analysisTimestamp: new Date(),
        keywordsPerCategory: keywordsPerCategory,
        fraudType: fraudType,
        riskScore: riskScore,
        detectedPatterns: detectedPatterns
      };
    }
  } catch (e) {
    console.warn("Backend API unavailable, using keyword-based detection:", e);
  }
  
  // Fallback to keyword-based analysis
  return performKeywordAnalysis(content);
};

// Fallback keyword-based analysis
const performKeywordAnalysis = (content: string): FraudAnalysisResult => {
  const contentLower = content.toLowerCase();
  let flagged = false;
  let category: ContentCategory | null = null;
  let categories: ContentCategory[] = [];
  let severity: 'low' | 'medium' | 'high' = 'low';
  let confidence = 0;
  let fraudType: 'normal' | 'suspicious' | 'fraudulent' = 'normal';
  let riskScore = 0;
  
  let allDetectedKeywords: string[] = findAllFraudKeywords(content);
  let keywordsPerCategory = findKeywordsByCategory(content);
  let detectedPatterns: string[] = [];
  
  // Check each category and collect all that have matching keywords
  for (const [cat, keywords] of Object.entries(keywordsPerCategory)) {
    if (keywords.length > 0) {
      flagged = true;
      detectedPatterns.push(cat);
      const mappedCategory = mapFraudTypeToCategory(cat, detectedPatterns);
      if (!categories.includes(mappedCategory)) {
        categories.push(mappedCategory);
      }
    }
  }
  
  // Check for fraud amplifiers
  let amplifierCount = 0;
  for (const amplifier of FRAUD_AMPLIFIERS) {
    if (contentLower.includes(amplifier)) {
      amplifierCount++;
    }
  }
  
  // Set the primary category
  if (categories.length > 0) {
    let maxKeywords = 0;
    for (const cat of categories) {
      let catKeywordCount = 0;
      for (const pattern of detectedPatterns) {
        catKeywordCount += keywordsPerCategory[pattern]?.length || 0;
      }
      if (catKeywordCount > maxKeywords) {
        maxKeywords = catKeywordCount;
        category = cat;
      }
    }
  }
  
  // Calculate severity and fraud type based on keyword count and amplifiers
  const keywordCount = allDetectedKeywords.length;
  if (keywordCount > 0) {
    if (keywordCount > 3 || amplifierCount > 2) {
      severity = 'high';
      fraudType = 'fraudulent';
      confidence = 0.85 + Math.min(keywordCount * 0.02, 0.13);
      riskScore = 80 + Math.min(keywordCount * 2, 20);
    } else if (keywordCount > 1 || amplifierCount > 0) {
      severity = 'medium';
      fraudType = 'suspicious';
      confidence = 0.70 + Math.min(keywordCount * 0.02, 0.10);
      riskScore = 50 + Math.min(keywordCount * 3, 30);
    } else {
      severity = 'low';
      fraudType = 'suspicious';
      confidence = 0.60;
      riskScore = 30 + keywordCount * 5;
    }
    
    confidence = Math.min(confidence, 0.98);
    riskScore = Math.min(riskScore, 100);
  }
  
  // Calculate context score
  const contextScore = Math.min(0.95, (keywordCount * 0.15) + (amplifierCount * 0.25));
  
  return {
    isFlagged: flagged,
    confidence: confidence,
    category: category,
    categories: categories,
    severity: severity,
    modelAccuracy: MODEL_ACCURACY,
    modelName: MODEL_NAME + " (Keyword Analysis)",
    detectedKeywords: allDetectedKeywords,
    contextScore: contextScore,
    analysisTimestamp: new Date(),
    keywordsPerCategory: keywordsPerCategory,
    fraudType: fraudType,
    riskScore: riskScore,
    detectedPatterns: detectedPatterns
  };
};
