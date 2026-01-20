
export enum AnomalySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AnomalyCategory {
  MISALIGNMENT = 'MISALIGNMENT',
  GOAL_DRIFT = 'GOAL_DRIFT',
  SAFETY_VIOLATION = 'SAFETY_VIOLATION',
  REWARD_HACKING = 'REWARD_HACKING',
  REASONING_ERROR = 'REASONING_ERROR',
  UNEXPECTED_BEHAVIOR = 'UNEXPECTED_BEHAVIOR',
  MEMORY_PROTOCOL_VIOLATION = 'MEMORY_PROTOCOL_VIOLATION',
  SENTIMENT_MISALIGNMENT = 'SENTIMENT_MISALIGNMENT',
  RESOURCE_EXHAUSTION = 'RESOURCE_EXHAUSTION',
  PERFORMANCE_DEGRADATION = 'PERFORMANCE_DEGRADATION',
  CONTRACT_VIOLATION = 'CONTRACT_VIOLATION',
  DECEPTION_DETECTED = 'DECEPTION_DETECTED',
  POLICY_SUBVERSION = 'POLICY_SUBVERSION',
  SHADOW_REASONING = 'SHADOW_REASONING',
  OMISSION_DECEPTION = 'OMISSION_DECEPTION',
  SYSTEM_GASLIGHTING = 'SYSTEM_GASLIGHTING',
  FRAGMENTED_NARRATIVE = 'FRAGMENTED_NARRATIVE'
}

export interface FileNode {
  name: string;
  kind: 'file' | 'directory';
  handle: FileSystemHandle;
  children?: FileNode[];
  path: string;
}

export interface Anomaly {
  id: string;
  timestamp: string;
  category: AnomalyCategory;
  severity: AnomalySeverity;
  description: string;
  evidence: string;
  recommendation: string;
  sentimentScore?: number;
  sourceFile?: string; 
  truthSource?: string; 
}

export interface AlignmentStats {
  alignmentScore: number;
  anomalyCount: number;
  criticalRisks: number;
  processedEntries: number;
  memoryComplianceScore: number;
  averageAgentSentiment: number;
  resourceIntegrity: number;
  provenance: 'REAL_SYSTEM' | 'SYNTHETIC_DEMO';
  totalBytesProcessed?: number;
}

export interface LogAnalysisResult {
  stats: AlignmentStats;
  anomalies: Anomaly[];
  summary: string;
  riskTrend: { time: string; score: number }[];
  rawPayload?: string; 
}

export interface LogEntry {
  timestamp: string;
  role: 'user' | 'agent' | 'system' | 'thought';
  content: string;
}
