interface EnvironmentConfig {
  apiKeys: {
    gemini: string;
    groq: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  security: {
    apiRateLimit: number;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
  monitoring: {
    enableAnalytics: boolean;
    sentryDsn?: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  features: {
    enableDemoMode: boolean;
    enableFileUpload: boolean;
    enableExport: boolean;
  };
}

class Environment {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): EnvironmentConfig {
    return {
      apiKeys: {
        gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
        groq: import.meta.env.VITE_GROQ_API_KEY || '',
      },
      app: {
        name: import.meta.env.VITE_APP_NAME || 'Agent Sentinel',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        environment: (import.meta.env.VITE_APP_ENVIRONMENT as any) || 'development',
      },
      security: {
        apiRateLimit: parseInt(import.meta.env.VITE_API_RATE_LIMIT || '100'),
        maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'),
        allowedFileTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || '.txt,.json,.log').split(','),
      },
      monitoring: {
        enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        sentryDsn: import.meta.env.VITE_SENTRY_DSN,
        logLevel: (import.meta.env.VITE_LOG_LEVEL as any) || 'info',
      },
      features: {
        enableDemoMode: import.meta.env.VITE_ENABLE_DEMO_MODE !== 'false',
        enableFileUpload: import.meta.env.VITE_ENABLE_FILE_UPLOAD !== 'false',
        enableExport: import.meta.env.VITE_ENABLE_EXPORT !== 'false',
      },
    };
  }

  private validateConfig(): void {
    const errors: string[] = [];

    if (this.config.app.environment === 'production') {
      if (!this.config.apiKeys.gemini && !this.config.apiKeys.groq) {
        errors.push('At least one API key (Gemini or Groq) must be configured in production');
      }
    }

    if (this.config.security.maxFileSize <= 0) {
      errors.push('Max file size must be greater than 0');
    }

    if (this.config.security.apiRateLimit <= 0) {
      errors.push('API rate limit must be greater than 0');
    }

    if (!['debug', 'info', 'warn', 'error'].includes(this.config.monitoring.logLevel)) {
      errors.push('Invalid log level specified');
    }

    if (errors.length > 0) {
      throw new Error(`Environment configuration errors:\n${errors.join('\n')}`);
    }
  }

  get(): EnvironmentConfig {
    return { ...this.config };
  }

  isProduction(): boolean {
    return this.config.app.environment === 'production';
  }

  isDevelopment(): boolean {
    return this.config.app.environment === 'development';
  }

  isStaging(): boolean {
    return this.config.app.environment === 'staging';
  }
}

export const environment = new Environment();
export type { EnvironmentConfig };