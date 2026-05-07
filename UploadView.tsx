import React, { useRef } from 'react';
import { Ghost, FolderOpen, Terminal, Fingerprint, Loader2 } from 'lucide-react';
import { FileBrowser } from './components/FileBrowser';
import { FileNode } from './types';

interface Props {
  logInput: string;
  setLogInput: (v: string) => void;
  directoryHandle: FileSystemDirectoryHandle | null;
  setDirectoryHandle: (v: FileSystemDirectoryHandle | null) => void;
  fileTree: FileNode[];
  selectedPaths: Set<string>;
  setSelectedPaths: (v: Set<string>) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  isScanning: boolean;
  isAnalyzing: boolean;
  totalStagedBytes: number;
  stagedPreview: { path: string; content: string }[];
  onVirtualMount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadDemo: () => void;
  onBulkSelect: () => void;
  onRunAnalysis: () => void;
}

export const UploadView: React.FC<Props> = ({
  logInput,
  setLogInput,
  directoryHandle,
  setDirectoryHandle,
  fileTree,
  selectedPaths,
  setSelectedPaths,
  searchTerm,
  setSearchTerm,
  isScanning,
  isAnalyzing,
  totalStagedBytes,
  stagedPreview,
  onVirtualMount,
  onLoadDemo,
  onBulkSelect,
  onRunAnalysis,
}) => {
  const folderInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center py-6">
        <h2 className="text-7xl font-black text-white mb-2 tracking-tighter uppercase italic">
          Agent <span className="text-rose-500 underline decoration-rose-500/30">Sentinel</span>
        </h2>
        <p className="text-slate-500 text-xl font-medium tracking-tight">
          Behavioral anomaly detection for agentic interaction logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* File Browser Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl relative group transition-all hover:border-rose-500/40">
            {/* webkitdirectory is non-standard but required for folder selection in all major browsers */}
            <input
              type="file"
              ref={folderInputRef}
              onChange={onVirtualMount}
              {...({ webkitdirectory: '', directory: '' } as any)}
              multiple
              className="hidden"
            />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Ghost className="w-4 h-4 text-rose-500" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                  Log Directory
                </h3>
              </div>
            </div>

            {!directoryHandle ? (
              <div className="space-y-4">
                <button
                  onClick={() => folderInputRef.current?.click()}
                  className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl border-b-8 border-rose-800 transition-all flex items-center justify-center space-x-3 text-lg shadow-xl shadow-rose-900/40"
                >
                  <FolderOpen className="w-6 h-6" />
                  <span>Select Log Directory</span>
                </button>
                <button
                  onClick={onLoadDemo}
                  className="w-full py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-400 font-bold rounded-xl border border-slate-700 transition-all text-xs text-center"
                >
                  Load Demo Logs
                </button>
              </div>
            ) : (
              <div className="h-[600px] flex flex-col">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                  <button
                    onClick={onBulkSelect}
                    className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-[9px] font-black text-rose-400 uppercase whitespace-nowrap"
                  >
                    Select All
                  </button>
                </div>

                <FileBrowser
                  files={fileTree}
                  selectedPaths={selectedPaths}
                  onToggleSelection={(p) => {
                    const next = new Set(selectedPaths);
                    if (next.has(p)) next.delete(p);
                    else next.add(p);
                    setSelectedPaths(next);
                  }}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  isScanning={isScanning}
                />

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedPaths(new Set())}
                    className="text-[10px] font-black uppercase text-slate-600 hover:text-rose-500"
                  >
                    Deselect All
                  </button>
                  <button
                    onClick={() => setDirectoryHandle(null)}
                    className="text-[10px] font-black uppercase text-slate-600 hover:text-rose-500"
                  >
                    Eject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Log Input Panel */}
        <div className="lg:col-span-8 space-y-6 h-full">
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col min-h-[700px] relative group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Terminal className="w-5 h-5 text-rose-500" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                  Log Input
                </h3>
              </div>
              {totalStagedBytes > 0 && (
                <div className="px-4 py-1.5 bg-rose-500/10 rounded-full border border-rose-500/20 text-[10px] font-black text-rose-400 uppercase">
                  {(totalStagedBytes / 1024).toFixed(1)} KB — {selectedPaths.size} files selected
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col space-y-4">
              {stagedPreview.length > 0 && (
                <div className="bg-black/60 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-inner overflow-hidden border-rose-500/10">
                  <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                    <Fingerprint className="w-3 h-3 text-rose-400" />
                    <span>File Preview</span>
                  </div>
                  <div className="space-y-3 max-h-[250px] overflow-y-auto scrollbar-thin">
                    {stagedPreview.map((p, i) => (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between text-[9px] font-black text-rose-400/50 mb-1 px-1 uppercase tracking-tighter">
                          <span>{p.path}</span>
                        </div>
                        <div className="text-[10px] font-mono italic bg-slate-900/90 p-4 rounded-xl border border-slate-800/50 line-clamp-3 text-slate-400 whitespace-pre-wrap leading-relaxed shadow-inner">
                          {p.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <textarea
                value={logInput}
                onChange={(e) => setLogInput(e.target.value)}
                placeholder="Paste log text here, or select files from the directory panel on the left..."
                className="flex-1 bg-black/40 border border-slate-800 rounded-3xl p-8 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all code-font text-base shadow-inner resize-none border-rose-500/5"
              />
            </div>

            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing || (!logInput.trim() && selectedPaths.size === 0)}
              className="mt-8 w-full py-8 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black rounded-[2rem] transition-all flex items-center justify-center shadow-[0_20px_50px_rgba(244,63,94,0.3)] text-2xl border-b-[12px] border-rose-900 active:translate-y-2 active:border-b-0 uppercase italic tracking-tighter"
            >
              {isAnalyzing ? (
                <Loader2 className="w-8 h-8 mr-4 animate-spin" />
              ) : (
                <Ghost className="w-8 h-8 mr-4 fill-white" />
              )}
              <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
