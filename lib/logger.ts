export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  log(level: 'info' | 'warn' | 'error', message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      context,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    console.log(`[${level.toUpperCase()}] ${message}`, context || '');
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  getLogs(limit = 100, level?: string) {
    let filtered = this.logs;
    if (level) {
      filtered = this.logs.filter(log => log.level === level);
    }
    return filtered.slice(0, limit);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
