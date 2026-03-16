import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2, AlertCircle, CheckCircle, AlertTriangle, History } from "lucide-react";
import { getHistory, clearHistory, downloadCSV, type AnalysisRecord } from '@/lib/analysisHistory';

export default function AnalysisHistory() {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'normal' | 'suspicious' | 'fraudulent'>('all');

  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadHistory = () => {
    setHistory(getHistory());
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all analysis history?')) {
      clearHistory();
      loadHistory();
    }
  };

  const handleExport = () => {
    downloadCSV();
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(record => record.prediction === filter);

  const getRiskIcon = (prediction: string) => {
    switch (prediction) {
      case 'normal':
        return <CheckCircle className="h-4 w-4" style={{ color: '#00d2ff' }} />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4" style={{ color: '#f093fb' }} />;
      case 'fraudulent':
        return <AlertCircle className="h-4 w-4" style={{ color: '#ff6b6b' }} />;
      default:
        return null;
    }
  };

  const getRiskStyles = (prediction: string) => {
    switch (prediction) {
      case 'normal':
        return {
          badge: 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30',
          border: 'border-neon-blue/30 hover:border-neon-blue/50',
          glow: 'hover:shadow-[0_4px_20px_rgba(0,210,255,0.15)]'
        };
      case 'suspicious':
        return {
          badge: 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30',
          border: 'border-neon-pink/30 hover:border-neon-pink/50',
          glow: 'hover:shadow-[0_4px_20px_rgba(240,147,251,0.15)]'
        };
      case 'fraudulent':
        return {
          badge: 'bg-neon-red/20 text-neon-red border border-neon-red/30',
          border: 'border-neon-red/30 hover:border-neon-red/50',
          glow: 'hover:shadow-[0_4px_20px_rgba(255,107,107,0.15)]'
        };
      default:
        return { badge: '', border: '', glow: '' };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(72, 219, 251, 0.15)' }}>
                <History className="h-5 w-5 text-neon-cyan" />
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Analysis History</span>
            </CardTitle>
            <CardDescription className="text-base mt-2 text-gray-400">
              {history.length} total analyses recorded
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={history.length === 0}
              className="rounded-lg font-semibold transition-all hover:scale-105 bg-neon-cyan/10 border-2 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan/50 disabled:opacity-40"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              disabled={history.length === 0}
              className="rounded-lg font-semibold transition-all hover:scale-105 bg-neon-red/10 border-2 border-neon-red/30 text-neon-red hover:bg-neon-red/20 hover:border-neon-red/50 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' 
              ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white border-none shadow-lg shadow-neon-cyan/30' 
              : 'border-2 border-white/20 text-gray-300 bg-white/5 hover:bg-white/10 hover:border-white/30'
            }
          >
            All ({history.length})
          </Button>
          <Button
            variant={filter === 'normal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('normal')}
            className={filter === 'normal' 
              ? 'bg-neon-blue text-white border-none shadow-lg shadow-neon-blue/30' 
              : 'border-2 border-neon-blue/30 text-neon-blue bg-neon-blue/5 hover:bg-neon-blue/15 hover:border-neon-blue/50'
            }
          >
            ✅ Normal ({history.filter(r => r.prediction === 'normal').length})
          </Button>
          <Button
            variant={filter === 'suspicious' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('suspicious')}
            className={filter === 'suspicious' 
              ? 'bg-neon-pink text-white border-none shadow-lg shadow-neon-pink/30' 
              : 'border-2 border-neon-pink/30 text-neon-pink bg-neon-pink/5 hover:bg-neon-pink/15 hover:border-neon-pink/50'
            }
          >
            ⚠️ Suspicious ({history.filter(r => r.prediction === 'suspicious').length})
          </Button>
          <Button
            variant={filter === 'fraudulent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('fraudulent')}
            className={filter === 'fraudulent' 
              ? 'bg-neon-red text-white border-none shadow-lg shadow-neon-red/30' 
              : 'border-2 border-neon-red/30 text-neon-red bg-neon-red/5 hover:bg-neon-red/15 hover:border-neon-red/50'
            }
          >
            🚨 Fraudulent ({history.filter(r => r.prediction === 'fraudulent').length})
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16">
            <div 
              className="p-4 rounded-2xl inline-block mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(72, 219, 251, 0.15) 0%, rgba(120, 119, 198, 0.15) 100%)',
                boxShadow: '0 4px 20px rgba(72, 219, 251, 0.1)'
              }}
            >
              <History className="h-12 w-12 text-neon-cyan" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">No Analysis History Yet</h3>
            <p className="text-gray-400 text-base">Start analyzing content to see results here.</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredHistory.map((record, index) => {
                const styles = getRiskStyles(record.prediction);
                return (
                  <div
                    key={record.id}
                    className={`stat-card transition-all hover:scale-[1.01] fade-in ${styles.border} ${styles.glow}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="p-1.5 bg-white/5 rounded-lg">
                          {getRiskIcon(record.prediction)}
                        </div>
                        <Badge className={`${styles.badge} font-semibold px-3 py-1`}>
                          {record.prediction.toUpperCase()}
                        </Badge>
                        <Badge className="bg-gradient-to-r from-neon-cyan/15 to-neon-purple/15 border border-neon-cyan/30 text-neon-cyan font-medium px-3 py-1">
                          {record.fraud_type}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg whitespace-nowrap">
                        {formatTimestamp(record.timestamp)}
                      </div>
                    </div>

                    <p className="text-sm mb-4 text-gray-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                      {truncateText(record.text)}
                    </p>

                    <div className="flex items-center gap-4 text-sm font-medium mb-3 flex-wrap">
                      <span className={`px-3 py-1 rounded-lg ${
                        record.risk_score < 30 ? 'bg-neon-blue/15 text-neon-blue' :
                        record.risk_score < 70 ? 'bg-neon-pink/15 text-neon-pink' :
                        'bg-neon-red/15 text-neon-red'
                      }`}>
                        Risk: {record.risk_score.toFixed(1)}/100
                      </span>
                      <span className="text-gray-400">
                        Confidence: {(record.confidence * 100).toFixed(1)}%
                      </span>
                      <span className="text-gray-500">
                        Model: {record.model.toUpperCase()}
                      </span>
                    </div>

                    {record.detected_patterns.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 p-3 bg-neon-red/5 rounded-lg border border-neon-red/20">
                        <span className="text-xs font-semibold text-gray-400 mr-2">Patterns:</span>
                        {record.detected_patterns.map((pattern, idx) => (
                          <Badge key={idx} className="text-xs bg-neon-red/20 border border-neon-red/30 text-neon-red">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
