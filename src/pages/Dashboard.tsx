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
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = () => {
    setStats(getStats());
  };

  if (!stats || stats.total === 0) {
    return (
      <div className="space-y-8 p-8 slide-in">
        <div>
          <h1 className="text-5xl font-bold tracking-tight gradient-text mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Dashboard
          </h1>
          <p className="text-lg text-gray-400">
            Fraud detection analytics and statistics
          </p>
        </div>

        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div 
              className="p-4 rounded-2xl mb-6 float"
              style={{
                background: 'linear-gradient(135deg, #48dbfb 0%, #7877c6 100%)',
                boxShadow: '0 8px 30px rgba(72, 219, 251, 0.4)'
              }}
            >
              <TrendingUp className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">No Data Yet</h3>
            <p className="mb-6 max-w-md text-lg text-gray-400">
              Start analyzing content in the Fraud Detection page to see statistics and trends here.
            </p>
            <Link to="/moderation">
              <button className="neon-button">
                Go to Fraud Detection
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskDistributionData = [
    { name: 'Normal', value: stats.normal, color: '#00d2ff' },
    { name: 'Suspicious', value: stats.suspicious, color: '#f093fb' },
    { name: 'Fraudulent', value: stats.fraudulent, color: '#ff6b6b' },
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
    <div className="space-y-8 p-8 slide-in">
      <div>
        <h1 className="text-5xl font-bold tracking-tight gradient-text mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-lg text-gray-400">
          Real-time fraud detection analytics and statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-cyan-400">Total Analyzed</CardTitle>
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'rgba(72, 219, 251, 0.2)' }}
            >
              <TrendingUp className="h-5 w-5 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">{stats.total}</div>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-cyan-400">Normal Content</CardTitle>
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'rgba(0, 210, 255, 0.2)' }}
            >
              <CheckCircle className="h-5 w-5" style={{ color: '#00d2ff' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: '#00d2ff' }}>{stats.normal}</div>
            <p className="text-xs text-gray-400 mt-1">
              {((stats.normal / stats.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-cyan-400">Suspicious</CardTitle>
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'rgba(240, 147, 251, 0.2)' }}
            >
              <AlertTriangle className="h-5 w-5" style={{ color: '#f093fb' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: '#f093fb' }}>{stats.suspicious}</div>
            <p className="text-xs text-gray-400 mt-1">
              {((stats.suspicious / stats.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-cyan-400">Fraudulent</CardTitle>
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'rgba(255, 107, 107, 0.2)' }}
            >
              <AlertCircle className="h-5 w-5" style={{ color: '#ff6b6b' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: '#ff6b6b' }}>{stats.fraudulent}</div>
            <p className="text-xs text-gray-400 mt-1">
              {((stats.fraudulent / stats.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Threat Meter */}
      <ThreatMeter />

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <span>📊</span>
              Risk Distribution
            </CardTitle>
            <CardDescription className="text-base text-gray-400">
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
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    border: '2px solid rgba(72, 219, 251, 0.5)',
                    borderRadius: '8px',
                    color: '#000000',
                    fontWeight: 'bold',
                    padding: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}
                  labelStyle={{ color: '#000000', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <span>🎯</span>
              Average Risk Score
            </CardTitle>
            <CardDescription className="text-base text-gray-400">
              Overall risk assessment across all analyses
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="text-center">
              <div 
                className="text-7xl font-bold pulse"
                style={{
                  color: stats.averageRiskScore < 30 ? '#00d2ff' : stats.averageRiskScore < 70 ? '#f093fb' : '#ff6b6b'
                }}
              >
                {stats.averageRiskScore}
              </div>
              <div className="text-sm text-gray-400 mt-2">out of 100</div>
              <div 
                className="text-xl font-bold mt-4 px-4 py-2 rounded-lg"
                style={{
                  background: stats.averageRiskScore < 30 
                    ? 'rgba(0, 210, 255, 0.2)' 
                    : stats.averageRiskScore < 70 
                    ? 'rgba(240, 147, 251, 0.2)' 
                    : 'rgba(255, 107, 107, 0.2)',
                  color: stats.averageRiskScore < 30 ? '#00d2ff' : stats.averageRiskScore < 70 ? '#f093fb' : '#ff6b6b'
                }}
              >
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
        {fraudTypeData.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <span>🚨</span>
                Fraud Types Detected
              </CardTitle>
              <CardDescription className="text-base text-gray-400">
                Most common types of fraud identified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={fraudTypeData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={120} 
                    stroke="#ffffff"
                    interval={0}
                  />
                  <YAxis stroke="#ffffff" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.95)', 
                      border: '2px solid rgba(255, 107, 107, 0.5)',
                      borderRadius: '8px',
                      color: '#000000',
                      fontWeight: 'bold',
                      padding: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                    }}
                    labelStyle={{ color: '#000000', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" fill="#ff6b6b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {patternData.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <span>🔍</span>
                Common Patterns
              </CardTitle>
              <CardDescription className="text-base text-gray-400">
                Most frequently detected fraud patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={patternData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={120} 
                    stroke="#ffffff"
                    interval={0}
                  />
                  <YAxis stroke="#ffffff" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.95)', 
                      border: '2px solid rgba(72, 219, 251, 0.5)',
                      borderRadius: '8px',
                      color: '#000000',
                      fontWeight: 'bold',
                      padding: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                    }}
                    labelStyle={{ color: '#000000', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" fill="#48dbfb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
