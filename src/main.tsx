import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './utils/logger';
import { environment } from './config/environment';
import { performanceMonitor } from './utils/performance';
import App from '../App';

// Initialize performance monitoring
const stopAppInit = performanceMonitor.startTimer('app-initialization');

// Log application startup
logger.info('Application starting', {
  environment: environment.get().app.environment,
  version: environment.get().app.version,
  timestamp: new Date().toISOString(),
});

// Global error handler
window.addEventListener('error', (event) => {
  logger.error('Unhandled error', event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', new Error(event.reason), {
    reason: event.reason,
  });
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

stopAppInit();
logger.info('Application initialized successfully');