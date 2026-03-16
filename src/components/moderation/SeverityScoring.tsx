import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateSeverityScores, generateConfusionMatrix } from '@/lib/ai/contentScoring';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SeverityScoreProps {
  content: string;
}

const SeverityScoring: React.FC<SeverityScoreProps> = ({ content }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Only calculate if there's content
  if (!content.trim()) {
    return null;
  }
  
  // Calculate severity scores
  const { categoryScores, subclusterScores, matchedKeywords, averageScore } = calculateSeverityScores(content);
  
  // Generate confusion matrix data
  const { matrix, labels } = generateConfusionMatrix(matchedKeywords);
  
  // Prepare data for bar chart
  const chartData = Object.entries(categoryScores).map(([category, score]) => ({
    name: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score: Math.abs(score) * 100, // Convert to positive percentage for visualization
  })).filter(item => item.score > 0);
  
  // Sort to show highest severity first
  chartData.sort((a, b) => b.score - a.score);
  
  // Draw confusion matrix
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = labels.length;
    const cellSize = Math.min(30, canvas.width / (size + 1));
    const padding = 10;
    const textPadding = 5;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set font and text alignment
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw labels
    ctx.fillStyle = '#666';
    for (let i = 0; i < size; i++) {
      // Y-axis labels (left)
      ctx.fillText(
        labels[i], 
        padding + textPadding,
        padding + cellSize * (i + 0.5) + textPadding
      );
      
      // X-axis labels (top)
      ctx.fillText(
        labels[i],
        padding + cellSize * (i + 0.5) + textPadding,
        padding - textPadding
      );
    }
    
    // Draw cells
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = matrix[i][j];
        
        // Skip empty cells
        if (value === 0) continue;
        
        // Color intensity based on value (darker = higher correlation)
        const intensity = Math.min(0.9, value * 0.3 + 0.1);
        ctx.fillStyle = `rgba(79, 70, 229, ${intensity})`;
        
        // Draw cell
        ctx.fillRect(
          padding + textPadding + j * cellSize,
          padding + textPadding + i * cellSize,
          cellSize,
          cellSize
        );
        
        // Cell text (correlation value)
        ctx.fillStyle = intensity > 0.5 ? 'white' : 'black';
        ctx.fillText(
          value.toString(),
          padding + textPadding + j * cellSize + cellSize / 2,
          padding + textPadding + i * cellSize + cellSize / 2
        );
      }
    }
  }, [matrix, labels]);
  
  // Format score as percentage and show proper sign
  const formatScore = (score: number): string => {
    return `${score.toFixed(2)}`;
  };
  
  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Severity Scoring</CardTitle>
        <CardDescription>
          Analysis based on subclusters with different severity levels
        </CardDescription>
        <div className="flex items-center justify-between">
          <Badge className={`${Math.abs(averageScore) > 0.75 ? 'bg-red-500/20 text-red-500' : 
                           Math.abs(averageScore) > 0.5 ? 'bg-orange-500/20 text-orange-500' : 
                           Math.abs(averageScore) > 0.25 ? 'bg-yellow-500/20 text-yellow-500' : 
                           'bg-green-500/20 text-green-500'}`}>
            Average Score: {formatScore(averageScore)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {chartData.length > 0 ? (
          <div className="space-y-6">
            {/* Bar chart for category scores */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)}%`, 'Severity']}
                    labelFormatter={(label) => `${label} Category`}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#4f46e5" 
                    background={{ fill: '#f3f4f6' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Subcluster details */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Subclusters</h4>
              {Object.entries(subclusterScores).map(([category, clusters]) => {
                // Only show categories with matches
                const hasMatches = Object.values(matchedKeywords[category]).some(arr => arr.length > 0);
                if (!hasMatches) return null;
                
                return (
                  <div key={category} className="space-y-2">
                    <h5 className="text-xs font-medium">{category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h5>
                    {Object.entries(clusters).map(([cluster, score]) => {
                      const keywords = matchedKeywords[category][cluster];
                      if (keywords.length === 0) return null;
                      
                      return (
                        <div key={cluster} className="pl-3 border-l-2 border-border">
                          <div className="flex justify-between items-center">
                            <span className="text-xs">{cluster.charAt(0).toUpperCase() + cluster.slice(1)}</span>
                            <Badge className={`${Math.abs(score) > 0.75 ? 'bg-red-500/10 text-red-500' : 
                                             Math.abs(score) > 0.5 ? 'bg-orange-500/10 text-orange-500' : 
                                             Math.abs(score) > 0.25 ? 'bg-yellow-500/10 text-yellow-500' : 
                                             'bg-blue-500/10 text-blue-500'}`}>
                              {formatScore(score)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {keywords.map((keyword, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-background/50">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            
            {/* Confusion Matrix */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Category Co-occurrence Matrix</h4>
              <p className="text-xs text-muted-foreground">
                Shows how different categories of harmful content appear together
              </p>
              <div className="bg-background/50 p-2 rounded-md overflow-x-auto">
                <canvas 
                  ref={canvasRef} 
                  width={300} 
                  height={300}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            No harmful content detected for severity scoring
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeverityScoring; 