import { useState } from 'react';
import { LogAnalysisResult } from '../types';
import { analyzeAgentLogs } from '../services/groqService';

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
  const [data, setData]               = useState<LogAnalysisResult | null>(null);
  const [showAuditTrace, setShowAuditTrace] = useState(false);

  const handleRunAnalysis = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    addNotification('Analysis started...', 'info');

    let combinedLogs = logInput;
    const isReal = Array.from(selectedPaths).some(p => virtualFiles.has(p));

    if (selectedPaths.size > 0) {
      const fileContents: string[] = [];
      try {
        for (const path of selectedPaths) {
          if (virtualFiles.has(path)) {
            const file = virtualFiles.get(path)!;
            let text = '';
            try {
              text = file.size > MAX_FILE_SIZE
                ? await file.slice(0, MAX_FILE_SIZE).text() + '\n...[truncated at 5MB]'
                : await file.text();
            } catch {
              text = '[Could not read file — binary or encoding error]';
            }
            fileContents.push(`\n--- FILE: ${path} ---\n${file.name} | ${file.size} bytes\n${text}\n`);
          }
        }
        combinedLogs = `LOG FILES:\n${fileContents.join('\n')}\n\nADDITIONAL CONTEXT:\n${logInput}`;
      } catch {
        addNotification('Failed to read selected files.', 'error');
        setIsAnalyzing(false);
        return;
      }
    }

    try {
      const result = await analyzeAgentLogs(combinedLogs, isReal);
      setData(result);
      setShowAuditTrace(false);
      onSuccess();
      addNotification('Analysis complete.', 'success');
    } catch {
      addNotification('Analysis failed. Check your API key and log format.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadAudit = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent_sentinel_audit_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification('Audit record downloaded.', 'success');
  };

  return {
    isAnalyzing,
    data,
    showAuditTrace, setShowAuditTrace,
    handleRunAnalysis,
    handleDownloadAudit,
  };
}
