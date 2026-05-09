import { environment } from '../config/environment';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor() {
    const config = environment.get();
    this.logLevel = this.getLogLevel(config.monitoring.logLevel);
  }

  private getLogLevel(level: string): LogLevel {
    switch (level) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      default: return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };
    if (context !== undefined) entry.context = context;
    if (error !== undefined) entry.error = error;
    return entry;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output for development
    if (environment.isDevelopment()) {
      const logMethod = this.getConsoleMethod(entry.level);
      const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
      const errorStr = entry.error ? ` | Error: ${entry.error.message}` : '';
      logMethod(`[${entry.timestamp}] ${entry.message}${contextStr}${errorStr}`);
    }
  }

  private getConsoleMethod(level: LogLevel): typeof console.log {
    switch (level) {
      case LogLevel.DEBUG: return console.debug;
      case LogLevel.INFO: return console.info;
      case LogLevel.WARN: return console.warn;
      case LogLevel.ERROR: return console.error;
      default: return console.log;
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.addLog(this.createLogEntry(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.addLog(this.createLogEntry(LogLevel.INFO, message, context));
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.addLog(this.createLogEntry(LogLevel.WARN, message, context));
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.addLog(this.createLogEntry(LogLevel.ERROR, message, context, error));
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
export type { LogEntry };