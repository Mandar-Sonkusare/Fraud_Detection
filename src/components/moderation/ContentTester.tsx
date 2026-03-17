import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, AlertTriangle, Shield, Sparkles } from "lucide-react";
import { saveAnalysis } from '@/lib/analysisHistory';

interface AnalysisResult {
  text: string;
  prediction: 'normal' | 'suspicious' | 'fraudulent';
  confidence: number;
  risk_score: number;
  detected_patterns: string[];
  fraud_type: string;
  model: string;
  model_accuracy?: number;
}

export default function ContentTester() {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleMessages = {
    fraudulent: [
      "URGENT: Your PayPal account has been suspended. Click here immediately to verify your identity: bit.ly/secure-verify",
      "Congratulations! You've been selected to receive a $500 Amazon gift card. Claim now: tinyurl.com/claim-prize",
      "ALERT: Suspicious activity detected on your bank account. Verify your SSN immediately to prevent closure.",
      "You won! Redeem your free $400 Play Store voucher now. Click here before it expires: sm.in/voucher",
      "URGENT: Your credit card will be blocked. Provide your CVV and card number to restore access: bit.ly/restore",
    ],
    suspicious: [
      "SALE! Up to 70% off everything! Limited time only. Act now before it's too late!",
      "Exclusive offer just for you! Buy now and get 50% discount. Offer expires in 24 hours!",
      "Limited stock! Only 5 items left. Order now to avoid disappointment. Free shipping today only!",
      "FLASH SALE: Designer watches at 80% off! Hurry, sale ends tonight at midnight!",
      "Special promotion: Get 3 for the price of 1. This deal won't last long. Shop now!",
    ],
    normal: [
      "Your order #12345 has been confirmed. Expected delivery: Monday, March 20th. Thank you for your purchase!",
      "Hi! Your appointment is scheduled for tomorrow at 2 PM. Please arrive 10 minutes early. See you then!",
      "Reminder: Your subscription renewal is coming up next week. No action needed if you wish to continue.",
      "Thank you for your feedback! We've received your review and appreciate your input.",
      "Your package has been delivered to your doorstep. Tracking number: ABC123456789. Enjoy your purchase!",
    ]
  };

  const getRandomSample = (type: keyof typeof sampleMessages) => {
    const messages = sampleMessages[type];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const loadSample = (type: keyof typeof sampleMessages) => {
    setContent(getRandomSample(type));
    setResult(null);
    setError(null);
  };

  const analyzeContent = async () => {
    if (!content.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8002/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);

      saveAnalysis({
        text: data.text,
        prediction: data.prediction,
        confidence: data.confidence,
        risk_score: data.risk_score,
        detected_patterns: data.detected_patterns,
        fraud_type: data.fraud_type,
        model: data.model,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze content');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 slide-in">
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-cyber rounded-xl shadow-lg shadow-neon-cyan/30 animate-float">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="gradient-text font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Fraud Detection Analyzer
            </span>
          </CardTitle>
          <CardDescription className="text-base mt-2 text-gray-400">
            Test any text content for fraudulent or suspicious patterns using AI-powered detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-neon-cyan">
                Test Content
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadSample('fraudulent')}
                  className="rounded-lg font-semibold transition-all hover:scale-105 bg-neon-red/10 border-2 border-neon-red/30 text-neon-red hover:bg-neon-red/20 hover:border-neon-red/50"
                >
                  🚨 Fraudulent
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadSample('suspicious')}
                  className="rounded-lg font-semibold transition-all hover:scale-105 bg-neon-pink/10 border-2 border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 hover:border-neon-pink/50"
                >
                  ⚠️ Suspicious
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadSample('normal')}
                  className="rounded-lg font-semibold transition-all hover:scale-105 bg-neon-blue/10 border-2 border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 hover:border-neon-blue/50"
                >
                  ✅ Normal
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Enter content to analyze... (e.g., suspicious messages, emails, social media posts)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] text-base bg-white/5 border-2 border-white/10 text-white placeholder:text-gray-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={analyzeContent}
              disabled={isAnalyzing || !content.trim()}
              className="neon-button flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Analyze Content</span>
                </>
              )}
            </button>
            <Button
              onClick={() => {
                setContent('');
                setResult(null);
                setError(null);
              }}
              variant="outline"
              size="lg"
              className="rounded-xl font-semibold transition-all hover:scale-105 bg-white/5 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
            >
              Clear
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="glass-card border-neon-red/50 bg-neon-red/10">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="glass-card scale-in">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <span className="text-2xl">📊</span>
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Level */}
            <div>
              <div className="text-sm font-semibold text-neon-cyan mb-3 uppercase tracking-wide">Risk Assessment</div>
              <div 
                className={`flex items-center gap-4 p-5 rounded-xl transition-all hover:scale-[1.02] ${
                  result.prediction === 'normal' 
                    ? 'bg-neon-blue/10 border-2 border-neon-blue/50 text-neon-blue shadow-lg shadow-neon-blue/20' 
                    : result.prediction === 'suspicious'
                    ? 'bg-neon-pink/10 border-2 border-neon-pink/50 text-neon-pink shadow-lg shadow-neon-pink/20'
                    : 'bg-neon-red/10 border-2 border-neon-red/50 text-neon-red shadow-lg shadow-neon-red/20 animate-glow-pulse'
                }`}
              >
                <div className="p-3 bg-white/10 rounded-lg">
                  {result.prediction === 'normal' ? <CheckCircle className="h-6 w-6" /> :
                   result.prediction === 'suspicious' ? <AlertTriangle className="h-6 w-6" /> :
                   <AlertCircle className="h-6 w-6" />}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xl capitalize">{result.prediction}</div>
                  <div className="text-sm opacity-90 mt-1">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Score */}
            <div className="grid grid-cols-2 gap-6">
              <div className="stat-card">
                <div className="text-sm font-semibold text-neon-cyan mb-3 uppercase tracking-wide">Risk Score</div>
                <div 
                  className={`text-5xl font-bold animate-pulse-slow ${
                    result.risk_score < 30 ? 'text-neon-blue' : result.risk_score < 70 ? 'text-neon-pink' : 'text-neon-red'
                  }`}
                >
                  {result.risk_score.toFixed(1)}
                </div>
                <div className="text-xs text-gray-400 mt-1">out of 100</div>
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000"
                    style={{ 
                      width: `${result.risk_score}%`,
                      background: result.risk_score < 30 
                        ? 'linear-gradient(90deg, #00d2ff, #3a7bd5)' 
                        : result.risk_score < 70 
                        ? 'linear-gradient(90deg, #f093fb, #f5576c)' 
                        : 'linear-gradient(90deg, #ff6b6b, #ee5a6f)'
                    }}
                  />
                </div>
              </div>

              <div className="stat-card">
                <div className="text-sm font-semibold text-neon-cyan mb-3 uppercase tracking-wide">Fraud Type</div>
                <Badge className="text-lg px-4 py-2 font-semibold bg-gradient-cyber text-white border-none">
                  {result.fraud_type}
                </Badge>
              </div>
            </div>

            {/* Detected Patterns */}
            {result.detected_patterns.length > 0 && (
              <div className="stat-card">
                <div className="text-sm font-semibold text-neon-cyan mb-3 uppercase tracking-wide flex items-center gap-2">
                  <span>🎯</span>
                  Detected Patterns ({result.detected_patterns.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.detected_patterns.map((pattern, index) => (
                    <Badge 
                      key={index} 
                      className="px-3 py-1.5 text-sm font-medium bg-neon-red/20 border border-neon-red/50 text-neon-red"
                    >
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Model Info */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Model: {result.model.toUpperCase()}</span>
                {result.model_accuracy && (
                  <span>Accuracy: {(result.model_accuracy * 100).toFixed(1)}%</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!result && !error && !isAnalyzing && (
        <Card className="glass-card fade-in border-2 border-dashed border-neon-cyan/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-gradient-cyber rounded-2xl mb-6 shadow-lg shadow-neon-cyan/30 animate-float">
              <Shield className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Ready to Analyze</h3>
            <p className="max-w-md text-lg text-gray-400">
              Enter text above and click "Analyze Content" to detect fraudulent patterns and assess risk levels.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
