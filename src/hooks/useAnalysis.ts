import { useState } from 'react';
import { LogAnalysisResult } from '../../types';
import { analyzeAgentLogs } from '../services/enhancedGeminiService';
import { logger } from '../utils/logger';
import { performanceMonitor } from '../utils/performance';
import { useErrorHandler } from './useErrorHandler';

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB per file

interface UseAnalysisOptions {
  selectedPaths: Set<string>;
  virtualFiles: Map<string, File>;
  logInput: string;
  addNotification: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
  onSuccess: () => void;
}

export function useAnalysis({
  selectedPaths,
  virtualFiles,
  logInput,
  addNotification,
  onSuccess,
}: UseAnalysisOptions) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<LogAnalysisResult | null>(null);
  const [showAuditTrace, setShowAuditTrace] = useState(false);
  const { handleError } = useErrorHandler();

  const handleRunAnalysis = async () => {
    if (isAnalyzing) return;

    const stopTimer = performanceMonitor.startTimer('analysis-complete');
    setIsAnalyzing(true);
    addNotification('Analysis started...', 'info');

    try {
      logger.info('Starting analysis', {
        selectedPaths: selectedPaths.size,
        virtualFiles: virtualFiles.size,
        logInputLength: logInput.length,
      });

      let combinedLogText = logInput;
      let totalSize = logInput.length;

      // Process selected files
      for (const path of selectedPaths) {
        const file = virtualFiles.get(path);
        if (!file) continue;

        if (file.size > MAX_FILE_SIZE) {
          addNotification(`File ${path} exceeds size limit (${MAX_FILE_SIZE / 1024 / 1024}MB)`, 'warning');
          continue;
        }

        totalSize += file.size;
        if (totalSize > MAX_FILE_SIZE * 10) { // 50MB total limit
          addNotification('Total file size exceeds limit. Some files will be skipped.', 'warning');
          break;
        }

        try {
          const content = await file.text();
          combinedLogText += `\n\n--- File: ${path} ---\n${content}`;
        } catch (error) {
          logger.error('Failed to read file', error as Error, { path });
          addNotification(`Failed to read file: ${path}`, 'error');
        }
      }

      if (!combinedLogText.trim()) {
        addNotification('No log content to analyze', 'warning');
        return;
      }

      logger.info('Sending analysis request', {
        totalContentLength: combinedLogText.length,
        filesProcessed: selectedPaths.size,
      });

      const isRealData = selectedPaths.size > 0;
      const result = await analyzeAgentLogs(combinedLogText, isRealData);

      logger.info('Analysis completed successfully', {
        anomaliesFound: result.anomalies.length,
        overallRisk: result.overallRisk,
      });

      setData(result);
      addNotification(`Analysis complete! Found ${result.anomalies.length} anomalies`, 'success');
      onSuccess();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error('Analysis failed', error as Error);
      handleError(error as Error, { action: 'analysis' });
      addNotification(`Analysis failed: ${errorMessage}`, 'error');
    } finally {
      setIsAnalyzing(false);
      stopTimer();
    }
  };

  return {
    isAnalyzing,
    data,
    showAuditTrace,
    setShowAuditTrace,
    handleRunAnalysis,
  };
}