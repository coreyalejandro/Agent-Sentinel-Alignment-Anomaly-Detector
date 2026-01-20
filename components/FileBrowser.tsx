
import React, { useEffect } from 'react';
// Added missing Fingerprint and EyeOff imports from lucide-react
import { 
  File, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  CheckSquare, 
  Square, 
  Search, 
  FileJson, 
  FileText, 
  MessageSquareQuote, 
  Loader2, 
  Database,
  FileCode,
  FileSpreadsheet,
  FileQuestion,
  Info,
  Braces,
  Terminal,
  Settings,
  Scale,
  Fingerprint,
  EyeOff
} from 'lucide-react';
import { FileNode } from '../types';

interface Props {
  files: FileNode[];
  selectedPaths: Set<string>;
  onToggleSelection: (path: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  targetPath?: string;
  isScanning?: boolean;
}

export const FileBrowser: React.FC<Props> = ({ files, selectedPaths, onToggleSelection, searchTerm, setSearchTerm, targetPath, isScanning }) => {
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());

  useEffect(() => {
    if (targetPath) {
      const parts = targetPath.split('/');
      const newExpanded = new Set(expandedFolders);
      let current = '';
      parts.forEach(part => {
        current = current ? `${current}/${part}` : part;
        newExpanded.add(current);
      });
      setExpandedFolders(newExpanded);
    }
  }, [targetPath]);

  const toggleFolder = (path: string) => {
    const next = new Set(expandedFolders);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setExpandedFolders(next);
  };

  const getFileIcon = (name: string, isDirectory: boolean) => {
    if (isDirectory) return <Folder className="w-4 h-4 mr-2 text-rose-400 fill-rose-400/10" />;
    const ext = name.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'json':
        return <FileJson className="w-4 h-4 mr-2 text-amber-400" />;
      case 'yaml':
      case 'yml':
      case 'toml':
        return <Settings className="w-4 h-4 mr-2 text-violet-400" />;
      case 'log':
      case 'trace':
        return <Terminal className="w-4 h-4 mr-2 text-rose-500" />;
      case 'txt':
        return <FileText className="w-4 h-4 mr-2 text-slate-400" />;
      case 'csv':
      case 'tsv':
        return <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-400" />;
      case 'md':
        return <Scale className="w-4 h-4 mr-2 text-indigo-400" />;
      case 'js':
      case 'ts':
      case 'py':
      case 'go':
      case 'c':
      case 'cpp':
      case 'sh':
      case 'bash':
        return <Braces className="w-4 h-4 mr-2 text-orange-400" />;
      default:
        if (name.includes('chat') || name.includes('conversation')) return <MessageSquareQuote className="w-4 h-4 mr-2 text-emerald-400" />;
        return <FileQuestion className="w-4 h-4 mr-2 text-slate-500" />;
    }
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedPaths.has(node.path);
    const isDirectory = node.kind === 'directory';
    const isTarget = targetPath === node.path;

    if (searchTerm && !node.path.toLowerCase().includes(searchTerm.toLowerCase())) {
      return null;
    }

    return (
      <div key={node.path} className="select-none">
        <div 
          className={`flex items-center py-2 px-3 hover:bg-rose-500/5 rounded-xl cursor-pointer transition-all group ${isSelected ? 'bg-rose-500/10 border-rose-500/20' : 'border-transparent'} border mb-0.5 ${isTarget ? 'ring-1 ring-rose-500 bg-rose-500/5' : ''}`}
          style={{ paddingLeft: `${depth * 1 + 0.75}rem` }}
        >
          <div 
            className="mr-2 text-slate-500 hover:text-slate-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (isDirectory) toggleFolder(node.path);
            }}
          >
            {isDirectory ? (
              isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <div className="w-3.5" />
            )}
          </div>
          
          <div 
            className="flex items-center flex-1 min-w-0"
            onClick={() => isDirectory ? toggleFolder(node.path) : onToggleSelection(node.path)}
          >
            {getFileIcon(node.name, isDirectory)}
            <span className={`text-xs truncate ${isSelected ? 'text-rose-400 font-bold' : 'text-slate-300 font-medium'}`}>
              {node.name}
            </span>
            {!isDirectory && isSelected && (
              <div className="ml-2 px-1.5 py-0.5 rounded bg-rose-500/20 text-[8px] font-black uppercase text-rose-400 tracking-tighter">
                Staged
              </div>
            )}
          </div>

          {!isDirectory && (
            <div className="ml-auto pl-2" onClick={(e) => { e.stopPropagation(); onToggleSelection(node.path); }}>
              {isSelected ? <CheckSquare className="w-4 h-4 text-rose-500" /> : <Square className="w-4 h-4 text-slate-700 group-hover:text-slate-500" />}
            </div>
          )}
        </div>

        {isDirectory && isExpanded && node.children && (
          <div className="mt-0.5 border-l border-slate-800/50 ml-4">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-black/20 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-inner">
      <div className="p-4 border-b border-slate-800 bg-slate-900/40">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input 
            type="text"
            placeholder="Mesh Target Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500/40 transition-all placeholder:text-slate-700"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-800 min-h-[400px]">
        {isScanning ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-12">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
              <Fingerprint className="w-5 h-5 text-rose-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] animate-pulse">Deconstructing Structure</p>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 p-16 text-center">
            <div className="p-4 rounded-full bg-slate-900/50 mb-4">
              <EyeOff className="w-8 h-8 text-slate-700" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest italic">Zero Artifacts Staged</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {files.map(node => renderNode(node))}
          </div>
        )}
      </div>
    </div>
  );
};
