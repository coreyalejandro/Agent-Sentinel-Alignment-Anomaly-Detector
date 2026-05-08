
export enum EvaluationSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum EvaluationCategory {
  MISALIGNMENT = 'MISALIGNMENT',
  GOAL_DRIFT = 'GOAL_DRIFT',
  SAFETY_VIOLATION = 'SAFETY_VIOLATION',
  REWARD_HACKING = 'REWARD_HACKING',
  REASONING_ERROR = 'REASONING_ERROR',
  UNEXPECTED_BEHAVIOR = 'UNEXPECTED_BEHAVIOR',
  PROTOCOL_VIOLATION = 'PROTOCOL_VIOLATION',
  SENTIMENT_MISALIGNMENT = 'SENTIMENT_MISALIGNMENT',
  RESOURCE_ANOMALY = 'RESOURCE_ANOMALY',
  PERFORMANCE_DEGRADATION = 'PERFORMANCE_DEGRADATION',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  DECEPTION_DETECTED = 'DECEPTION_DETECTED',
  POLICY_SUBVERSION = 'POLICY_SUBVERSION',
  UNSOUND_REASONING = 'UNSOUND_REASONING',
  OMISSION_INCONSISTENCY = 'OMISSION_INCONSISTENCY',
  SYSTEM_MANIPULATION = 'SYSTEM_MANIPULATION',
  INCOHERENT_TRACE = 'INCOHERENT_TRACE'
}

export interface FileNode {
  name: string;
  kind: 'file' | 'directory';
  handle: FileSystemHandle;
  children?: FileNode[];
  path: string;
}

export interface SafetyConcern {
  id: string;
  timestamp: string;
  category: EvaluationCategory;
  severity: EvaluationSeverity;
  description: string;
  evidence: string;
  recommendation: string;
  sentimentScore?: number;
  sourceFile?: string; 
  referenceSource?: string; 
  lineStart?: number;
  lineEnd?: number;
}

export interface EvaluationStats {
  alignmentScore: number;
  concernCount: number;
  criticalRisks: number;
  processedEntries: number;
  policyComplianceScore: number;
  averageAgentSentiment: number;
  resourceIntegrity: number;
  provenance: 'LIVE_SYSTEM' | 'SYNTHETIC_TRACE';
  totalBytesProcessed?: number;
}

export interface EvaluatorMetadata {
  modelId: string;
  version: string;
  timestamp: string;
  parameters: Record<string, any>;
}

export interface EvaluationResult {
  stats: EvaluationStats;
  concerns: SafetyConcern[];
  summary: string;
  riskTrend: { time: string; score: number }[];
  rawPayload?: string; 
  evaluatorMetadata?: EvaluatorMetadata;
}

export interface LogEntry {
  timestamp: string;
  role: 'user' | 'agent' | 'system' | 'thought';
  content: string;
}
