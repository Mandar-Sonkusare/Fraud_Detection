import ContentTester from "@/components/moderation/ContentTester";
import AnalysisHistory from "@/components/moderation/AnalysisHistory";

export default function ModerationQueue() {
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
          Fraud Detection
        </h1>
        <p className="mt-2 text-lg" style={{ color: '#475569', fontWeight: 500 }}>
          Analyze text content for fraudulent patterns and suspicious behavior using AI-powered detection
        </p>
      </div>

      <ContentTester />
      
      <AnalysisHistory />
    </div>
  );
}
