
import { 
  UserCircle, AlertTriangle, AlertOctagon, ShieldAlert, 
  BadgeAlert, Skull, UserX2, MessageSquareWarning
} from 'lucide-react';

export type AlertSeverity = 'low' | 'medium' | 'high';

export type ContentCategory = 
  | 'misinformation' 
  | 'hate_speech' 
  | 'violence' 
  | 'cyberbullying' 
  | 'scam'
  | 'phishing'
  | 'explicit_content'
  | 'extremism'
  | 'harassment' // Add this to match with contentAnalyzer.ts
  | 'explicit';   // Add this to match with contentAnalyzer.ts

export interface Post {
  id: string;
  username: string;
  handle: string;
  content: string;
  timestamp: Date;
  severity: AlertSeverity;
  category: ContentCategory;
  confidence: number;
  platform: 'twitter' | 'facebook' | 'instagram';
  status: 'pending' | 'approved' | 'rejected';
  modelAccuracy?: number; // Add this property with optional type
  metadata?: {
    url?: string;
    likes?: number;
    shares?: number;
    replies?: number;
  };
}

// Map category to icon
export const categoryIcons: Record<ContentCategory, React.ComponentType<any>> = {
  misinformation: AlertTriangle,
  hate_speech: AlertOctagon,
  violence: Skull,
  cyberbullying: UserX2,
  scam: BadgeAlert,
  phishing: ShieldAlert,
  explicit_content: MessageSquareWarning,
  extremism: AlertOctagon,
};

// Map category to friendly name
export const categoryNames: Record<ContentCategory, string> = {
  misinformation: 'Misinformation',
  hate_speech: 'Hate Speech',
  violence: 'Violence',
  cyberbullying: 'Cyberbullying',
  scam: 'Scam',
  phishing: 'Phishing',
  explicit_content: 'Explicit Content',
  extremism: 'Extremism',
};

// Generate mock data
export const generateMockPosts = (count: number): Post[] => {
  const categories: ContentCategory[] = [
    'misinformation', 'hate_speech', 'violence', 'cyberbullying', 
    'scam', 'phishing', 'explicit_content', 'extremism'
  ];
  
  const severities: AlertSeverity[] = ['low', 'medium', 'high'];
  const platforms = ['twitter', 'facebook', 'instagram'];
  const statuses = ['pending', 'approved', 'rejected'];
  
  const mockContent = [
    "Check out this new cure for all diseases! Scientists don't want you to know this secret! #fakenews",
    "I can't stand those people from the south side of town. They should all be banned from our country!",
    "Someone should teach that politician a lesson with a baseball bat. I'm not kidding.",
    "You're the stupidest person I've ever seen online. Kill yourself, nobody would miss you.",
    "Free money! Just send your credit card details to claim your prize! Guaranteed legitimate!",
    "Click here to reset your password immediately or your account will be locked: bit.ly/fake-site",
    "Sharing explicit photos that shouldn't be on social media platforms.",
    "Join our movement to overthrow the corrupt system by any means necessary. Violence is justified.",
  ];
  
  const usernames = [
    "John Smith", "Jane Doe", "Alex Johnson", "Taylor Swift", 
    "Michael Brown", "Sarah Williams", "David Jones", "Emma Davis"
  ];
  
  const handles = [
    "jsm1th", "jane_doe", "alexj", "tswizzle", 
    "mbrown", "sarahw", "djones42", "emmad"
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const categoryIndex = Math.floor(Math.random() * categories.length);
    const severityIndex = Math.floor(Math.random() * severities.length);
    const userIndex = Math.floor(Math.random() * usernames.length);
    
    // Create a random date within the last 7 days
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 7));
    timestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    
    return {
      id: `post-${i}-${Date.now()}`,
      username: usernames[userIndex],
      handle: handles[userIndex],
      content: mockContent[categoryIndex] || `Sample content with ${categories[categoryIndex]} issues.`,
      timestamp,
      severity: severities[severityIndex],
      category: categories[categoryIndex],
      confidence: Math.round((0.70 + Math.random() * 0.30) * 100) / 100,
      platform: platforms[Math.floor(Math.random() * platforms.length)] as 'twitter' | 'facebook' | 'instagram',
      status: Math.random() > 0.7 ? 'pending' : (Math.random() > 0.5 ? 'approved' : 'rejected'),
      metadata: {
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 100),
        replies: Math.floor(Math.random() * 50),
      }
    };
  });
};

// Helper for stats and dashboard data
export const generateMockStats = () => {
  return {
    totalFlagged: 1358,
    pending: 72,
    resolved: 1286,
    flaggedByCategory: {
      misinformation: 428,
      hate_speech: 312,
      violence: 156,
      cyberbullying: 205,
      scam: 89,
      phishing: 76,
      explicit_content: 54,
      extremism: 38
    },
    flaggedByPlatform: {
      twitter: 729,
      facebook: 418,
      instagram: 211
    },
    flaggedBySeverity: {
      high: 342,
      medium: 587,
      low: 429
    },
    moderationStats: {
      approvalRate: 0.32,
      rejectionRate: 0.68,
      averageResolutionTime: 18.5, // minutes
    },
    dailyTrends: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
      flagged: 150 + Math.floor(Math.random() * 100),
      resolved: 130 + Math.floor(Math.random() * 90)
    }))
  };
};

// Helper for API configuration (X/Twitter)
export interface ApiConfig {
  api_key: string;
  api_secret: string;
  bearer_token: string;
  access_token: string;
  access_token_secret: string;
  webhooks_url: string;
  isConfigured: boolean;
}

export const initialApiConfig: ApiConfig = {
  api_key: "",
  api_secret: "",
  bearer_token: "",
  access_token: "",
  access_token_secret: "",
  webhooks_url: "",
  isConfigured: false
};
