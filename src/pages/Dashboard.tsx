
import React, { useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateMockStats } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, BarChart3, Clock, Shield } from 'lucide-react';
import { 
  AreaChart, Area, BarChart as RechartBarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, TooltipProps 
} from 'recharts';
import { useAppSelector } from '@/lib/redux/hooks';
import { startTwitterPolling } from '@/lib/api/xApi';

const Dashboard = () => {
  const stats = generateMockStats();
  const moderationStats = useAppSelector(state => state.moderation.stats);
  const posts = useAppSelector(state => state.moderation.posts);
  
  // Start Twitter polling when dashboard loads
  useEffect(() => {
    startTwitterPolling();
  }, []);
  
  // Calculate category data from real posts
  const categoryCountMap: Record<string, number> = {};
  posts.forEach(post => {
    if (post.category) {
      categoryCountMap[post.category] = (categoryCountMap[post.category] || 0) + 1;
    }
  });
  
  const categoryData = Object.entries(categoryCountMap).map(([category, count]) => ({
    name: category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    value: count
  }));
  
  // Calculate platform data from real posts
  const platformCountMap: Record<string, number> = {};
  posts.forEach(post => {
    platformCountMap[post.platform] = (platformCountMap[post.platform] || 0) + 1;
  });
  
  const platformData = Object.entries(platformCountMap).map(([platform, count]) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value: count
  }));
  
  // Calculate severity data from real posts
  const severityCountMap: Record<string, number> = {};
  posts.forEach(post => {
    severityCountMap[post.severity] = (severityCountMap[post.severity] || 0) + 1;
  });
  
  const severityData = Object.entries(severityCountMap).map(([severity, count]) => ({
    name: severity.charAt(0).toUpperCase() + severity.slice(1),
    value: count
  }));
  
  // Format data for recharts: last 7 days of data
  const today = new Date();
  const dailyTrendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    
    // Count posts for this day
    const dayStr = date.toISOString().split('T')[0];
    const dayPosts = posts.filter(p => {
      const postDate = new Date(p.timestamp);
      return postDate.toISOString().split('T')[0] === dayStr;
    });
    
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      flagged: dayPosts.length,
      resolved: dayPosts.filter(p => p.status === 'approved' || p.status === 'rejected').length
    };
  });
  
  // Colors for pie charts
  const SEVERITY_COLORS = ['#33C3F0', '#F97316', '#ea384c'];
  const CATEGORY_COLORS = ['#8b5cf6', '#7e69ab', '#6e59a5', '#3d328c', '#1A1F2C', '#9b87f5', '#b1a0ff', '#cbc2ff'];
  const PLATFORM_COLORS = ['#1DA1F2', '#4267B2', '#E1306C'];

  // Custom formatter for percentages to fix the TypeScript error
  const percentFormatter = (value: number | string) => {
    if (typeof value === 'number') {
      return `${value.toFixed(1)}%`;
    }
    return `${value}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Flagged Content
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderationStats.totalFlagged.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderationStats.pending.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              <Badge variant="outline" className="bg-alert-medium/10 text-alert-medium border-alert-medium/20">
                <ArrowUp className="mr-1 h-3 w-3" />
                +{Math.round(moderationStats.pending / (moderationStats.totalFlagged || 1) * 100)}% of total
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolution Rate
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((moderationStats.approved + moderationStats.rejected) / (moderationStats.totalFlagged || 1) * 100)}%
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <ArrowUp className="mr-1 h-3 w-3" />
                Updated in real-time
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approval Rate
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(moderationStats.approvalRate * 100)}%</div>
            <div className="flex items-center gap-1 text-xs">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <ArrowDown className="mr-1 h-3 w-3" />
                Rejection: {Math.round(moderationStats.rejectionRate * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Trends</CardTitle>
              <CardDescription>
                Flagged content vs resolved over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyTrendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorFlagged" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid #3f4865',
                      borderRadius: '6px',
                      color: '#fff' 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="flagged" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorFlagged)" 
                    name="Flagged"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#22c55e" 
                    fillOpacity={1} 
                    fill="url(#colorResolved)" 
                    name="Resolved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>By Severity</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[index % SEVERITY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid #3f4865',
                        borderRadius: '6px',
                        color: '#fff' 
                      }}
                      formatter={(value) => [value, 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Moderation Metrics</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={[
                      { name: 'Approval Rate', value: moderationStats.approvalRate * 100 },
                      { name: 'Rejection Rate', value: moderationStats.rejectionRate * 100 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip 
                      formatter={(value) => {
                        return typeof value === 'number' ? [`${value.toFixed(1)}%`, 'Rate'] : [`${value}%`, 'Rate'];
                      }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid #3f4865',
                        borderRadius: '6px',
                        color: '#fff' 
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#8b5cf6" 
                      radius={[4, 4, 0, 0]} 
                      label={{ position: 'top', fill: '#888', fontSize: 12 }}
                    />
                  </RechartBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Categories</CardTitle>
              <CardDescription>
                Distribution of flagged content by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid #3f4865',
                        borderRadius: '6px',
                        color: '#fff' 
                      }}
                      formatter={(value) => [value, 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                    <XAxis type="number" stroke="#888888" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="#888888" 
                      width={90}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid #3f4865',
                        borderRadius: '6px',
                        color: '#fff' 
                      }}
                      formatter={(value) => [value, 'Count']}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#8b5cf6" 
                      radius={[0, 4, 4, 0]} 
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Bar>
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Breakdown</CardTitle>
              <CardDescription>
                Distribution of flagged content by platform
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid #3f4865',
                        borderRadius: '6px',
                        color: '#fff' 
                      }}
                      formatter={(value) => [value, 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={platformData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid #3f4865',
                        borderRadius: '6px',
                        color: '#fff' 
                      }}
                      formatter={(value) => [value, 'Count']}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]} 
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                      ))}
                    </Bar>
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
