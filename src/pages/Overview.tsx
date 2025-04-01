
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, ArrowRight, ClipboardCheck, Clock, MessageSquare, Settings, 
  Shield, ShieldAlert, ShieldCheck, Twitter 
} from 'lucide-react';
import { generateMockPosts, generateMockStats } from '@/lib/mock-data';

const Overview = () => {
  const stats = generateMockStats();
  const recentPosts = generateMockPosts(3);
  
  // Format for percentage
  const formatPercent = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };
  
  // Mock AI status
  const aiStatus = {
    status: 'operational',
    uptime: '99.8%',
    lastTraining: '3 days ago',
    accuracy: 0.92,
    confidence: 0.87,
    pendingRetraining: true
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Social Sentinel AI</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and moderate social media content with AI-powered detection
          </p>
        </div>
      </div>
      
      {/* System status */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-accent" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">AI Status</span>
                <div className="flex items-center mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse-slow"></div>
                  <span className="font-medium">Operational</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <span className="font-medium mt-1.5">{aiStatus.uptime}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Last Training</span>
                <span className="font-medium mt-1.5">{aiStatus.lastTraining}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">X API Status</span>
                <div className="flex items-center mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse-slow"></div>
                  <span className="font-medium">Connected</span>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">AI Accuracy</span>
                  <span className="text-sm font-medium">{formatPercent(aiStatus.accuracy)}</span>
                </div>
                <Progress value={aiStatus.accuracy * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Average Confidence</span>
                  <span className="text-sm font-medium">{formatPercent(aiStatus.confidence)}</span>
                </div>
                <Progress value={aiStatus.confidence * 100} className="h-2" />
              </div>
            </div>
            
            {aiStatus.pendingRetraining && (
              <div className="mt-4 p-3 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-accent mr-2" />
                  <span className="text-sm">AI model is due for retraining based on recent moderation data</span>
                </div>
                <Button variant="outline" size="sm" className="text-accent border-accent/50 hover:bg-accent/10">
                  Retrain Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5 text-accent" />
              Moderation Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-3xl font-bold">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Posts awaiting review</p>
          </CardContent>
          <CardFooter>
            <Link to="/moderation" className="w-full">
              <Button variant="outline" className="w-full">
                View Queue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      {/* Activity summary */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 overflow-hidden">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Recently flagged content from social media
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <div key={post.id} className="p-4 rounded-md bg-card border border-border overflow-hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium mr-3">
                        {post.username.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{post.username}</span>
                          <div className="flex items-center text-muted-foreground text-xs ml-2">
                            <Twitter className="h-3 w-3 text-[#1DA1F2] mr-1" />
                            <span>@{post.handle}</span>
                          </div>
                        </div>
                        <div className="flex mt-1">
                          <Badge variant="outline" className={
                            `mr-2 ${post.severity === 'high' 
                              ? 'bg-alert-high/10 text-alert-high border-alert-high/30' 
                              : post.severity === 'medium' 
                                ? 'bg-alert-medium/10 text-alert-medium border-alert-medium/30' 
                                : 'bg-alert-low/10 text-alert-low border-alert-low/30'
                            }`
                          }>
                            {post.severity.charAt(0).toUpperCase() + post.severity.slice(1)} Severity
                          </Badge>
                          <Badge variant="outline" className="bg-sentinel-500/10 text-sentinel-500 border-sentinel-500/30">
                            {post.category
                              .split('_')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <p className="text-sm mt-3">{post.content}</p>
                  
                  <div className="flex mt-4 justify-end gap-2">
                    <Button variant="outline" size="sm" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="bg-alert-high/10 text-alert-high hover:bg-alert-high/20 hover:text-alert-high">
                      <ShieldAlert className="mr-1 h-3 w-3" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/moderation">
                <Button variant="ghost" className="text-accent hover:text-accent">
                  View all flagged content
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5 text-accent" />
                Today's Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Flagged Posts</span>
                  <span className="font-medium">{68 + Math.floor(Math.random() * 20)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Reviewed</span>
                  <span className="font-medium">{42 + Math.floor(Math.random() * 15)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending</span>
                  <span className="font-medium">{12 + Math.floor(Math.random() * 10)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">False Positives</span>
                  <span className="font-medium">{3 + Math.floor(Math.random() * 5)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-accent" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/moderation">
                <Button variant="outline" className="w-full justify-start">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Review Pending Posts
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure API Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;
