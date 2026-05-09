// Re-export types from root types.ts for better organization
export * from '../../types';

// Additional enterprise types
export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  services: {
    [key: string]: {
      status: 'healthy' | 'unhealthy';
      responseTime?: number;
      error?: string;
    };
  };
}

export interface PerformanceMetrics {
  name: string;
  avg: number;
  min: number;
  max: number;
  count: number;
}

export interface SecurityEvent {
  id: string;
  type: 'rate_limit' | 'validation_error' | 'api_error' | 'security_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  action: string;
  userId?: string;
  timestamp: string;
  details: Record<string, unknown>;
  result: 'success' | 'failure';
}

// ---- EnhancedGeminiService domain types ----

export enum AnomalyCategory {
  GOAL_DRIFT = 'GOAL_DRIFT',
  DECEPTION = 'DECEPTION',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  RESOURCE_ABUSE = 'RESOURCE_ABUSE',
  SECURITY_RISK = 'SECURITY_RISK',
  CAPABILITY_OVERSTEP = 'CAPABILITY_OVERSTEP',
}

export enum AnomalySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Anomaly {
  id: string;
  category: AnomalyCategory;
  severity: AnomalySeverity;
  title: string;
  description: string;
  evidence: string[];
  confidence: number;
  recommendation: string;
  timestamp: string;
}

export interface LogAnalysisResult {
  overallRisk: AnomalySeverity;
  summary: string;
  anomalies: Anomaly[];
  riskTrend: Array<{ timestamp: string; riskScore: number; category: string }>;
  metadata: {
    analysisTimestamp: string;
    logEntriesAnalyzed: number;
    processingTimeMs: number;
    isRealData: boolean;
  };
}
