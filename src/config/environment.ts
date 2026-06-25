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

type EnvMap = Record<string, string | undefined>;

class Environment {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): EnvironmentConfig {
    const env = this.getRuntimeEnv();

    // Helper to safely parse integers with a fallback
    const safeParseInt = (value: string | undefined, fallback: number): number => {
      const parsed = parseInt(value || '', 10);
      return isNaN(parsed) ? fallback : parsed;
    };

    const getEnv = (key: string, fallback = ''): string => env[key] ?? fallback;
    const appEnvironment = this.parseAppEnvironment(getEnv('VITE_APP_ENVIRONMENT'));
    const logLevel = this.parseLogLevel(getEnv('VITE_LOG_LEVEL'));

    return {
      apiKeys: {
        gemini: getEnv('VITE_GEMINI_API_KEY'),
        groq: getEnv('VITE_GROQ_API_KEY'),
      },
      app: {
        name: getEnv('VITE_APP_NAME', 'Agent Sentinel'),
        version: getEnv('VITE_APP_VERSION', '1.0.0'),
        environment: appEnvironment,
      },
      security: {
        apiRateLimit: safeParseInt(getEnv('VITE_API_RATE_LIMIT'), 100),
        maxFileSize: safeParseInt(getEnv('VITE_MAX_FILE_SIZE'), 5242880),
        allowedFileTypes: getEnv('VITE_ALLOWED_FILE_TYPES', '.txt,.json,.log').split(','),
      },
      monitoring: {
        enableAnalytics: getEnv('VITE_ENABLE_ANALYTICS') === 'true',
        sentryDsn: getEnv('VITE_SENTRY_DSN') || undefined,
        logLevel,
      },
      features: {
        enableDemoMode: getEnv('VITE_ENABLE_DEMO_MODE', 'true') !== 'false',
        enableFileUpload: getEnv('VITE_ENABLE_FILE_UPLOAD', 'true') !== 'false',
        enableExport: getEnv('VITE_ENABLE_EXPORT', 'true') !== 'false',
      },
    };
  }

  private getRuntimeEnv(): EnvMap {
    const globalEnv = globalThis.__APP_ENV__;
    if (globalEnv && typeof globalEnv === 'object') {
      return this.normalizeEnv(globalEnv);
    }

    if (typeof process !== 'undefined' && process.env) {
      return process.env as EnvMap;
    }

    return {};
  }

  private normalizeEnv(source: Record<string, unknown>): EnvMap {
    return Object.entries(source).reduce<EnvMap>((acc, [key, value]) => {
      if (value === undefined || value === null) {
        return acc;
      }

      acc[key] = typeof value === 'string' ? value : String(value);
      return acc;
    }, {});
  }

  private parseAppEnvironment(value: string): EnvironmentConfig['app']['environment'] {
    if (value === 'production' || value === 'staging' || value === 'development') {
      return value;
    }

    return 'development';
  }

  private parseLogLevel(value: string): EnvironmentConfig['monitoring']['logLevel'] {
    if (value === 'debug' || value === 'info' || value === 'warn' || value === 'error') {
      return value;
    }

    return 'info';
  }

  private validateConfig(): void {
    const errors: string[] = [];

    if (this.isProduction() && !this.config.apiKeys.gemini && !this.config.apiKeys.groq) {
      errors.push('At least one API key (Gemini or Groq) must be configured in production');
    }

    if (this.config.security.maxFileSize <= 0) {
      errors.push('Max file size must be greater than 0');
    }

    if (this.config.security.apiRateLimit <= 0) {
      errors.push('API rate limit must be greater than 0');
    }

    const validLogLevels = ['debug', 'info', 'warn', 'error'];
    if (!validLogLevels.includes(this.config.monitoring.logLevel)) {
      errors.push(`Invalid log level specified: ${this.config.monitoring.logLevel}`);
    }

    if (errors.length > 0) {
      throw new Error(`Environment configuration errors:\n${errors.join('\n')}`);
    }
  }

  get(): EnvironmentConfig {
    // Return a deep-frozen copy to prevent accidental runtime modification
    return Object.freeze({ ...this.config });
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

declare global {
  var __APP_ENV__: Record<string, unknown> | undefined;
}