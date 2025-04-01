
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Search, Filter, ChevronDown, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from '@/lib/redux/hooks';
import { ContentCategory, categoryNames } from '@/lib/mock-data';

const FlaggedUsers = () => {
  const posts = useAppSelector(state => state.moderation.posts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Group posts by username
  const userMap = new Map();
  
  posts.forEach(post => {
    if (!userMap.has(post.username)) {
      userMap.set(post.username, {
        username: post.username,
        handle: post.handle,
        platform: post.platform,
        categories: new Set([post.category]),
        flaggedCount: 1,
        lastFlagged: post.timestamp,
        severity: [post.severity]
      });
    } else {
      const userData = userMap.get(post.username);
      userData.categories.add(post.category);
      userData.flaggedCount += 1;
      userData.severity.push(post.severity);
      
      if (post.timestamp > userData.lastFlagged) {
        userData.lastFlagged = post.timestamp;
      }
    }
  });
  
  // Convert map to array and sort by flagged count
  let users = Array.from(userMap.values()).sort((a, b) => b.flaggedCount - a.flaggedCount);
  
  // Apply filters
  users = users.filter(user => {
    const matchesSearch = search === '' || 
      user.username.toLowerCase().includes(search.toLowerCase()) || 
      user.handle.toLowerCase().includes(search.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || 
      Array.from(user.categories).includes(categoryFilter as ContentCategory);
      
    return matchesSearch && matchesCategory;
  });
  
  const getHighestSeverity = (severities: string[]) => {
    if (severities.includes('high')) return 'high';
    if (severities.includes('medium')) return 'medium';
    return 'low';
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return "text-alert-high";
      case 'medium': return "text-alert-medium";
      case 'low': return "text-alert-low";
      default: return "";
    }
  };
  
  const PlatformIcon = ({ platform }: { platform: string }) => {
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
  
  const getFormattedDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const EmptyState = () => (
    <div className="p-8 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No flagged users found</h3>
      <p className="text-muted-foreground mt-1">
        No users have been flagged based on the current filter criteria
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Flagged Users</h1>
      </div>
      
      <Card className="backdrop-blur-sm bg-card/80 border-border">
        <CardHeader>
          <CardTitle>User Flagging Report</CardTitle>
          <CardDescription>
            View users whose content has been flagged by the AI system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search username or handle..." 
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
                    Filter Category
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                    All Categories
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {Object.entries(categoryNames).map(([key, name]) => (
                    <DropdownMenuItem key={key} onClick={() => setCategoryFilter(key)}>
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {users.length > 0 ? (
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Content Flagged</TableHead>
                    <TableHead>Last Flagged</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const highestSeverity = getHighestSeverity(user.severity);
                    
                    return (
                      <TableRow key={user.handle} className="bg-card/60 backdrop-blur-sm">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
                              {user.username.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium">{user.username}</p>
                              <div className="flex items-center text-muted-foreground text-xs">
                                <PlatformIcon platform={user.platform} />
                                <span className="ml-1">@{user.handle}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Array.from(user.categories).map((category: string) => (
                              <Badge 
                                key={category} 
                                variant="outline" 
                                className="bg-sentinel-500/10 text-sentinel-500 border-sentinel-500/30"
                              >
                                {categoryNames[category as ContentCategory]}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-background/60">
                            {user.flaggedCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {getFormattedDate(user.lastFlagged)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`${getSeverityColor(highestSeverity)} bg-card border-current/30`}
                          >
                            {highestSeverity.charAt(0).toUpperCase() + highestSeverity.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlaggedUsers;
