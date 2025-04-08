import React from 'react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Post, categoryNames } from '@/lib/mock-data';
import { Twitter, Facebook, Instagram, Brain, AlertTriangle, Code } from "lucide-react";
import ModerateButtons from './ModerateButtons';

interface PostDetailsProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ExtendedPost extends Post {
  detectedKeywords?: string[];
  contextScore?: number;
  modelName?: string;
  modelAccuracy?: number;
}

const PostDetails: React.FC<PostDetailsProps> = ({ post, open, onOpenChange }) => {
  if (!post) return null;

  const extendedPost = post as ExtendedPost;

  const getFormattedDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getFormattedTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  const PlatformIcon = ({ platform }: { platform: Post['platform'] }) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4 text-[#1DA1F2]" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-[#4267B2]" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-[#E1306C]" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: Post['severity']) => {
    switch (severity) {
      case 'low':
        return "text-alert-low";
      case 'medium':
        return "text-alert-medium";
      case 'high':
        return "text-alert-high";
      default:
        return "";
    }
  };

  const simulateDetectedKeywords = (content: string, category: string): string[] => {
    const categoryKeywords: Record<string, string[]> = {
      'hate_speech': ['hate', 'racist', 'banned', 'those people', 'should'],
      'violence': ['attack', 'hurt', 'violent', 'kill', 'fight'],
      'harassment': ['harass', 'bully', 'stalk', 'follow', 'unwanted'],
      'misinformation': ['fake', 'conspiracy', 'hoax', 'lie', 'propaganda'],
      'scam': ['money', 'offer', 'rich', 'free', 'limited'],
      'explicit': ['nsfw', 'adult', 'explicit', 'dirty', 'inappropriate']
    };
    
    const relevantKeywords = categoryKeywords[category] || [];
    const contentLower = content.toLowerCase();
    const detected = relevantKeywords.filter(keyword => contentLower.includes(keyword));
    
    return detected.length > 0 ? detected : relevantKeywords.slice(0, 2);
  };

  const simulateContextScore = (severity: Post['severity']): number => {
    switch (severity) {
      case 'high': return 0.85 + Math.random() * 0.1;
      case 'medium': return 0.55 + Math.random() * 0.15;
      case 'low': return 0.25 + Math.random() * 0.2;
      default: return 0.5;
    }
  };

  const detectedKeywords = extendedPost.detectedKeywords || 
    simulateDetectedKeywords(post.content, post.category);
    
  const contextScore = extendedPost.contextScore || simulateContextScore(post.severity);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card backdrop-blur-xl border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Content Details</DialogTitle>
          <DialogDescription>
            Detailed information about the flagged content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
                {post.username.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold">{post.username}</p>
                <div className="flex items-center text-muted-foreground text-xs">
                  <PlatformIcon platform={post.platform} />
                  <span className="ml-1">@{post.handle}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Badge variant="outline" className={`${getSeverityColor(post.severity)} bg-card border-current/30`}>
                {post.severity.charAt(0).toUpperCase() + post.severity.slice(1)} Severity
              </Badge>
              <span className="text-sm text-muted-foreground mt-1">
                {getFormattedDate(post.timestamp)} {getFormattedTime(post.timestamp)}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Content</h3>
            <div className="p-4 rounded-md bg-background/70 backdrop-blur-sm">
              <p className="text-foreground">{post.content}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <Badge className="bg-sentinel-500/20 text-sentinel-500 hover:bg-sentinel-500/30">
                  {categoryNames[post.category]}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">AI Confidence</h3>
                <div className="flex items-center">
                  <div className="w-full bg-background rounded-full h-2.5">
                    <div 
                      className="bg-accent h-2.5 rounded-full" 
                      style={{ width: `${(post.confidence || 0) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm">{Math.round((post.confidence || 0) * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {post.modelAccuracy && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-1" />
                    ML Model Accuracy
                  </h3>
                  <div className="flex items-center">
                    <div className="w-full bg-background rounded-full h-2.5">
                      <div 
                        className="bg-sentinel-500 h-2.5 rounded-full" 
                        style={{ width: `${post.modelAccuracy}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{Math.round(post.modelAccuracy)}%</span>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Context Score
                </h3>
                <div className="flex items-center">
                  <div className="w-full bg-background rounded-full h-2.5">
                    <div 
                      className={`${
                        contextScore > 0.7 ? 'bg-alert-high' : 
                        contextScore > 0.4 ? 'bg-alert-medium' : 
                        'bg-alert-low'
                      } h-2.5 rounded-full`}
                      style={{ width: `${Math.round(contextScore * 100)}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm">{Math.round(contextScore * 100)}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Detected Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {detectedKeywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`bg-${post.severity === 'high' ? 'alert-high' : post.severity === 'medium' ? 'alert-medium' : 'alert-low'}/10 border-${post.severity === 'high' ? 'alert-high' : post.severity === 'medium' ? 'alert-medium' : 'alert-low'}/30 font-mono text-xs`}
                  >
                    <Code className="h-3 w-3 mr-1" /> {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center text-xs text-muted-foreground space-x-6">
            {post.metadata && (
              <>
                {post.metadata.likes !== undefined && (
                  <div>Likes: {post.metadata.likes}</div>
                )}
                {post.metadata.shares !== undefined && (
                  <div>Shares: {post.metadata.shares}</div>
                )}
                {post.metadata.replies !== undefined && (
                  <div>Replies: {post.metadata.replies}</div>
                )}
              </>
            )}
          </div>
          
          <div className="p-3 rounded-md bg-sentinel-500/5 border border-sentinel-500/20">
            <div className="flex items-center">
              <Brain className="h-4 w-4 text-sentinel-500 mr-2" />
              <span className="text-sm font-medium">AI Model</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {extendedPost.modelName || "HateBERT by Groningen NLP"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Analysis completed in {(Math.random() * 0.5 + 0.1).toFixed(2)} seconds
            </p>
          </div>

          <Separator />

          <div className="flex justify-end">
            <ModerateButtons postId={post.id} username={post.username} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetails;
