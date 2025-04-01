
import React from 'react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Post, categoryNames } from '@/lib/mock-data';
import { Twitter, Facebook, Instagram } from "lucide-react";
import ModerateButtons from './ModerateButtons';

interface PostDetailsProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostDetails: React.FC<PostDetailsProps> = ({ post, open, onOpenChange }) => {
  if (!post) return null;

  const getFormattedDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
                {getFormattedDate(post.timestamp)}
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
                    style={{ width: `${post.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm">{Math.round(post.confidence * 100)}%</span>
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
