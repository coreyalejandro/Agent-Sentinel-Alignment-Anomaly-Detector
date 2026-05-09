import { environment } from '../config/environment';
import { logger } from './logger';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super(`Validation failed: ${errors.join(', ')}`);
    this.name = 'ValidationError';
  }
}

export const validateFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  const config = environment.get();

  // Check file size
  if (file.size > config.security.maxFileSize) {
    errors.push(`File size exceeds maximum allowed size of ${config.security.maxFileSize} bytes`);
  }

  // Check file type
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!config.security.allowedFileTypes.includes(fileExtension)) {
    errors.push(`File type ${fileExtension} is not allowed. Allowed types: ${config.security.allowedFileTypes.join(', ')}`);
  }

  // Check file name
  if (file.name.length > 255) {
    errors.push('File name is too long (maximum 255 characters)');
  }

  // Check for potentially dangerous file names
  const dangerousPatterns = [/\.\./g, /[<>:"|?*]/g, /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i];
  if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push('File name contains invalid characters or reserved names');
  }

  const result = {
    isValid: errors.length === 0,
    errors,
  };

  if (!result.isValid) {
    logger.warn('File validation failed', { fileName: file.name, errors });
  }

  return result;
};

export const validateLogContent = (content: string): ValidationResult => {
  const errors: string[] = [];

  // Check content length
  if (content.length === 0) {
    errors.push('Log content cannot be empty');
  }

  if (content.length > 10 * 1024 * 1024) { // 10MB limit for log content
    errors.push('Log content is too large (maximum 10MB)');
  }

  // Check for potentially malicious content
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:text\/html/i,
    /vbscript:/i,
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(content))) {
    errors.push('Log content contains potentially malicious patterns');
  }

  const result = {
    isValid: errors.length === 0,
    errors,
  };

  if (!result.isValid) {
    logger.warn('Log content validation failed', { contentLength: content.length, errors });
  }

  return result;
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:text\/html/gi, '') // Remove data URLs
    .trim();
};

export const validateApiKey = (apiKey: string, provider: 'gemini' | 'groq'): ValidationResult => {
  const errors: string[] = [];

  if (!apiKey || apiKey.trim().length === 0) {
    errors.push(`${provider} API key is required`);
  }

  // Basic format validation
  if (provider === 'gemini' && apiKey && !apiKey.startsWith('AI')) {
    errors.push('Gemini API key should start with "AI"');
  }

  if (provider === 'groq' && apiKey && apiKey.length < 20) {
    errors.push('Groq API key appears to be too short');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};