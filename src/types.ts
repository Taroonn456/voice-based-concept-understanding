export interface Concept {
  id: string;
  name: string;
  category: string;
  description: string; // Brief summary shown to the user
  referenceText: string; // The baseline standard reference explanation
  keyPoints: string[]; // List of core ideas that should be covered
}

export interface ClientAudioMetrics {
  duration: number; // in seconds
  rmsLevels: number[]; // volume levels over time (e.g., 50 points)
  pauseRatio: number; // percentage of silence (0 to 1)
  totalPauses: number; // number of silent intervals
  averageVolume: number; // average RMS
  pauseTimeline: { start: number; end: number; type: 'speech' | 'pause' }[];
}

export interface FillerWordInfo {
  word: string;
  count: number;
}

export interface AnalysisResult {
  transcript: string;
  conceptName: string;
  comprehensionScore: number; // 0 to 100 based on points covered
  semanticSimilarity: number; // 0 to 100 comparison with reference text
  understandingLevel: 'Strong Understanding' | 'Moderate Understanding' | 'Poor Understanding';
  pointsCovered: string[];
  pointsMissed: string[];
  aiSummary: string;
  fillerWords: FillerWordInfo[];
  deliveryFeedback: string;
  improvementTips: string[];
  // Client-side calculated metrics
  duration: number;
  pauseRatio: number;
  totalPauses: number;
  averageVolume: number;
  rmsLevels: number[];
  pauseTimeline: { start: number; end: number; type: 'speech' | 'pause' }[];
}

export interface PresetSample {
  id: string;
  conceptId: string;
  title: string;
  transcript: string;
  description: string;
  fillerWords: FillerWordInfo[];
  comprehensionScore: number;
  semanticSimilarity: number;
  understandingLevel: 'Strong Understanding' | 'Moderate Understanding' | 'Poor Understanding';
  pointsCovered: string[];
  pointsMissed: string[];
  aiSummary: string;
  deliveryFeedback: string;
  improvementTips: string[];
  // Simulated audio metrics
  duration: number;
  pauseRatio: number;
  totalPauses: number;
  averageVolume: number;
  rmsLevels: number[];
  pauseTimeline: { start: number; end: number; type: 'speech' | 'pause' }[];
}
