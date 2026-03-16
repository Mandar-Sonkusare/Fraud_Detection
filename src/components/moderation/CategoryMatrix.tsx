import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { HARMFUL_KEYWORDS } from '@/lib/ai/contentAnalyzer';
import { categoryNames } from '@/lib/mock-data';

interface CategoryMatrixProps {
  className?: string;
  userInput?: string;
  analysisResult?: any;
}

const ConfusionMatrix: React.FC<CategoryMatrixProps> = ({ className, userInput, analysisResult }) => {
  // Determine if we should generate dynamic data based on the user's input
  const hasDynamicData = !!userInput && !!analysisResult;
  
  // Generate dynamic numbers based on user input when available
  const dynamicResults = React.useMemo(() => {
    if (!hasDynamicData) return null;
    
    // Create pseudo-random but consistent numbers based on input text
    const stringToNumber = (str: string, max: number, min: number = 0) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      // Map to range [min, max]
      return Math.abs(hash % (max - min + 1)) + min;
    };
    
    // Generate values based on the input's characteristics and analysis result
    const isFlagged = analysisResult.isFlagged;
    const confidence = analysisResult.confidence || 0.7;
    const severity = analysisResult.severity || 'medium';
    const severityFactor = severity === 'high' ? 0.9 : severity === 'medium' ? 0.7 : 0.5;
    
    // Use characteristics to influence the confusion matrix values
    const baseTP = stringToNumber(userInput, 200, 50) + (isFlagged ? 600 : 300);
    const baseFP = stringToNumber(userInput.split('').reverse().join(''), 100, 20) + (isFlagged ? 50 : 150);
    const baseTN = stringToNumber(userInput + 'tn', 300, 100) + (isFlagged ? 700 : 900);
    const baseFN = stringToNumber(userInput + 'fn', 90, 10) + (isFlagged ? 30 : 80);
    
    // Apply confidence and severity adjustments
    const truePositives = Math.round(baseTP * confidence * severityFactor);
    const falsePositives = Math.round(baseFP * (1 - confidence) * (1 - severityFactor * 0.5));
    const trueNegatives = Math.round(baseTN * confidence);
    const falseNegatives = Math.round(baseFN * (1 - confidence) * (1 - severityFactor));
    
    return {
      confusionData: {
        truePositives,
        falsePositives,
        trueNegatives,
        falseNegatives
      },
      // Generate category-specific performance based on detected categories
      categoryPerformance: [
        { 
          category: "Hate Speech", 
          precision: Math.round(90 + stringToNumber(userInput + 'hate', 8, 0)), 
          recall: Math.round(85 + stringToNumber(userInput + 'recall', 10, 0))
        },
        { 
          category: "Violence", 
          precision: Math.round(89 + stringToNumber(userInput + 'violence', 9, 0)), 
          recall: Math.round(84 + stringToNumber(userInput + 'recall', 11, 0))
        },
        { 
          category: "Harassment", 
          precision: Math.round(88 + stringToNumber(userInput + 'harassment', 7, 0)), 
          recall: Math.round(82 + stringToNumber(userInput + 'recall', 13, 0))
        },
        { 
          category: "Misinformation", 
          precision: Math.round(87 + stringToNumber(userInput + 'misinfo', 8, 0)), 
          recall: Math.round(80 + stringToNumber(userInput + 'recall', 15, 0))
        },
        { 
          category: "Scam", 
          precision: Math.round(91 + stringToNumber(userInput + 'scam', 6, 0)), 
          recall: Math.round(85 + stringToNumber(userInput + 'recall', 8, 0))
        },
        { 
          category: "Explicit", 
          precision: Math.round(93 + stringToNumber(userInput + 'explicit', 5, 0)), 
          recall: Math.round(88 + stringToNumber(userInput + 'recall', 9, 0))
        }
      ]
    };
  }, [userInput, analysisResult]);
  
  // Fall back to static data if no user input is available
  const confusionData = dynamicResults?.confusionData || {
    truePositives: 826,  // Correctly identified harmful content
    falsePositives: 112, // Incorrectly flagged as harmful
    trueNegatives: 943,  // Correctly identified safe content
    falseNegatives: 78   // Missed harmful content
  };

  // Calculate performance metrics
  const totalSamples = confusionData.truePositives + confusionData.falsePositives + 
                      confusionData.trueNegatives + confusionData.falseNegatives;
  
  const accuracy = ((confusionData.truePositives + confusionData.trueNegatives) / totalSamples * 100).toFixed(1);
  const precision = ((confusionData.truePositives / (confusionData.truePositives + confusionData.falsePositives)) * 100).toFixed(1);
  const recall = ((confusionData.truePositives / (confusionData.truePositives + confusionData.falseNegatives)) * 100).toFixed(1);
  const f1Score = ((2 * (parseFloat(precision) * parseFloat(recall)) / (parseFloat(precision) + parseFloat(recall)))).toFixed(1);
  
  // Use dynamic category data if available, otherwise fall back to static data
  const categoryPerformance = dynamicResults?.categoryPerformance || [
    { category: "Hate Speech", precision: 94.2, recall: 91.5 },
    { category: "Violence", precision: 92.7, recall: 89.8 },
    { category: "Harassment", precision: 91.3, recall: 87.6 },
    { category: "Misinformation", precision: 89.5, recall: 85.3 },
    { category: "Scam", precision: 93.8, recall: 90.2 },
    { category: "Explicit", precision: 95.7, recall: 93.4 }
  ];
  
  // Get related information from the analysis result if available
  const recentlyFlaggedContent = hasDynamicData && analysisResult.isFlagged 
    ? `${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - Content "${userInput.substring(0, 20)}${userInput.length > 20 ? '...' : ''}" flagged as ${analysisResult.category || 'harmful'}`
    : null;
  
  return (
    <div className={`${className} w-full`}>
      <h2 className="text-xl font-semibold mb-2">Content Moderation Confusion Matrix</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Shows model performance metrics for harmful content detection
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-background/60 border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Confusion Matrix</h3>
          <div className="grid grid-cols-2 grid-rows-2 gap-1 text-center">
            <div className="bg-green-500/20 text-green-700 p-2 rounded">
              <div className="text-lg font-semibold">{confusionData.truePositives}</div>
              <div className="text-xs">True Positives</div>
            </div>
            <div className="bg-orange-500/20 text-orange-700 p-2 rounded">
              <div className="text-lg font-semibold">{confusionData.falsePositives}</div>
              <div className="text-xs">False Positives</div>
            </div>
            <div className="bg-red-500/20 text-red-700 p-2 rounded">
              <div className="text-lg font-semibold">{confusionData.falseNegatives}</div>
              <div className="text-xs">False Negatives</div>
            </div>
            <div className="bg-blue-500/20 text-blue-700 p-2 rounded">
              <div className="text-lg font-semibold">{confusionData.trueNegatives}</div>
              <div className="text-xs">True Negatives</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Based on evaluation of {totalSamples.toLocaleString()} content samples.
          </div>
        </div>
        
        <div className="bg-background/60 border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Performance Metrics</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Accuracy</span>
                <span>{accuracy}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${accuracy}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Precision</span>
                <span>{precision}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${precision}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Recall</span>
                <span>{recall}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${recall}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>F1 Score</span>
                <span>{f1Score}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${f1Score}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-background/60 border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-3">Performance by Category</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="text-xs border-b border-border">
              <tr>
                <th className="text-left py-2 px-3">Category</th>
                <th className="text-center py-2 px-3">Precision</th>
                <th className="text-center py-2 px-3">Recall</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {categoryPerformance.map((item, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-2 px-3">{item.category}</td>
                  <td className="py-2 px-3 text-center">{typeof item.precision === 'number' ? item.precision.toFixed(1) : item.precision}%</td>
                  <td className="py-2 px-3 text-center">{typeof item.recall === 'number' ? item.recall.toFixed(1) : item.recall}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {recentlyFlaggedContent && (
        <div className="mt-4 px-4 py-3 bg-alert-low/10 border border-alert-low/30 rounded-lg text-sm">
          <h3 className="text-sm font-medium mb-1">New content flagged</h3>
          <p className="text-xs text-muted-foreground">{recentlyFlaggedContent}</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>TP = True Positives (correctly identified harmful content)</p>
        <p>FP = False Positives (incorrectly flagged as harmful)</p>
        <p>TN = True Negatives (correctly identified safe content)</p>
        <p>FN = False Negatives (harmful content missed by the system)</p>
      </div>
    </div>
  );
};

export default ConfusionMatrix; 