import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { getHistory, clearHistory, downloadCSV, type AnalysisRecord } from '@/lib/analysisHistory';

export default function AnalysisHistory() {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'normal' | 'suspicious' | 'fraudulent'>('all');

  useEffect(() => {
    loadHistory();
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
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'fraudulent':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getRiskBadgeColor = (prediction: string) => {
    switch (prediction) {
      case 'normal':
        return 'bg-green-500/20 text-green-700 hover:bg-green-500/30';
      case 'suspicious':
        return 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30';
      case 'fraudulent':
        return 'bg-red-500/20 text-red-700 hover:bg-red-500/30';
      default:
        return '';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="border-2 border-white/30 bg-white/95 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span>📜</span>
              Analysis History
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {history.length} total analyses recorded
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={history.length === 0}
              className="border-2 hover:bg-primary/10 hover:border-primary transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              disabled={history.length === 0}
              className="border-2 hover:bg-destructive/10 hover:border-destructive transition-all"
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
            className={filter === 'all' ? 'bg-gradient-to-r from-primary to-primary/80' : 'border-2'}
          >
            All ({history.length})
          </Button>
          <Button
            variant={filter === 'normal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('normal')}
            className={filter === 'normal' ? 'bg-green-600 hover:bg-green-700' : 'border-2 border-green-500/30 hover:bg-green-500/10'}
          >
            ✅ Normal ({history.filter(r => r.prediction === 'normal').length})
          </Button>
          <Button
            variant={filter === 'suspicious' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('suspicious')}
            className={filter === 'suspicious' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-2 border-yellow-500/30 hover:bg-yellow-500/10'}
          >
            ⚠️ Suspicious ({history.filter(r => r.prediction === 'suspicious').length})
          </Button>
          <Button
            variant={filter === 'fraudulent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('fraudulent')}
            className={filter === 'fraudulent' ? 'bg-red-600 hover:bg-red-700' : 'border-2 border-red-500/30 hover:bg-red-500/10'}
          >
            🚨 Fraudulent ({history.filter(r => r.prediction === 'fraudulent').length})
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="p-4 bg-accent/20 rounded-2xl inline-block mb-4">
              <AlertCircle className="h-12 w-12" />
            </div>
            <p className="text-lg font-medium">No analysis history yet.</p>
            <p className="text-sm mt-2">Start analyzing content to see results here.</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredHistory.map((record, index) => (
                <div
                  key={record.id}
                  className="border-2 rounded-xl p-5 hover:bg-accent/30 transition-all hover:shadow-lg hover:scale-[1.01] fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="p-1.5 bg-white/50 rounded-lg">
                        {getRiskIcon(record.prediction)}
                      </div>
                      <Badge className={`${getRiskBadgeColor(record.prediction)} font-semibold px-3 py-1`}>
                        {record.prediction.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="border-2 border-primary/30 bg-primary/5 font-medium">
                        {record.fraud_type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground bg-accent/30 px-3 py-1 rounded-lg">
                      {formatTimestamp(record.timestamp)}
                    </div>
                  </div>

                  <p className="text-sm mb-4 text-foreground/90 leading-relaxed bg-accent/10 p-3 rounded-lg">
                    {truncateText(record.text)}
                  </p>

                  <div className="flex items-center gap-4 text-sm font-medium mb-3">
                    <span className={`px-3 py-1 rounded-lg ${
                      record.risk_score < 30 ? 'bg-green-500/20 text-green-700' :
                      record.risk_score < 70 ? 'bg-yellow-500/20 text-yellow-700' :
                      'bg-red-500/20 text-red-700'
                    }`}>
                      Risk: {record.risk_score.toFixed(1)}/100
                    </span>
                    <span className="text-muted-foreground">
                      Confidence: {(record.confidence * 100).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">
                      Model: {record.model.toUpperCase()}
                    </span>
                  </div>

                  {record.detected_patterns.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                      <span className="text-xs font-semibold text-muted-foreground mr-2">Patterns:</span>
                      {record.detected_patterns.map((pattern, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-destructive/20 border border-destructive/30">
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
