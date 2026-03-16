import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { getStats, getHistory, type AnalysisStats } from '@/lib/analysisHistory';
import { Link } from 'react-router-dom';
import ThreatMeter from '@/components/dashboard/ThreatMeter';

export default function Dashboard() {
  const [stats, setStats] = useState<AnalysisStats | null>(null);

  useEffect(() => {
    loadStats();
    
    // Refresh stats every 5 seconds
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = () => {
    setStats(getStats());
  };

  if (!stats || stats.total === 0) {
    return (
      <div className="space-y-8 p-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800
          }}>
            Dashboard
          </h1>
          <p className="mt-2 text-lg" style={{ color: '#475569', fontWeight: 500 }}>
            Fraud detection analytics and statistics
          </p>
        </div>

        <Card className="border-2 shadow-2xl" style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(102, 126, 234, 0.3)'
        }}>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-2xl mb-6" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
            }}>
              <TrendingUp className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#1e293b' }}>No Data Yet</h3>
            <p className="mb-6 max-w-md text-lg" style={{ color: '#475569' }}>
              Start analyzing content in the Fraud Detection page to see statistics and trends here.
            </p>
            <Link to="/moderation">
              <Button className="text-white font-bold shadow-xl" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
              }}>
                Go to Fraud Detection
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskDistributionData = [
    { name: 'Normal', value: stats.normal, color: '#22c55e' },
    { name: 'Suspicious', value: stats.suspicious, color: '#eab308' },
    { name: 'Fraudulent', value: stats.fraudulent, color: '#ef4444' },
  ];

  const fraudTypeData = stats.fraudTypes.map(ft => ({
    name: ft.type,
    count: ft.count,
  }));

  const patternData = stats.commonPatterns.map(p => ({
    name: p.pattern,
    count: p.count,
  }));

  return (
    <div className="space-y-8 p-8 slide-in-up">
      <div>
        <h1 className="text-4xl font-bold tracking-tight" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 800,
          textShadow: '0 2px 10px rgba(102, 126, 234, 0.3)'
        }}>
          Dashboard
        </h1>
        <p className="mt-2 text-lg" style={{ color: '#475569', fontWeight: 500 }}>
          Real-time fraud detection analytics and statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover border-2 border-white/30 bg-white/95 backdrop-blur-xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide">Total Analyzed</CardTitle>
            <div className="p-2 bg-primary/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover border-2 border-white/30 bg-white/95 backdrop-blur-xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide">Normal Content</CardTitle>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.normal}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.normal / stats.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover border-2 border-white/30 bg-white/95 backdrop-blur-xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide">Suspicious</CardTitle>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.suspicious}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.suspicious / stats.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover border-2 border-white/30 bg-white/95 backdrop-blur-xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide">Fraudulent</CardTitle>
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.fraudulent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.fraudulent / stats.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Threat Meter */}
      <ThreatMeter />

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Risk Distribution Pie Chart */}
        <Card className="card-hover border-2 border-white/30 bg-white/95 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span>📊</span>
              Risk Distribution
            </CardTitle>
            <CardDescription className="text-base">
              Breakdown of analyzed content by risk level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Average Risk Score */}
        <Card className="card-hover border-2 border-white/30 bg-white/95 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span>🎯</span>
              Average Risk Score
            </CardTitle>
            <CardDescription className="text-base">
              Overall risk assessment across all analyses
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="text-center">
              <div className={`text-7xl font-bold neon-glow ${
                stats.averageRiskScore < 30 ? 'text-green-600' :
                stats.averageRiskScore < 70 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {stats.averageRiskScore}
              </div>
              <div className="text-sm text-muted-foreground mt-2">out of 100</div>
              <div className={`text-xl font-bold mt-4 px-4 py-2 rounded-lg ${
                stats.averageRiskScore < 30 ? 'bg-green-500/20 text-green-700' :
                stats.averageRiskScore < 70 ? 'bg-yellow-500/20 text-yellow-700' :
                'bg-red-500/20 text-red-700'
              }`}>
                {stats.averageRiskScore < 30 ? '✅ Low Risk' :
                 stats.averageRiskScore < 70 ? '⚠️ Medium Risk' :
                 '🚨 High Risk'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Types and Patterns */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Fraud Types */}
        {fraudTypeData.length > 0 && (
          <Card className="card-hover border-2 border-white/30 bg-white/95 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <span>🚨</span>
                Fraud Types Detected
              </CardTitle>
              <CardDescription className="text-base">
                Most common types of fraud identified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fraudTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '2px solid #ef4444',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Common Patterns */}
        {patternData.length > 0 && (
          <Card className="card-hover border-2 border-white/30 bg-white/95 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <span>🔍</span>
                Common Patterns
              </CardTitle>
              <CardDescription className="text-base">
                Most frequently detected fraud patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={patternData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '2px solid #3b82f6',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
