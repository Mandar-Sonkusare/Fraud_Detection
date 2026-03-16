import { 
  UserCircle, AlertTriangle, AlertOctagon, ShieldAlert, 
  BadgeAlert, Skull, UserX2, MessageSquareWarning, UserX, MessageSquare
} from 'lucide-react';

export type AlertSeverity = 'low' | 'medium' | 'high';

export type ContentCategory = 
  | 'phishing'
  | 'scam'
  | 'impersonation'
  | 'financial_fraud'
  | 'fake_giveaway';

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
  phishing: ShieldAlert,
  scam: BadgeAlert,
  impersonation: UserX2,
  financial_fraud: AlertOctagon,
  fake_giveaway: AlertTriangle
};

// Map category to friendly name
export const categoryNames: Record<string, string> = {
  phishing: 'Phishing',
  scam: 'Scam',
  impersonation: 'Impersonation',
  financial_fraud: 'Financial Fraud',
  fake_giveaway: 'Fake Giveaway'
};

// Generate mock data
export const generateMockPosts = (count: number): Post[] => {
  const categories: ContentCategory[] = [
    'phishing', 'scam', 'impersonation', 'financial_fraud', 'fake_giveaway'
  ];
  
  const severities: AlertSeverity[] = ['low', 'medium', 'high'];
  const platforms = ['twitter', 'facebook', 'instagram'];
  const statuses = ['pending', 'approved', 'rejected'];
  
  const mockContent = [
    "URGENT: Your Bank of America account has been suspended. Click here to verify: bit.ly/fake-bank",
    "Congratulations! You have won $10,000 in our lottery. Claim your prize now: scam-site.com",
    "Official Chase Customer Care: We detected suspicious activity. Verify your account: verify-chase.com",
    "FREE MONEY! Double your investment in 24 hours. No risk, guaranteed returns. Sign up now!",
    "Limited time offer! Get rich quick with our exclusive cryptocurrency investment opportunity.",
    "Your PayPal account will be closed in 24 hours. Click here to prevent closure: paypal-verify.net",
    "You have been selected for a free iPhone 15. Claim now: free-iphone-giveaway.com",
    "Official Amazon Support: Your account needs verification. Click here: amazon-verify.org",
    "Investment opportunity: Turn $500 into $5000 in just 7 days. Guaranteed returns!",
    "Security alert: Unauthorized login detected on your account. Secure now: secure-account.com",
    "You've won! Claim your prize worth $5,000. Click here: winner-claim.com",
    "Official message from Wells Fargo: Verify your identity to continue using our services.",
    "Get rich quick! Join our exclusive trading program. Minimum investment: $100",
    "Your Netflix subscription is about to expire. Renew now: netflix-renew.com",
    "Free Bitcoin giveaway! Send 0.1 BTC to receive 1 BTC back. Limited time offer!",
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
      phishing: 342,
      scam: 428,
      impersonation: 256,
      financial_fraud: 189,
      fake_giveaway: 143
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
