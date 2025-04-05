import { v4 as uuidv4 } from 'uuid';
import { Post, ContentCategory } from '@/lib/mock-data';
import { analyzeContent } from '@/lib/ai/contentAnalyzer';
import { store } from '@/lib/redux/store';
import { addNewFlaggedPost } from '@/lib/redux/moderationSlice';
import { toast } from 'sonner';

// X API configuration
interface XApiCredentials {
  apiKey: string;
  apiKeySecret: string;
  accessToken: string;
  accessTokenSecret: string;
  bearerToken: string;
}

let xApiCredentials: XApiCredentials = {
  apiKey: '',
  apiKeySecret: '',
  accessToken: '',
  accessTokenSecret: '',
  bearerToken: ''
};

export const setXApiCredentials = (credentials: XApiCredentials) => {
  xApiCredentials = credentials;
  localStorage.setItem('x_api_credentials', JSON.stringify(credentials));
  return true;
};

export const getXApiCredentials = (): XApiCredentials | null => {
  if (!xApiCredentials.apiKey || !xApiCredentials.bearerToken) {
    const storedCreds = localStorage.getItem('x_api_credentials');
    if (storedCreds) {
      xApiCredentials = JSON.parse(storedCreds);
      return xApiCredentials;
    }
    return null;
  }
  return xApiCredentials;
};

export const getXApiKey = () => {
  const creds = getXApiCredentials();
  return creds?.apiKey || '';
};

// Format the timestamp for display
const formatTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Sample tweets data for simulation when API is not available
const sampleTweets = [
  {
    id: "1",
    text: "Just saw the latest policy changes. Can't believe how terrible this new approach is!",
    user: {
      screen_name: "real_user1",
      name: "Real User One",
      profile_image_url: ""
    },
    created_at: new Date().toISOString(),
    favorite_count: 15,
    retweet_count: 5,
    reply_count: 8
  },
  {
    id: "2",
    text: "This company is clearly discriminating against its users. I hate their new terms of service!",
    user: {
      screen_name: "actual_person",
      name: "Actual Person",
      profile_image_url: ""
    },
    created_at: new Date().toISOString(),
    favorite_count: 22,
    retweet_count: 12,
    reply_count: 7
  },
  {
    id: "3",
    text: "These people need to be stopped. The violence they're promoting is disgusting!",
    user: {
      screen_name: "concerned_citizen",
      name: "Concerned Citizen",
      profile_image_url: ""
    },
    created_at: new Date().toISOString(),
    favorite_count: 45,
    retweet_count: 28,
    reply_count: 19
  },
  {
    id: "4",
    text: "Spreading fake news about the election is dangerous! Stop this conspiracy hoax!",
    user: {
      screen_name: "truth_seeker",
      name: "Truth Seeker",
      profile_image_url: ""
    },
    created_at: new Date().toISOString(),
    favorite_count: 67,
    retweet_count: 42,
    reply_count: 31
  },
  {
    id: "5",
    text: "Join our program and get rich quick! This pyramid scheme is guaranteed to work!",
    user: {
      screen_name: "money_maker",
      name: "Money Maker",
      profile_image_url: ""
    },
    created_at: new Date().toISOString(),
    favorite_count: 5,
    retweet_count: 1,
    reply_count: 0
  }
];

// Real X API fetch
export const fetchTweets = async (): Promise<void> => {
  try {
    const creds = getXApiCredentials();
    
    if (!creds || !creds.apiKey || !creds.bearerToken) {
      console.error('X API credentials not configured');
      toast('X API credentials missing', {
        description: 'Please configure your X API credentials in settings',
        duration: 5000,
        className: "bg-card border border-border backdrop-blur-lg text-foreground",
      });
      return;
    }
    
    let tweets = [];
    
    try {
      // Note: Twitter API requires OAuth 1.0a for most endpoints which is difficult to implement client-side
      // For a real implementation, this should be done through a backend service
      // Using sample tweets data for demonstration
      
      // Showing a notification that we're using demo data
      toast('Using sample tweets', {
        description: 'Real X API integration requires server-side OAuth. Using sample tweets for demonstration.',
        duration: 5000,
      });
      
      // Use sample tweets data with random variations
      tweets = sampleTweets.map(tweet => ({
        ...tweet,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        favorite_count: Math.floor(Math.random() * 100),
        retweet_count: Math.floor(Math.random() * 50),
        reply_count: Math.floor(Math.random() * 30)
      }));
      
    } catch (error) {
      console.error('Error fetching from X API:', error);
      toast('X API Error', {
        description: 'Failed to fetch data from X API',
        duration: 5000,
        className: "bg-card border border-border backdrop-blur-lg text-foreground",
      });
      return;
    }
    
    // Process each tweet with AI analyzer
    tweets.forEach(tweet => {
      const analysis = analyzeContent(tweet.text);
      
      if (analysis.isFlagged) {
        // Convert to our Post format
        const post: Post = {
          id: tweet.id || uuidv4(),
          content: tweet.text,
          username: tweet.user.name,
          handle: tweet.user.screen_name,
          platform: 'twitter',
          timestamp: new Date(tweet.created_at),
          status: 'pending',
          severity: analysis.severity,
          category: analysis.category as ContentCategory,
          confidence: analysis.confidence,
          modelAccuracy: analysis.modelAccuracy,
          metadata: {
            likes: tweet.favorite_count,
            shares: tweet.retweet_count,
            replies: tweet.reply_count
          }
        };
        
        // Add to Redux store
        store.dispatch(addNewFlaggedPost(post));
        
        // Show notification with timestamp
        const currentTime = formatTime();
        
        toast('New content flagged', {
          description: `${currentTime} - ${tweet.user.name} (@${tweet.user.screen_name}) post has been flagged as ${analysis.category}`,
          duration: 5000,
          className: "bg-card border border-border backdrop-blur-lg text-foreground",
          descriptionClassName: "text-foreground/80",
        });
      }
    });
  } catch (error) {
    console.error('Error in tweet processing:', error);
  }
};

// Setup polling for new tweets
let intervalId: NodeJS.Timeout | null = null;

export const startTwitterPolling = () => {
  if (!intervalId) {
    // Initial fetch
    fetchTweets();
    
    // Set up interval (every 20 seconds for demo purposes)
    intervalId = setInterval(fetchTweets, 20000);
  }
};

export const stopTwitterPolling = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};
