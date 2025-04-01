
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  ContentCategory, Post, categoryIcons, categoryNames
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronDown, Filter, Search, Check, X, AlertTriangle, 
  MoreHorizontal, Twitter, Facebook, Instagram, ArrowUpDown
} from "lucide-react";
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { bulkApprove, bulkReject } from '@/lib/redux/moderationSlice';
import ModerateButtons from '@/components/moderation/ModerateButtons';
import PostDetails from '@/components/moderation/PostDetails';
import { startTwitterPolling, stopTwitterPolling } from '@/lib/api/xApi';

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString();
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

const SeverityBadge = ({ severity }: { severity: Post['severity'] }) => {
  const colors = {
    low: "bg-alert-low/10 text-alert-low border-alert-low/30",
    medium: "bg-alert-medium/10 text-alert-medium border-alert-medium/30",
    high: "bg-alert-high/10 text-alert-high border-alert-high/30"
  };
  
  return (
    <Badge variant="outline" className={colors[severity]}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
};

const CategoryBadge = ({ category }: { category: ContentCategory }) => {
  const Icon = categoryIcons[category];
  return (
    <Badge variant="outline" className="bg-sentinel-500/10 text-sentinel-500 border-sentinel-500/30">
      <Icon className="h-3 w-3 mr-1" />
      {categoryNames[category]}
    </Badge>
  );
};

const PostCard = ({ post, onViewDetails }: { post: Post, onViewDetails: () => void }) => {
  const formattedDate = post.timestamp.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

  return (
    <Card className="mb-4 relative overflow-hidden backdrop-blur-sm bg-card/80 border-border">
      <div className={`absolute top-0 left-0 w-1 h-full ${
        post.severity === 'high' ? 'bg-alert-high' : 
        post.severity === 'medium' ? 'bg-alert-medium' : 'bg-alert-low'
      }`} />
      
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
                  {post.username.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium">{post.username}</p>
                  <div className="flex items-center text-muted-foreground text-xs">
                    <PlatformIcon platform={post.platform} />
                    <span className="ml-1">@{post.handle}</span>
                  </div>
                </div>
              </div>
              <div className="ml-auto flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <SeverityBadge severity={post.severity} />
                  <Badge variant="outline" className="bg-card/80 border-border/50 text-foreground/70">
                    {formattedDate}
                  </Badge>
                </div>
                <CategoryBadge category={post.category} />
              </div>
            </div>
            
            <p className="text-sm mt-3 mb-4">{post.content}</p>
            
            <div className="flex items-center text-xs text-muted-foreground space-x-4">
              <div className="flex items-center">
                <span>AI Confidence: </span>
                <Badge variant="outline" className="ml-1 bg-sentinel-500/10 text-sentinel-500 border-sentinel-500/30">
                  {Math.round(post.confidence * 100)}%
                </Badge>
              </div>
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
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2 text-xs bg-accent/10 text-accent hover:bg-accent/20"
            onClick={onViewDetails}
          >
            View Details
          </Button>
          
          <ModerateButtons 
            postId={post.id} 
            username={post.username} 
            onViewDetails={onViewDetails}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="p-8 text-center">
    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
      <Search className="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium">No posts found</h3>
    <p className="text-muted-foreground mt-1">
      {message}
    </p>
  </div>
);

const ModerationQueue = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const posts = useAppSelector(state => state.moderation.posts);
  
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    startTwitterPolling();
    return () => {
      stopTwitterPolling();
    };
  }, []);
  
  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || post.status === filter;
    const matchesSearch = search === '' || 
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.username.toLowerCase().includes(search.toLowerCase()) ||
      post.handle.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  const allCount = posts.length;
  const pendingCount = posts.filter(p => p.status === 'pending').length;
  const approvedCount = posts.filter(p => p.status === 'approved').length;
  const rejectedCount = posts.filter(p => p.status === 'rejected').length;
  
  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedPosts.length === 0) {
      toast({
        title: "No posts selected",
        description: "Please select posts to perform this action.",
        variant: "destructive",
      });
      return;
    }
    
    if (action === 'approve') {
      dispatch(bulkApprove(selectedPosts));
      toast({
        title: `${selectedPosts.length} Posts Approved`,
        description: `The selected posts have been approved.`,
      });
    } else {
      dispatch(bulkReject(selectedPosts));
      toast({
        title: `${selectedPosts.length} Posts Rejected`,
        description: `The selected posts have been rejected.`,
      });
    }
    
    setSelectedPosts([]);
  };
  
  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };
  
  const handleSelectPost = (id: string) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(postId => postId !== id));
    } else {
      setSelectedPosts([...selectedPosts, id]);
    }
  };
  
  const handleViewDetails = (post: Post) => {
    setSelectedPost(post);
    setDetailsOpen(true);
  };
  
  const handleRefresh = () => {
    startTwitterPolling();
    toast({
      title: 'Refreshing content',
      description: 'Fetching new content from social media platforms'
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilter(value);
  };

  // Get the right posts for the current tab
  const getPostsForCurrentTab = () => {
    if (activeTab === 'all') return filteredPosts;
    return posts.filter(post => post.status === activeTab && 
      (search === '' || 
        post.content.toLowerCase().includes(search.toLowerCase()) ||
        post.username.toLowerCase().includes(search.toLowerCase()) ||
        post.handle.toLowerCase().includes(search.toLowerCase())));
  };

  const currentTabPosts = getPostsForCurrentTab();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Moderation Queue</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button variant="default" size="sm" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      </div>
      
      <Card className="backdrop-blur-sm bg-card/80 border-border">
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
          <CardDescription>
            Review and moderate content flagged by the AI system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search content, username, or handle..." 
                className="pl-10 bg-background/40 border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem onClick={() => setFilter('all')}>
                    Show All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('pending')}>
                    Pending Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('approved')}>
                    Approved Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('rejected')}>
                    Rejected Only
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort by Date
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort by Severity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="bg-background/40">
              <TabsTrigger value="all" className="relative">
                All <Badge variant="secondary" className="ml-2">{allCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending <Badge variant="secondary" className="ml-2">{pendingCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="relative">
                Approved <Badge variant="secondary" className="ml-2">{approvedCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="relative">
                Rejected <Badge variant="secondary" className="ml-2">{rejectedCount}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              {selectedPosts.length > 0 && (
                <div className="bg-background/30 backdrop-blur-sm p-3 rounded-lg mb-4 flex items-center justify-between border border-border/30">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedPosts.length === filteredPosts.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span>{selectedPosts.length} posts selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-green-600/10 text-green-500 hover:bg-green-600/20 hover:text-green-500"
                      onClick={() => handleBulkAction('approve')}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Approve All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-alert-high/10 text-alert-high hover:bg-alert-high/20 hover:text-alert-high"
                      onClick={() => handleBulkAction('reject')}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Reject All
                    </Button>
                  </div>
                </div>
              )}
              
              {currentTabPosts.length > 0 ? (
                currentTabPosts.map(post => (
                  <div key={post.id} className="flex items-start gap-3">
                    <div className="pt-6">
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={() => handleSelectPost(post.id)}
                      />
                    </div>
                    <div className="flex-1">
                      <PostCard post={post} onViewDetails={() => handleViewDetails(post)} />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No posts found in this category" />
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="mt-4">
              {currentTabPosts.length > 0 ? (
                currentTabPosts.map(post => (
                  <div key={post.id} className="flex items-start gap-3">
                    <div className="pt-6">
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={() => handleSelectPost(post.id)}
                      />
                    </div>
                    <div className="flex-1">
                      <PostCard post={post} onViewDetails={() => handleViewDetails(post)} />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No pending posts found" />
              )}
            </TabsContent>
            
            <TabsContent value="approved" className="mt-4">
              {currentTabPosts.length > 0 ? (
                currentTabPosts.map(post => (
                  <div key={post.id} className="flex items-start gap-3">
                    <div className="pt-6">
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={() => handleSelectPost(post.id)}
                      />
                    </div>
                    <div className="flex-1">
                      <PostCard post={post} onViewDetails={() => handleViewDetails(post)} />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No approved posts found" />
              )}
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-4">
              {currentTabPosts.length > 0 ? (
                currentTabPosts.map(post => (
                  <div key={post.id} className="flex items-start gap-3">
                    <div className="pt-6">
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={() => handleSelectPost(post.id)}
                      />
                    </div>
                    <div className="flex-1">
                      <PostCard post={post} onViewDetails={() => handleViewDetails(post)} />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No rejected posts found" />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PostDetails 
        post={selectedPost} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
      />
    </div>
  );
};

export default ModerationQueue;
