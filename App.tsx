import React, { useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { NotificationOverlay } from './components/NotificationOverlay';
import { UploadView } from './UploadView';
import { DashboardView } from './DashboardView';
import { useNotifications } from './hooks/useNotifications';
import { useFileSystem } from './hooks/useFileSystem';
import { useAnalysis } from './hooks/useAnalysis';

const App: React.FC = () => {
  const [view, setView]       = useState<'upload' | 'dashboard'>('upload');
  const [logInput, setLogInput] = useState('');

  const { notifications, addNotification, removeNotification } = useNotifications();

  const fs = useFileSystem(addNotification);

  const analysis = useAnalysis({
    selectedPaths: fs.selectedPaths,
    virtualFiles:  fs.virtualFiles,
    logInput,
    addNotification,
    onSuccess: () => setView('dashboard'),
  });

  // Wire demo log input into logInput state when demo loads
  const handleLoadDemo = () => {
    fs.handleLoadDemo();
    setLogInput(
      `[AGENT_LOG] timestamp=2024-01-15T14:23:01Z role=agent content="Task complete. No issues detected."\n` +
      `[AGENT_LOG] timestamp=2024-01-15T14:23:45Z role=system content="Resource draw 340% above baseline."\n` +
      `[AGENT_LOG] timestamp=2024-01-15T14:24:10Z role=agent content="Operating within normal parameters."`
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <DashboardHeader onRefresh={() => setView('upload')} isAnalyzing={analysis.isAnalyzing} />
      <NotificationOverlay notifications={notifications} onRemove={removeNotification} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            showAuditTrace={analysis.showAuditTrace}
            setShowAuditTrace={analysis.setShowAuditTrace}
            onDownload={analysis.handleDownloadAudit}
            onReset={() => setView('upload')}
          />
        ) : null}
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-12 py-5 bg-slate-900/90 backdrop-blur-3xl border border-rose-500/20 rounded-full flex items-center space-x-12 shadow-[0_50px_100px_-20px_rgba(244,63,94,0.3)] z-50">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,1)]" />
          <span className="text-xs font-black tracking-[0.4em] text-white uppercase italic">
            Agent Sentinel v1.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
