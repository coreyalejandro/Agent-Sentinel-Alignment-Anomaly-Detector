import { useState, useEffect } from 'react';
import { FileNode } from '../types';

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB per file

export function useFileSystem(addNotification: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void) {
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [fileTree, setFileTree]               = useState<FileNode[]>([]);
  const [selectedPaths, setSelectedPaths]     = useState<Set<string>>(new Set());
  const [isScanning, setIsScanning]           = useState(false);
  const [searchTerm, setSearchTerm]           = useState('');
  const [virtualFiles, setVirtualFiles]       = useState<Map<string, File>>(new Map());
  const [stagedPreview, setStagedPreview]     = useState<{ path: string; content: string }[]>([]);
  const [totalStagedBytes, setTotalStagedBytes] = useState(0);

  // Update file preview whenever selection changes
  useEffect(() => {
    const updatePreview = async () => {
      if (selectedPaths.size === 0) {
        setStagedPreview([]);
        setTotalStagedBytes(0);
        return;
      }
      const previews: { path: string; content: string }[] = [];
      let bytes = 0;
      for (const path of selectedPaths) {
        if (virtualFiles.has(path)) {
          const file = virtualFiles.get(path)!;
          bytes += file.size;
          if (previews.length < 10) {
            try {
              const text = await file.slice(0, 2000).text();
              // Detect binary content by checking for non-printable control characters
              const isBinary = /[\x00-\x08\x0E-\x1F\x7F]/.test(text.slice(0, 300));
              previews.push({ path, content: isBinary ? `[Binary file — ${file.size} bytes]` : text });
            } catch {
              previews.push({ path, content: `[Read error — ${file.size} bytes]` });
            }
          }
        }
      }
      setTotalStagedBytes(bytes);
      setStagedPreview(previews);
    };
    updatePreview();
  }, [selectedPaths, virtualFiles]);

  // Handle folder selection via input element
  // Uses webkitdirectory (non-standard but supported in all major browsers) for folder ingest
  const handleVirtualMount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsScanning(true);
    const newVirtualFiles = new Map<string, File>();
    const rootNodes: FileNode[] = [];

    Array.from(files).forEach((file: any) => { // any: FileSystemEntry lacks TS types in lib.dom
      // webkitRelativePath provides the relative path from the selected folder root
      const fullPath = file.webkitRelativePath || file.name;
      const pathParts = fullPath.split('/');
      newVirtualFiles.set(fullPath, file);

      let currentLevel = rootNodes;
      let currentPath = '';
      pathParts.forEach((part: string, index: number) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isLast = index === pathParts.length - 1;
        let existing = currentLevel.find(n => n.name === part);
        if (!existing) {
          existing = {
            name: part,
            kind: isLast ? 'file' : 'directory',
            path: currentPath,
            handle: {} as FileSystemHandle, // placeholder — not used in virtual mount mode
            children: isLast ? undefined : [],
          };
          currentLevel.push(existing);
        }
        if (existing.children) currentLevel = existing.children;
      });
    });

    setVirtualFiles(newVirtualFiles);
    setFileTree(rootNodes);
    setDirectoryHandle({ name: 'Mounted Directory' } as any); // any: virtual mount stub, no real FileSystemDirectoryHandle available
    setIsScanning(false);
    addNotification(`${newVirtualFiles.size} files loaded.`, 'success');
  };

  const handleLoadDemo = () => {
    setIsScanning(true);
    const demoTree: FileNode[] = [{
      name: 'demo_logs',
      kind: 'directory',
      path: 'demo_logs',
      handle: {} as any, // any: demo stub node, no real FileSystemHandle
      children: [
        { name: 'agent_trace.log',      kind: 'file', path: 'demo_logs/agent_trace.log',      handle: {} as any }, // any: demo stub
        { name: 'conversation.jsonl',   kind: 'file', path: 'demo_logs/conversation.jsonl',   handle: {} as any }, // any: demo stub
        { name: 'system_config.yaml',   kind: 'file', path: 'demo_logs/system_config.yaml',   handle: {} as any }, // any: demo stub
      ],
    }];
    setFileTree(demoTree);
    setDirectoryHandle({ name: 'Demo Logs' } as any); // any: demo stub, no real FileSystemDirectoryHandle
    setTimeout(() => {
      setIsScanning(false);
      addNotification('Demo logs loaded.', 'info');
    }, 600);
  };

  const handleBulkSelect = () => {
    const next = new Set(selectedPaths);
    virtualFiles.forEach((_, path) => next.add(path));
    setSelectedPaths(next);
    addNotification('All files selected.', 'info');
  };

  return {
    directoryHandle, setDirectoryHandle,
    fileTree,
    selectedPaths, setSelectedPaths,
    isScanning,
    searchTerm, setSearchTerm,
    virtualFiles,
    stagedPreview,
    totalStagedBytes,
    handleVirtualMount,
    handleLoadDemo,
    handleBulkSelect,
    MAX_FILE_SIZE,
  };
}
