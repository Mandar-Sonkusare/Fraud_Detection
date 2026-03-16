import ContentTester from "@/components/moderation/ContentTester";
import AnalysisHistory from "@/components/moderation/AnalysisHistory";

export default function ModerationQueue() {
  return (
    <div className="space-y-8 slide-in">
      <div>
        <h1 
          className="text-5xl font-bold tracking-tight gradient-text mb-3"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Fraud Detection
        </h1>
        <p className="text-lg text-gray-400">
          Analyze text content for fraudulent patterns and suspicious behavior using AI-powered detection
        </p>
      </div>

      <ContentTester />
      
      <AnalysisHistory />
    </div>
  );
}
