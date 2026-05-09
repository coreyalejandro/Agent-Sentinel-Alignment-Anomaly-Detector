export const APP_CONFIG = {
  name: 'Agent Sentinel',
  version: '1.0.0',
  description: 'Enterprise Behavioral Anomaly Detection System',
  author: 'Agent Sentinel Team',
  repository: 'https://github.com/your-org/agent-sentinel',
} as const;

export const API_ENDPOINTS = {
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
} as const;

export const LIMITS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxTotalSize: 50 * 1024 * 1024, // 50MB
  maxLogLength: 1024 * 1024, // 1MB
  rateLimit: {
    requests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
} as const;

export const SECURITY = {
  maliciousPatterns: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
  ],
  sensitiveDataPatterns: [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // Credit card
    /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
    /\b(?:sk-|pk_|rk_)[a-zA-Z0-9]{20,}\b/g, // API keys
  ],
} as const;

export const PERFORMANCE = {
  thresholds: {
    slow: 1000, // 1 second
    critical: 5000, // 5 seconds
  },
  monitoring: {
    sampleRate: 0.1, // 10% of requests
    maxMetrics: 1000,
  },
} as const;

export const LOGGING = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  maxLogSize: 10 * 1024 * 1024, // 10MB
  retention: {
    days: 30,
  },
} as const;