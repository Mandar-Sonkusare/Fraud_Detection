/**
 * Analysis History Manager
 * Handles localStorage for fraud detection analysis history
 */

export interface AnalysisRecord {
  id: string;
  timestamp: string;
  text: string;
  prediction: 'normal' | 'suspicious' | 'fraudulent';
  confidence: number;
  risk_score: number;
  detected_patterns: string[];
  fraud_type: string;
  model: string;
}

export interface AnalysisStats {
  total: number;
  normal: number;
  suspicious: number;
  fraudulent: number;
  averageRiskScore: number;
  commonPatterns: { pattern: string; count: number }[];
  fraudTypes: { type: string; count: number }[];
}

const STORAGE_KEY = 'fraud_detection_history';
const MAX_RECORDS = 1000; // Limit storage

/**
 * Save an analysis record to localStorage
 */
export function saveAnalysis(record: Omit<AnalysisRecord, 'id' | 'timestamp'>): AnalysisRecord {
  const fullRecord: AnalysisRecord = {
    ...record,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };

  const history = getHistory();
  history.unshift(fullRecord); // Add to beginning

  // Limit storage size
  if (history.length > MAX_RECORDS) {
    history.splice(MAX_RECORDS);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return fullRecord;
}

/**
 * Get all analysis history
 */
export function getHistory(): AnalysisRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
}

/**
 * Get analysis statistics
 */
export function getStats(): AnalysisStats {
  const history = getHistory();

  if (history.length === 0) {
    return {
      total: 0,
      normal: 0,
      suspicious: 0,
      fraudulent: 0,
      averageRiskScore: 0,
      commonPatterns: [],
      fraudTypes: [],
    };
  }

  const normal = history.filter((r) => r.prediction === 'normal').length;
  const suspicious = history.filter((r) => r.prediction === 'suspicious').length;
  const fraudulent = history.filter((r) => r.prediction === 'fraudulent').length;

  const totalRiskScore = history.reduce((sum, r) => sum + r.risk_score, 0);
  const averageRiskScore = totalRiskScore / history.length;

  // Count patterns
  const patternCounts: Record<string, number> = {};
  history.forEach((record) => {
    record.detected_patterns.forEach((pattern) => {
      patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
    });
  });

  const commonPatterns = Object.entries(patternCounts)
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Count fraud types
  const fraudTypeCounts: Record<string, number> = {};
  history.forEach((record) => {
    if (record.fraud_type && record.fraud_type !== 'legitimate') {
      fraudTypeCounts[record.fraud_type] = (fraudTypeCounts[record.fraud_type] || 0) + 1;
    }
  });

  const fraudTypes = Object.entries(fraudTypeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total: history.length,
    normal,
    suspicious,
    fraudulent,
    averageRiskScore: Math.round(averageRiskScore * 10) / 10,
    commonPatterns,
    fraudTypes,
  };
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Delete a specific record
 */
export function deleteRecord(id: string): void {
  const history = getHistory();
  const filtered = history.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Export history to CSV
 */
export function exportToCSV(): string {
  const history = getHistory();

  if (history.length === 0) {
    return '';
  }

  // CSV headers
  const headers = [
    'Timestamp',
    'Text',
    'Prediction',
    'Confidence',
    'Risk Score',
    'Fraud Type',
    'Detected Patterns',
    'Model',
  ];

  // CSV rows
  const rows = history.map((record) => [
    record.timestamp,
    `"${record.text.replace(/"/g, '""')}"`, // Escape quotes
    record.prediction,
    record.confidence.toFixed(4),
    record.risk_score.toFixed(2),
    record.fraud_type,
    `"${record.detected_patterns.join(', ')}"`,
    record.model,
  ]);

  // Combine headers and rows
  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

  return csv;
}

/**
 * Download CSV file
 */
export function downloadCSV(): void {
  const csv = exportToCSV();

  if (!csv) {
    alert('No data to export');
    return;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `fraud_detection_history_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
