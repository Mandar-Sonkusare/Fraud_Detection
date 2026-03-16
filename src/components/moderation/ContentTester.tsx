import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, AlertTriangle, Shield } from "lucide-react";
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

  // Multiple sample messages for variety
  const sampleMessages = {
    fraudulent: [
      "URGENT: Your PayPal account has been suspended. Click here immediately to verify your identity: bit.ly/secure-verify",
      "Congratulations! You've been selected to receive a $500 Amazon gift card. Claim now: tinyurl.com/claim-prize",
      "ALERT: Suspicious activity detected on your bank account. Verify your SSN immediately to prevent closure.",
      "You won! Redeem your free $400 Play Store voucher now. Click here before it expires: sm.in/voucher",
      "URGENT: Your credit card will be blocked. Provide your CVV and card number to restore access: bit.ly/restore",
      "Congratulations! You are the lucky winner of $10,000 cash prize. Send your bank account details to claim.",
      "FINAL NOTICE: Your account has been compromised. Enter your password here to secure it: xyz.com/secure",
      "You have been chosen for a special offer! Get $1000 directly into your account. Click: short.link/money",
      "URGENT: IRS Tax Refund of $2,500 pending. Provide your social security number to process: bit.ly/irs-refund",
      "FREE iPhone 15 Pro! You've been selected as winner. Claim your prize now: tinyurl.com/free-iphone"
    ],
    suspicious: [
      "SALE! Up to 70% off everything! Limited time only. Act now before it's too late!",
      "Exclusive offer just for you! Buy now and get 50% discount. Offer expires in 24 hours!",
      "Limited stock! Only 5 items left. Order now to avoid disappointment. Free shipping today only!",
      "FLASH SALE: Designer watches at 80% off! Hurry, sale ends tonight at midnight!",
      "Special promotion: Get 3 for the price of 1. This deal won't last long. Shop now!",
      "CLEARANCE: Everything must go! Up to 90% off. Today only. Don't miss out!",
      "Exclusive VIP access: Premium membership at 60% off. Limited spots available. Join now!",
      "MEGA SALE: Electronics at unbeatable prices. Hurry, while stocks last!",
      "Last chance! Subscribe now and get 6 months free. Offer expires soon!",
      "HOT DEAL: Luxury items at wholesale prices. Act fast before they're gone!"
    ],
    normal: [
      "Your order #12345 has been confirmed. Expected delivery: Monday, March 20th. Thank you for your purchase!",
      "Hi! Your appointment is scheduled for tomorrow at 2 PM. Please arrive 10 minutes early. See you then!",
      "Reminder: Your subscription renewal is coming up next week. No action needed if you wish to continue.",
      "Thank you for your feedback! We've received your review and appreciate your input.",
      "Your package has been delivered to your doorstep. Tracking number: ABC123456789. Enjoy your purchase!",
      "Meeting reminder: Team standup at 10 AM tomorrow. Please prepare your updates.",
      "Your monthly statement is now available. You can view it in your account dashboard.",
      "Welcome to our newsletter! You'll receive weekly updates about our latest products and services.",
      "Your password was successfully changed. If you didn't make this change, please contact support.",
      "Reservation confirmed for 4 people at 7 PM on Friday. Looking forward to seeing you!"
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
      const response = await fetch('http://localhost:8000/predict', {
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

      // Save to history
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

  const getRiskLevelColor = (prediction: string) => {
    switch (prediction) {
      case 'normal':
        return 'bg-green-500/20 text-green-700 border-green-500/50';
      case 'suspicious':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50';
      case 'fraudulent':
        return 'bg-red-500/20 text-red-700 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/50';
    }
  };

  const getRiskIcon = (prediction: string) => {
    switch (prediction) {
      case 'normal':
        return <CheckCircle className="h-5 w-5" />;
      case 'suspicious':
        return <AlertTriangle className="h-5 w-5" />;
      case 'fraudulent':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getFraudTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      legitimate: 'Legitimate',
      spam: 'Spam',
      phishing: 'Phishing Attack',
      smishing: 'SMS Phishing',
      financial_scam: 'Financial Scam',
      fake_giveaway: 'Fake Giveaway',
    };
    return labels[type] || type;
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskScoreLabel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="space-y-6 slide-in-up">
      <Card className="card-hover shadow-2xl" style={{ borderColor: 'rgba(102, 126, 234, 0.3)' }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl" style={{ color: '#1e293b' }}>
            <div className="p-3 rounded-xl shadow-lg" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
            }}>
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Fraud Detection Analyzer
            </span>
          </CardTitle>
          <CardDescription className="text-base mt-2" style={{ color: '#475569', fontWeight: 500 }}>
            Test any text content for fraudulent or suspicious patterns using AI-powered detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold" style={{ color: '#1e293b', fontWeight: 700 }}>
                Test Content
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadSample('fraudulent')}
                  className="border-2 border-red-500/40 hover:bg-red-500/15 hover:border-red-500 transition-all text-red-600 hover:text-red-700 font-semibold shadow-md"
                >
                  🚨 Fraudulent
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadSample('suspicious')}
                  className="border-2 border-yellow-500/40 hover:bg-yellow-500/15 hover:border-yellow-500 transition-all text-yellow-600 hover:text-yellow-700 font-semibold shadow-md"
                >
                  ⚠️ Suspicious
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadSample('normal')}
                  className="border-2 border-green-500/40 hover:bg-green-500/15 hover:border-green-500 transition-all text-green-600 hover:text-green-700 font-semibold shadow-md"
                >
                  ✅ Normal
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Enter content to analyze... (e.g., suspicious messages, emails, social media posts)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] text-base border-2 focus:border-blue-500 transition-all"
              style={{ color: '#0f172a', fontSize: '15px', fontWeight: 500 }}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={analyzeContent}
              disabled={isAnalyzing || !content.trim()}
              className="flex-1 bg-gradient-to-r text-white font-bold shadow-xl hover:shadow-2xl transition-all rounded-xl text-base"
              size="lg"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4), 0 0 20px rgba(240, 147, 251, 0.3)',
                backgroundSize: '200% 200%'
              }}
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-pulse">🔍 Analyzing...</span>
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Analyze Content
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                setContent('');
                setResult(null);
                setError(null);
              }}
              variant="outline"
              size="lg"
              className="border-2 border-purple-400 hover:bg-purple-50 hover:border-purple-500 transition-all rounded-xl font-semibold shadow-md"
              style={{ color: '#764ba2', borderColor: '#a78bfa' }}
            >
              Clear
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="scale-in border-slate-300 shadow-2xl result-appear">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-2" style={{ color: '#0f172a' }}>
              <span className="text-2xl">📊</span>
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Level */}
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Risk Assessment</div>
              <div className={`flex items-center gap-4 p-5 rounded-xl border-2 ${getRiskLevelColor(result.prediction)} shadow-lg transition-all hover:scale-[1.02]`}>
                <div className="p-3 bg-white/50 rounded-lg">
                  {getRiskIcon(result.prediction)}
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
              <div className="p-5 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl border-2 border-accent/30">
                <div className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Risk Score</div>
                <div className={`text-5xl font-bold ${getRiskScoreColor(result.risk_score)} neon-glow`}>
                  {result.risk_score.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">out of 100</div>
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full risk-progress ${
                      result.risk_score < 30 ? 'bg-green-500' :
                      result.risk_score < 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${result.risk_score}%` }}
                  />
                </div>
                <div className="text-sm font-medium mt-2">
                  {getRiskScoreLabel(result.risk_score)}
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/30">
                <div className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Fraud Type</div>
                <Badge variant="outline" className="text-lg px-4 py-2 font-semibold border-2 border-primary/50 bg-primary/10">
                  {getFraudTypeLabel(result.fraud_type)}
                </Badge>
              </div>
            </div>

            {/* Detected Patterns */}
            {result.detected_patterns.length > 0 && (
              <div className="p-5 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-xl border-2 border-destructive/30">
                <div className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                  <span>🎯</span>
                  Detected Patterns ({result.detected_patterns.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.detected_patterns.map((pattern, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="px-3 py-1.5 text-sm font-medium bg-destructive/20 border border-destructive/40 hover:bg-destructive/30 transition-all"
                    >
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Model Info */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Model: {result.model.toUpperCase()}</span>
                {result.model_accuracy && (
                  <span>Model Accuracy: {(result.model_accuracy * 100).toFixed(1)}%</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!result && !error && !isAnalyzing && (
        <Card className="border-dashed border-2 border-slate-300 shadow-xl fade-in">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl mb-6 float">
              <Shield className="h-16 w-16 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#0f172a' }}>Ready to Analyze</h3>
            <p className="max-w-md text-lg" style={{ color: '#475569' }}>
              Enter text above and click "Analyze Content" to detect fraudulent patterns and assess risk levels using AI-powered detection.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
