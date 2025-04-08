
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, AlertTriangle, CheckCircle, Code, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { categoryNames } from '@/lib/mock-data';
import { analyzeContent } from '@/lib/ai/contentAnalyzer';

interface TestResult {
  isFlagged: boolean;
  confidence: number;
  category: string | null;
  severity: 'low' | 'medium' | 'high';
  modelAccuracy: number;
  modelName: string;
  detectedKeywords?: string[];
  contextScore?: number;
  analysisTimestamp?: Date;
}

const ContentTester = () => {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<TestResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTestContent = () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate processing delay for UX
    setTimeout(() => {
      const analysis = analyzeContent(content);
      setResult({
        isFlagged: analysis.isFlagged,
        confidence: analysis.confidence,
        category: analysis.category ? categoryNames[analysis.category] : null,
        severity: analysis.severity,
        modelAccuracy: analysis.modelAccuracy || 0,
        modelName: analysis.modelName || "Sentinel Content Moderator",
        detectedKeywords: analysis.detectedKeywords || [],
        contextScore: analysis.contextScore || 0,
        analysisTimestamp: analysis.analysisTimestamp || new Date()
      });
      setIsAnalyzing(false);
    }, 800);
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return "text-alert-low";
      case 'medium': return "text-alert-medium";
      case 'high': return "text-alert-high";
      default: return "";
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'low': return "bg-alert-low/10 border-alert-low/30";
      case 'medium': return "bg-alert-medium/10 border-alert-medium/30";
      case 'high': return "bg-alert-high/10 border-alert-high/30";
      default: return "";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5 text-sentinel-500" />
          Content Analysis Tester
        </CardTitle>
        <CardDescription>
          Test any text to see if it would be flagged by our content moderation system
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Textarea 
            placeholder="Enter content to analyze..."
            className="min-h-[100px] bg-background/40 border-border"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <Button 
            onClick={handleTestContent} 
            className="w-full"
            disabled={isAnalyzing || !content.trim()}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
          </Button>
          
          {result && (
            <>
              <Separator className="my-4" />
              
              {result.isFlagged ? (
                <Alert className={`border-l-4 ${
                  result.severity === 'high' ? 'border-l-alert-high bg-alert-high/5' : 
                  result.severity === 'medium' ? 'border-l-alert-medium bg-alert-medium/5' : 
                  'border-l-alert-low bg-alert-low/5'
                }`}>
                  <AlertTriangle className={`h-4 w-4 ${getSeverityColor(result.severity)}`} />
                  <AlertTitle className={`${getSeverityColor(result.severity)}`}>
                    Content Flagged: {result.category}
                  </AlertTitle>
                  <AlertDescription className="text-foreground/80">
                    This content would be flagged by our system.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-l-4 border-l-green-500 bg-green-500/5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-500">Content Appears Safe</AlertTitle>
                  <AlertDescription className="text-foreground/80">
                    No harmful content detected in this text.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                {result.isFlagged && (
                  <>
                    <div>
                      <p className="text-sm font-medium mb-1">Category</p>
                      <Badge className="bg-sentinel-500/20 text-sentinel-500 hover:bg-sentinel-500/30">
                        {result.category}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Severity</p>
                      <Badge className={`${
                        result.severity === 'high' ? 'bg-alert-high/10 text-alert-high border-alert-high/30' : 
                        result.severity === 'medium' ? 'bg-alert-medium/10 text-alert-medium border-alert-medium/30' : 
                        'bg-alert-low/10 text-alert-low border-alert-low/30'
                      }`}>
                        {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                      </Badge>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-sm font-medium mb-1">AI Confidence</p>
                  <div className="flex items-center">
                    <div className="w-full bg-background rounded-full h-2.5">
                      <div 
                        className={`${result.isFlagged ? 'bg-sentinel-500' : 'bg-green-500'} h-2.5 rounded-full`}
                        style={{ width: `${Math.round(result.confidence * 100)}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{Math.round(result.confidence * 100)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1 flex items-center">
                    <Brain className="h-3 w-3 mr-1" />
                    Model Accuracy
                  </p>
                  <div className="flex items-center">
                    <div className="w-full bg-background rounded-full h-2.5">
                      <div 
                        className="bg-accent h-2.5 rounded-full" 
                        style={{ width: `${result.modelAccuracy}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{Math.round(result.modelAccuracy)}%</span>
                  </div>
                </div>
              </div>
              
              {result.isFlagged && result.detectedKeywords && result.detectedKeywords.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Detected Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {result.detectedKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className={`${getSeverityBgColor(result.severity)} font-mono text-xs`}>
                        <Code className="h-3 w-3 mr-1" /> {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {result.contextScore !== undefined && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Context Score</p>
                  <div className="flex items-center">
                    <div className="w-full bg-background rounded-full h-2.5">
                      <div 
                        className={`${
                          result.contextScore > 0.7 ? 'bg-alert-high' : 
                          result.contextScore > 0.4 ? 'bg-alert-medium' : 
                          'bg-alert-low'
                        } h-2.5 rounded-full`}
                        style={{ width: `${Math.round(result.contextScore * 100)}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{Math.round(result.contextScore * 100)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Measures the strength of contextual indicators of harmful intent
                  </p>
                </div>
              )}
              
              <div className="mt-4 text-xs text-muted-foreground flex justify-between items-center">
                <div>
                  Analysis performed by: {result.modelName}
                </div>
                {result.analysisTimestamp && (
                  <div className="flex items-center">
                    <Search className="h-3 w-3 mr-1" />
                    {formatTime(result.analysisTimestamp)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start text-xs text-muted-foreground border-t border-border/50 pt-4">
        <p>This tool uses the same content analysis engine as the automated moderation system.</p>
      </CardFooter>
    </Card>
  );
};

export default ContentTester;
