import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Save content analysis results to a CSV file
 */
export const saveAnalysisToCSV = (data: {
  text: string;
  categories: string[];
  isFlagged: boolean;
  severity: string;
  confidence: number;
}) => {
  try {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // In browser, we'll use localStorage to temporarily store results
      // Get existing results
      const existingData = localStorage.getItem('content_analysis_results');
      const results = existingData ? JSON.parse(existingData) : [];
      
      // Add new result
      results.push({
        timestamp: new Date().toISOString(),
        ...data
      });
      
      // Save back to localStorage
      localStorage.setItem('content_analysis_results', JSON.stringify(results));
      
      // Optional: If you want to download the CSV automatically
      if (results.length % 10 === 0) { // Every 10 analyses, trigger download
        downloadCSV(results);
      }
      
      console.log('Analysis saved to temporary storage');
    }
  } catch (error) {
    console.error('Error saving analysis results:', error);
  }
};

/**
 * Download analysis results as CSV
 */
export const downloadCSV = (data: any[]) => {
  try {
    if (typeof window !== 'undefined') {
      // Create CSV content
      const headers = 'Text,Categories,Is_Flagged,Severity,Confidence,Timestamp\n';
      const csvContent = data.map(row => {
        return `"${row.text.replace(/"/g, '""')}","${row.categories.join(';')}",${row.isFlagged},${row.severity},${row.confidence},"${row.timestamp}"`;
      }).join('\n');
      
      // Create download link
      const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'content_analysis_results.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error downloading CSV:', error);
  }
};
