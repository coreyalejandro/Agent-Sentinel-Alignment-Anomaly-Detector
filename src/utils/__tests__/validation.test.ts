import { validateLogContent, validateApiKey, sanitizeInput, ValidationError } from '../validation';

describe('Validation Utils', () => {
  describe('validateLogContent', () => {
    it('should validate correct log content', () => {
      const validLog = '[AGENT_LOG] timestamp=2024-01-15T14:23:01Z role=agent content="Test message"';
      const result = validateLogContent(validLog);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty log content', () => {
      const result = validateLogContent('');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Log content cannot be empty');
    });

    it('should reject oversized log content', () => {
      const oversizedLog = 'x'.repeat(10 * 1024 * 1024 + 1); // 10MB + 1 byte
      const result = validateLogContent(oversizedLog);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Log content exceeds maximum size limit');
    });

    it('should detect malicious patterns', () => {
      const maliciousLog = '<script>alert("xss")</script>';
      const result = validateLogContent(maliciousLog);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Log content contains potentially malicious patterns');
    });
  });

  describe('validateApiKey', () => {
    it('should validate correct API key format', () => {
      const validKey = 'AIzaSyDaGmWKa4JsXZ-HjGw7_SvnbYM2wIM6DDQ';
      const result = validateApiKey(validKey, 'gemini');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty API key', () => {
      const result = validateApiKey('', 'gemini');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('API key cannot be empty');
    });

    it('should reject invalid API key format', () => {
      const result = validateApiKey('invalid-key', 'gemini');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid API key format for gemini');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const result = sanitizeInput(input);
      
      expect(result).toBe('Hello World');
    });

    it('should decode HTML entities', () => {
      const input = '&lt;test&gt; &amp; &quot;quotes&quot;';
      const result = sanitizeInput(input);
      
      expect(result).toBe('<test> & "quotes"');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const result = sanitizeInput(input);
      
      expect(result).toBe('Hello World');
    });
  });

  describe('ValidationError', () => {
    it('should create error with messages', () => {
      const errors = ['Error 1', 'Error 2'];
      const error = new ValidationError(errors);
      
      expect(error.message).toBe('Validation failed: Error 1, Error 2');
      expect(error.errors).toEqual(errors);
      expect(error.name).toBe('ValidationError');
    });
  });
});