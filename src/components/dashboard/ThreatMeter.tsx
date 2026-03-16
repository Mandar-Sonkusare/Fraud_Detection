import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getStats } from '@/lib/analysisHistory';

export default function ThreatMeter() {
  const [threatLevel, setThreatLevel] = useState(0);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [isAnimating, setIsAnimating] = useState(false);

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

    const threatPercentage = ((stats.fraudulent + stats.suspicious) / stats.total) * 100;
    setThreatLevel(Math.round(threatPercentage));
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    if (threatPercentage > 40) setTrend('up');
    else if (threatPercentage < 20) setTrend('down');
    else setTrend('stable');
  };

  const getThreatColor = () => {
    if (threatLevel < 20) return '#00d2ff';
    if (threatLevel < 50) return '#f093fb';
    return '#ff6b6b';
  };

  const getThreatLabel = () => {
    if (threatLevel < 20) return '✅ Low Threat';
    if (threatLevel < 50) return '⚠️ Moderate Threat';
    return '🚨 High Threat';
  };

  const getThreatIcon = () => {
    if (threatLevel < 20) return <Shield className="h-8 w-8" style={{ color: '#00d2ff' }} />;
    if (threatLevel < 50) return <AlertTriangle className="h-8 w-8" style={{ color: '#f093fb' }} />;
    return <AlertTriangle className="h-8 w-8 animate-pulse" style={{ color: '#ff6b6b' }} />;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-6 w-6" style={{ color: '#ff6b6b' }} />;
      case 'down':
        return <TrendingDown className="h-6 w-6" style={{ color: '#00d2ff' }} />;
      default:
        return <Minus className="h-6 w-6 text-gray-400" />;
    }
  };

  const color = getThreatColor();

  // Generate gauge segments
  const totalSegments = 30;
  const activeSegments = Math.round((threatLevel / 100) * totalSegments);

  return (
    <Card className="glass-card overflow-hidden relative">
      {/* Subtle background glow based on threat level */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${color}33 0%, transparent 70%)`
        }}
      />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl text-white">
          <div 
            className="p-2.5 rounded-xl transition-all duration-500"
            style={{ 
              background: `${color}20`,
              boxShadow: `0 4px 15px ${color}30`
            }}
          >
            {getThreatIcon()}
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Current Threat Level</span>
        </CardTitle>
        <CardDescription className="text-base text-gray-400">
          Real-time fraud detection rate • Updates every 3 seconds
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div 
              className={`text-7xl font-bold transition-all duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}
              style={{ 
                color,
                fontFamily: 'Space Grotesk, sans-serif',
                textShadow: `0 0 30px ${color}60`
              }}
            >
              {threatLevel}%
            </div>
            <div 
              className="text-lg font-bold mt-3 px-4 py-2 rounded-xl inline-block transition-all duration-500"
              style={{
                background: `${color}15`,
                color,
                border: `1px solid ${color}40`
              }}
            >
              {getThreatLabel()}
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div 
              className="p-4 rounded-xl transition-all duration-500"
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {getTrendIcon()}
            </div>
            <span className="text-sm font-semibold text-gray-400 capitalize">{trend}</span>
          </div>
        </div>

        {/* Segmented Gauge Bar */}
        <div className="flex gap-1 mt-4">
          {Array.from({ length: totalSegments }, (_, i) => (
            <div
              key={i}
              className="flex-1 h-3 rounded-full transition-all duration-500"
              style={{
                background: i < activeSegments 
                  ? `linear-gradient(90deg, ${
                      i / totalSegments < 0.3 ? '#00d2ff' : 
                      i / totalSegments < 0.6 ? '#f093fb' : '#ff6b6b'
                    }, ${
                      i / totalSegments < 0.3 ? '#3a7bd5' : 
                      i / totalSegments < 0.6 ? '#f5576c' : '#ee5a6f'
                    })`
                  : 'rgba(255, 255, 255, 0.05)',
                boxShadow: i < activeSegments 
                  ? `0 0 8px ${
                      i / totalSegments < 0.3 ? 'rgba(0, 210, 255, 0.3)' : 
                      i / totalSegments < 0.6 ? 'rgba(240, 147, 251, 0.3)' : 'rgba(255, 107, 107, 0.3)'
                    }`
                  : 'none',
                transitionDelay: `${i * 20}ms`
              }}
            />
          ))}
        </div>
        
        {/* Gauge Labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </CardContent>
    </Card>
  );
}
