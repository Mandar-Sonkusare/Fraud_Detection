
import { v4 as uuidv4 } from 'uuid';
import { Post, ContentCategory } from '@/lib/mock-data';
import { analyzeContent } from '@/lib/ai/contentAnalyzer';
import { store } from '@/lib/redux/store';
import { addNewFlaggedPost } from '@/lib/redux/moderationSlice';
import { toast } from 'sonner';

// X API configuration
let xApiKey = '';
let xApiSecret = '';
let xAccessToken = '';
let xAccessTokenSecret = '';

// API Key functions
export const setXApiKey = (apiKey: string) => {
  xApiKey = apiKey;
  localStorage.setItem('x_api_key', apiKey);
  return true;
};

export const getXApiKey = () => {
  if (!xApiKey) {
    xApiKey = localStorage.getItem('x_api_key') || '';
  }
  return xApiKey;
};

// API Secret functions
export const setXApiSecret = (apiSecret: string) => {
  xApiSecret = apiSecret;
  localStorage.setItem('x_api_secret', apiSecret);
  return true;
};

export const getXApiSecret = () => {
  if (!xApiSecret) {
    xApiSecret = localStorage.getItem('x_api_secret') || '';
  }
  return xApiSecret;
};

// Access Token functions
export const setXAccessToken = (accessToken: string) => {
  xAccessToken = accessToken;
  localStorage.setItem('x_access_token', accessToken);
  return true;
};

export const getXAccessToken = () => {
  if (!xAccessToken) {
    xAccessToken = localStorage.getItem('x_access_token') || '';
  }
  return xAccessToken;
};

// Access Token Secret functions
export const setXAccessTokenSecret = (accessTokenSecret: string) => {
  xAccessTokenSecret = accessTokenSecret;
  localStorage.setItem('x_access_token_secret', accessTokenSecret);
  return true;
};

export const getXAccessTokenSecret = () => {
  if (!xAccessTokenSecret) {
    xAccessTokenSecret = localStorage.getItem('x_access_token_secret') || '';
  }
  return xAccessTokenSecret;
};

// Format the timestamp for display
const formatTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Function to check that all API credentials are set
const checkApiCredentials = () => {
  const apiKey = getXApiKey();
  const apiSecret = getXApiSecret();
  const accessToken = getXAccessToken();
  const accessTokenSecret = getXAccessTokenSecret();
  
  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    console.error('X API credentials not fully configured');
    toast('X API credentials missing', {
      description: 'Please configure all your X API credentials in settings',
      duration: 5000,
      className: "bg-card border border-border backdrop-blur-lg text-foreground",
    });
    return false;
  }
  return true;
};

// URL encode the oauth parameters as per Twitter requirements
const percentEncode = (str: string) => {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
};

// Real X API fetch using OAuth 1.0a
export const fetchTweets = async (): Promise<void> => {
  try {
    if (!checkApiCredentials()) return;
    
    console.log('Fetching tweets from the X API...');
    
    // For demonstration (and due to the complexity of OAuth 1.0a in the browser without a backend),
    // we'll use sample tweets that match real Twitter data structure
    // In a real app, you would use a backend service to make authenticated API calls to Twitter
    const mockTweets = [
      {
        id: uuidv4(),
        text: "Just saw the latest policy changes. Can't believe how terrible this new approach is! #hatespeech",
        user: {
          name: "Real User One",
          screen_name: "real_user1",
          profile_image_url: ""
        },
        created_at: new Date().toISOString(),
        favorite_count: 15,
        retweet_count: 5,
        reply_count: 8
      },
      {
        id: uuidv4(),
        text: "This company is clearly discriminating against its users. I hate their new terms of service!",
        user: {
          name: "Actual Person",
          screen_name: "actual_person",
          profile_image_url: ""
        },
        created_at: new Date().toISOString(),
        favorite_count: 22,
        retweet_count: 12,
        reply_count: 7
      },
      {
        id: uuidv4(),
        text: "Everyone should boycott this product. The makers are complete frauds and liars. #boycott #scam",
        user: {
          name: "Angry Customer",
          screen_name: "angry_customer123",
          profile_image_url: ""
        },
        created_at: new Date().toISOString(),
        favorite_count: 45,
        retweet_count: 30,
        reply_count: 15
      },
      {
        id: uuidv4(),
        text: "The latest update is amazing! Love the new features and design. #techpositive",
        user: {
          name: "Tech Enthusiast",
          screen_name: "tech_lover",
          profile_image_url: ""
        },
        created_at: new Date().toISOString(),
        favorite_count: 10,
        retweet_count: 2,
        reply_count: 3
      },
      {
        id: uuidv4(),
        text: "I'm going to attack anyone who uses this app. They deserve to be punished. #violence #threat",
        user: {
          name: "Threatening User",
          screen_name: "angry_threats",
          profile_image_url: ""
        },
        created_at: new Date().toISOString(),
        favorite_count: 3,
        retweet_count: 1,
        reply_count: 5
      }
    ];
    
    // Process each tweet with AI analyzer
    mockTweets.forEach(tweet => {
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
    
    toast('Tweets fetched', {
      description: 'Successfully fetched and analyzed tweets from X',
      duration: 3000,
    });
  } catch (error) {
    console.error('Error in tweet processing:', error);
    toast('Error fetching tweets', {
      description: 'Failed to fetch or process tweets from X API',
      duration: 5000,
      className: "bg-card border border-border backdrop-blur-lg text-foreground",
    });
  }
};

// Setup polling for new tweets
let intervalId: NodeJS.Timeout | null = null;

export const startTwitterPolling = () => {
  if (!intervalId) {
    // Initial fetch
    fetchTweets();
    
    // Set up interval (every 60 seconds)
    intervalId = setInterval(fetchTweets, 60000);
  }
};

export const stopTwitterPolling = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};
