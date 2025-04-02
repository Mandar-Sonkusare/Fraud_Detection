
import { v4 as uuidv4 } from 'uuid';
import { Post, ContentCategory } from '@/lib/mock-data';
import { analyzeContent } from '@/lib/ai/contentAnalyzer';
import { store } from '@/lib/redux/store';
import { addNewFlaggedPost } from '@/lib/redux/moderationSlice';
import { toast } from 'sonner';

// X API configuration
let xApiKey = '';

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

// Format the timestamp for display
const formatTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Real X API fetch
export const fetchTweets = async (): Promise<void> => {
  try {
    const apiKey = getXApiKey();
    
    if (!apiKey) {
      console.error('X API key not configured');
      toast('X API key missing', {
        description: 'Please configure your X API key in settings',
        duration: 5000,
        className: "bg-card border border-border backdrop-blur-lg text-foreground",
      });
      return;
    }
    
    // Real API call to X API
    // Note: Using a dummy response for now until the user provides the API key
    // The code below will be replaced with actual API call once the key is provided
    
    let tweets = [];
    
    try {
      // This is where the real API call would happen
      // const response = await fetch('https://api.twitter.com/2/tweets/search/recent', {
      //   headers: {
      //     'Authorization': `Bearer ${apiKey}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();
      // tweets = data.data;
      
      // Using mock data for now
      tweets = [
        {
          id: uuidv4(),
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
          id: uuidv4(),
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
        }
      ];
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
