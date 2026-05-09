import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Wifi } from 'lucide-react';
import { environment } from '../config/environment';
import { logger } from '../utils/logger';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    api: boolean;
    environment: boolean;
    browser: boolean;
  };
  lastCheck: Date;
}

export const HealthCheck: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'healthy',
    checks: { api: true, environment: true, browser: true },
    lastCheck: new Date(),
  });

  const performHealthCheck = async (): Promise<HealthStatus> => {
    const checks = {
      api: false,
      environment: false,
      browser: false,
    };

    try {
      // Check environment configuration
      const config = environment.get();
      checks.environment = !!(config.apiKeys.gemini || config.apiKeys.groq);

      // Check browser capabilities
      checks.browser = !!(
        window.File &&
        window.FileReader &&
        window.FileList &&
        window.Blob
      );

      // Check API connectivity (simplified)
      if (config.apiKeys.gemini || config.apiKeys.groq) {
        checks.api = true; // In a real app, you'd ping the API
      }

      const healthyChecks = Object.values(checks).filter(Boolean).length;
      const totalChecks = Object.keys(checks).length;

      let status: HealthStatus['status'] = 'healthy';
      if (healthyChecks === 0) {
        status = 'unhealthy';
      } else if (healthyChecks < totalChecks) {
        status = 'degraded';
      }

      return {
        status,
        checks,
        lastCheck: new Date(),
      };
    } catch (error) {
      logger.error('Health check failed', error as Error);
      return {
        status: 'unhealthy',
        checks,
        lastCheck: new Date(),
      };
    }
  };

  useEffect(() => {
    const checkHealth = async () => {
      const result = await performHealthCheck();
      setHealth(result);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (health.status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'unhealthy':
        return 'text-red-500';
    }
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      {getStatusIcon()}
      <span className={getStatusColor()}>
        {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
      </span>
      <div className="flex items-center space-x-1 text-slate-400">
        <Wifi className="w-3 h-3" />
        <span>{health.lastCheck.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};