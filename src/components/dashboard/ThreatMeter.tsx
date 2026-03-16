import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, TrendingUp } from "lucide-react";
import { getStats } from '@/lib/analysisHistory';

export default function ThreatMeter() {
  const [threatLevel, setThreatLevel] = useState(0);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    updateThreatLevel();
    const interval = setInterval(updateThreatLevel, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateThreatLevel = () => {
    const stats = getStats();
    if (stats.total === 0) {
      setThreatLevel(0);
      return;
    }

    // Calculate threat level based on recent fraudulent/suspicious content
    const threatPercentage = ((stats.fraudulent + stats.suspicious) / stats.total) * 100;
    setThreatLevel(Math.round(threatPercentage));

    // Determine trend (simplified - in production, compare with historical data)
    if (threatPercentage > 40) setTrend('up');
    else if (threatPercentage < 20) setTrend('down');
    else setTrend('stable');
  };

  const getThreatColor = () => {
    if (threatLevel < 20) return 'text-green-600';
    if (threatLevel < 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getThreatBgColor = () => {
    if (threatLevel < 20) return 'from-green-500/10 to-green-500/5 border-green-500/30';
    if (threatLevel < 50) return 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/30';
    return 'from-red-500/10 to-red-500/5 border-red-500/30';
  };

  const getThreatLabel = () => {
    if (threatLevel < 20) return '✅ Low Threat';
    if (threatLevel < 50) return '⚠️ Moderate Threat';
    return '🚨 High Threat';
  };

  const getThreatIcon = () => {
    if (threatLevel < 20) return <Shield className="h-10 w-10 text-green-600" />;
    if (threatLevel < 50) return <AlertTriangle className="h-10 w-10 text-yellow-600" />;
    return <AlertTriangle className="h-10 w-10 text-red-600 animate-pulse" />;
  };

  return (
    <Card className="border-2 border-white/30 bg-white/95 backdrop-blur-xl shadow-xl card-hover bg-gradient-to-br ${getThreatBgColor()}">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-white/50 rounded-lg">
            {getThreatIcon()}
          </div>
          <span>Current Threat Level</span>
        </CardTitle>
        <CardDescription className="text-base">
          Real-time fraud detection rate • Updates every 3 seconds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className={`text-7xl font-bold neon-glow ${getThreatColor()}`}>
              {threatLevel}%
            </div>
            <div className={`text-xl font-bold mt-3 px-4 py-2 rounded-lg inline-block ${
              threatLevel < 20 ? 'bg-green-500/20 text-green-700' :
              threatLevel < 50 ? 'bg-yellow-500/20 text-yellow-700' :
              'bg-red-500/20 text-red-700'
            }`}>
              {getThreatLabel()}
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 p-4 bg-white/50 rounded-xl">
            <TrendingUp 
              className={`h-16 w-16 transition-all duration-500 ${
                trend === 'up' ? 'text-red-500 rotate-0' :
                trend === 'down' ? 'text-green-500 rotate-180' :
                'text-gray-400 rotate-90'
              }`}
            />
            <span className="text-sm font-semibold text-muted-foreground capitalize">{trend}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-500 risk-progress ${
              threatLevel < 20 ? 'bg-gradient-to-r from-green-500 to-green-600' :
              threatLevel < 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
              'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            style={{ width: `${threatLevel}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
