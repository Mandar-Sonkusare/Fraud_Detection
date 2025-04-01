
import { v4 as uuidv4 } from 'uuid';
import { Post, ContentCategory } from '@/lib/mock-data';
import { analyzeContent } from '@/lib/ai/contentAnalyzer';
import { store } from '@/lib/redux/store';
import { addNewFlaggedPost } from '@/lib/redux/moderationSlice';
import { toast } from 'sonner';

// Sample X API data (mock)
const mockTweets = [
  {
    id: "1",
    text: "I can't believe how terrible this product is. Absolute scam!",
    user: {
      screen_name: "angry_customer",
      name: "Angry Customer",
      profile_image_url: ""
    },
    created_at: "2023-04-01T12:00:00Z",
    favorite_count: 5,
    retweet_count: 2,
    reply_count: 3
  },
  {
    id: "2",
    text: "This company is discriminating against me. I hate their policies!",
    user: {
      screen_name: "unsatisfied_user",
      name: "Unsatisfied User",
      profile_image_url: ""
    },
    created_at: "2023-04-01T12:30:00Z",
    favorite_count: 15,
    retweet_count: 8,
    reply_count: 10
  },
  {
    id: "3",
    text: "I'm going to kill it at my presentation tomorrow. So excited!",
    user: {
      screen_name: "enthusiastic_speaker",
      name: "Enthusiastic Speaker",
      profile_image_url: ""
    },
    created_at: "2023-04-01T13:00:00Z",
    favorite_count: 25,
    retweet_count: 3,
    reply_count: 5
  },
  {
    id: "4",
    text: "The conspiracy around this vaccine is ridiculous. Stop spreading fake news!",
    user: {
      screen_name: "science_advocate",
      name: "Science Advocate",
      profile_image_url: ""
    },
    created_at: "2023-04-01T13:30:00Z",
    favorite_count: 50,
    retweet_count: 20,
    reply_count: 15
  },
  {
    id: "5",
    text: "Check out my new blog post about cybersecurity threats. Link in bio!",
    user: {
      screen_name: "tech_blogger",
      name: "Tech Blogger",
      profile_image_url: ""
    },
    created_at: "2023-04-01T14:00:00Z",
    favorite_count: 30,
    retweet_count: 10,
    reply_count: 5
  }
];

// Format the timestamp for display
const formatTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Simulated X API fetch
export const fetchTweets = async (): Promise<void> => {
  try {
    // In a real app, this would fetch from the Twitter API
    // const response = await fetch('https://api.twitter.com/2/tweets/search/recent?query=...',
    // { headers: { Authorization: `Bearer ${API_KEY}` } });
    // const data = await response.json();

    // Using mock data instead
    setTimeout(() => {
      const tweets = [...mockTweets];
      
      // Process each tweet with AI analyzer
      tweets.forEach(tweet => {
        const analysis = analyzeContent(tweet.text);
        
        if (analysis.isFlagged) {
          // Convert to our Post format
          const post: Post = {
            id: uuidv4(),
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
            description: `${tweet.user.name} (@${tweet.user.screen_name}) post has been flagged as ${analysis.category}`,
            duration: 5000,
            className: "bg-card border border-border backdrop-blur-lg text-foreground",
            descriptionClassName: "text-foreground/80",
          });
        }
      });
    }, 3000); // Simulate API delay
  } catch (error) {
    console.error('Error fetching tweets:', error);
  }
};

// Setup polling for new tweets (simulated real-time)
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
