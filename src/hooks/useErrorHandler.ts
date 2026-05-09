import { useCallback } from 'react';
import { logger } from '../utils/logger';

export interface ErrorInfo {
  message: string;
  code?: string;
  context?: Record<string, any>;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: Error | ErrorInfo, context?: Record<string, any>) => {
    if (error instanceof Error) {
      logger.error(error.message, error, context);
    } else {
      logger.error(error.message, undefined, { ...error.context, ...context });
    }
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
};