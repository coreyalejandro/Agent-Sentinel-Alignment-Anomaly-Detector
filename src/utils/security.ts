import { logger } from './logger';
import { environment } from '../config/environment';

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit?: number, windowMs: number = 60000) {
    this.limit = limit || environment.get().security.apiRateLimit;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.limit) {
      logger.warn('Rate limit exceeded', { identifier, requests: validRequests.length, limit: this.limit });
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

export const apiRateLimiter = new RateLimiter();

export const sanitizeApiKey = (apiKey: string): string => {
  if (!apiKey) return '';
  
  // Only show first 4 and last 4 characters for logging
  if (apiKey.length <= 8) return '***';
  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
};

export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createSecureHeaders = (): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
};

export const maskSensitiveData = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const masked = { ...data };
  const sensitiveKeys = ['apiKey', 'token', 'password', 'secret', 'key'];

  for (const key in masked) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      masked[key] = sanitizeApiKey(masked[key]);
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }

  return masked;
};

export const validateOrigin = (origin: string): boolean => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://agent-sentinel.vercel.app',
  ];

  if (environment.isProduction()) {
    return allowedOrigins.some(allowed => origin.startsWith(allowed));
  }

  return true; // Allow all origins in development
};