
import React from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateMockPosts, generateMockStats } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, BarChart3, Clock, Shield } from 'lucide-react';
import { 
  AreaChart, Area, BarChart as RechartBarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const Dashboard = () => {
  const stats = generateMockStats();
  
  // Format data for recharts
  const dailyTrendData = stats.dailyTrends.map(day => ({
    name: day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    flagged: day.flagged,
    resolved: day.resolved
  }));
  
  const categoryData = Object.entries(stats.flaggedByCategory).map(([category, count]) => ({
    name: category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    value: count
  }));
  
  const platformData = Object.entries(stats.flaggedByPlatform).map(([platform, count]) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value: count
  }));
  
  const severityData = Object.entries(stats.flaggedBySeverity).map(([severity, count]) => ({
    name: severity.charAt(0).toUpperCase() + severity.slice(1),
    value: count
  }));
  
  // Colors for pie charts
  const SEVERITY_COLORS = ['#33C3F0', '#F97316', '#ea384c'];
  const CATEGORY_COLORS = ['#8b5cf6', '#7e69ab', '#6e59a5', '#3d328c', '#1A1F2C', '#9b87f5', '#b1a0ff', '#cbc2ff'];
  const PLATFORM_COLORS = ['#1DA1F2', '#4267B2', '#E1306C'];

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
            <div className="text-2xl font-bold">{stats.totalFlagged.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
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
            <div className="text-2xl font-bold">{stats.pending.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              <Badge variant="outline" className="bg-alert-medium/10 text-alert-medium border-alert-medium/20">
                <ArrowUp className="mr-1 h-3 w-3" />
                +12% from yesterday
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
            <div className="text-2xl font-bold">{Math.round(stats.resolved / stats.totalFlagged * 100)}%</div>
            <div className="flex items-center gap-1 text-xs">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <ArrowUp className="mr-1 h-3 w-3" />
                +4% from last week
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Resolution Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.moderationStats.averageResolutionTime} min</div>
            <div className="flex items-center gap-1 text-xs">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <ArrowDown className="mr-1 h-3 w-3" />
                -2.3 min from last week
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
                Flagged content vs resolved over the last 7 days
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
                      { name: 'Approval Rate', value: stats.moderationStats.approvalRate * 100 },
                      { name: 'Rejection Rate', value: stats.moderationStats.rejectionRate * 100 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip 
                      formatter={(value) => [`${value.toFixed(1)}%`, 'Rate']}
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
