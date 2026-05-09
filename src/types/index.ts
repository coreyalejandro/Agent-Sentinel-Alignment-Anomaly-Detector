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
  metadata?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  action: string;
  userId?: string;
  timestamp: string;
  details: Record<string, any>;
  result: 'success' | 'failure';
}