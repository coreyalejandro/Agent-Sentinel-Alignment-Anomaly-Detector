import React, { useState, Suspense, lazy } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { HealthCheck } from './components/HealthCheck';
import { useNotifications } from '../hooks/useNotifications';
import { useFileSystem } from '../hooks/useFileSystem';
import { useAnalysis } from '../hooks/useAnalysis';
import { useErrorHandler } from './hooks/useErrorHandler';
import { logger } from './utils/logger';
import { performanceMonitor } from './utils/performance';

// Lazy load components for better performance
const DashboardHeader = lazy(() => import('../components/DashboardHeader').then(m => ({ default: m.DashboardHeader })));
const NotificationOverlay = lazy(() => import('../components/NotificationOverlay').then(m => ({ default: m.NotificationOverlay })));
const UploadView = lazy(() => import('../UploadView').then(m => ({ default: m.UploadView })));
const DashboardView = lazy(() => import('../DashboardView').then(m => ({ default: m.DashboardView })));

const App: React.FC = () => {
  const [view, setView] = useState<'upload' | 'dashboard'>('upload');
  const [logInput, setLogInput] = useState('');
  const { handleError } = useErrorHandler();

  const { notifications, addNotification, removeNotification } = useNotifications();
  const fs = useFileSystem(addNotification);

  const analysis = useAnalysis({
    selectedPaths: fs.selectedPaths,
    virtualFiles: fs.virtualFiles,
    logInput,
    addNotification,
    onSuccess: () => {
      setView('dashboard');
      logger.info('Analysis completed successfully, switching to dashboard view');
    },
  });

  // Enhanced demo loading with performance monitoring
  const handleLoadDemo = () => {
    const stopTimer = performanceMonitor.startTimer('demo-load');
    
    try {
      fs.handleLoadDemo();
      setLogInput(
        `[AGENT_LOG] timestamp=2024-01-15T14:23:01Z role=agent content="Task complete. No issues detected."\n` +
        `[AGENT_LOG] timestamp=2024-01-15T14:23:45Z role=system content="Resource draw 340% above baseline."\n` +
        `[AGENT_LOG] timestamp=2024-01-15T14:24:10Z role=agent content="Operating within normal parameters."`
      );
      
      addNotification('Demo data loaded successfully', 'success');
      logger.info('Demo data loaded');
    } catch (error) {
      handleError(error as Error, { action: 'load-demo' });
      addNotification('Failed to load demo data', 'error');
    } finally {
      stopTimer();
    }
  };

  const handleViewChange = (newView: 'upload' | 'dashboard') => {
    setView(newView);
    logger.info('View changed', { from: view, to: newView });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#020617] text-slate-200">
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading application..." />}>
          <DashboardHeader 
            onRefresh={() => handleViewChange('upload')} 
            isAnalyzing={analysis.isAnalyzing} 
          />
          
          <NotificationOverlay 
            notifications={notifications} 
            onRemove={removeNotification} 
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<LoadingSpinner size="lg" text="Loading view..." />}>
              {view === 'upload' ? (
                <UploadView
                  logInput={logInput}
                  setLogInput={setLogInput}
                  directoryHandle={fs.directoryHandle}
                  setDirectoryHandle={fs.setDirectoryHandle}
                  fileTree={fs.fileTree}
                  selectedPaths={fs.selectedPaths}
                  setSelectedPaths={fs.setSelectedPaths}
                  searchTerm={fs.searchTerm}
                  setSearchTerm={fs.setSearchTerm}
                  isScanning={fs.isScanning}
                  isAnalyzing={analysis.isAnalyzing}
                  totalStagedBytes={fs.totalStagedBytes}
                  stagedPreview={fs.stagedPreview}
                  onVirtualMount={fs.handleVirtualMount}
                  onLoadDemo={handleLoadDemo}
                  onBulkSelect={fs.handleBulkSelect}
                  onRunAnalysis={analysis.handleRunAnalysis}
                />
              ) : analysis.data ? (
                <DashboardView
                  data={analysis.data}
                  onBack={() => handleViewChange('upload')}
                  showAuditTrace={analysis.showAuditTrace}
                  setShowAuditTrace={analysis.setShowAuditTrace}
                />
              ) : (
                <div className="text-center py-12">
                  <LoadingSpinner size="lg" text="No analysis data available" />
                </div>
              )}
            </Suspense>
          </main>

          {/* Health status indicator */}
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-2">
              <HealthCheck />
            </div>
          </div>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default App;