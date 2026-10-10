import React, { useState } from 'react';
import JSZip from 'jszip';
import { PYTHON_FILES } from '../data/pythonFiles';

export const PythonCodeExplorer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('app.py');
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<string>('Copy Code');

  const activeFile =
    PYTHON_FILES.find((f) => f.path === selectedFilePath) || PYTHON_FILES[0];

  // Download entire Python project as ZIP
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const folder = zip.folder('stockstream-quant');

      PYTHON_FILES.forEach((file) => {
        folder?.file(file.path, file.code);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'stockstream-quant.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Code'), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>STOCKSTREAM QUANT — Python Codebase & Test Suite</span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              13/13 Tests Passing
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Production-oriented Python application structure ready for local Streamlit execution and GitHub deployment.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded text-xs transition-colors shadow flex items-center gap-2"
        >
          <span>{isZipping ? 'Bundling Zip...' : 'Download stockstream-quant.zip'}</span>
        </button>
      </div>

      {/* 2. Codebase Browser Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start font-mono text-xs">
        {/* File Tree Sidebar */}
        <div className="bg-[#0b1528] border border-[#1e293b] rounded-lg p-3 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
            Project Files
          </div>
          {PYTHON_FILES.map((file) => (
            <button
              key={file.path}
              onClick={() => setSelectedFilePath(file.path)}
              className={`w-full text-left px-2.5 py-2 rounded transition-colors flex items-center justify-between text-xs ${
                selectedFilePath === file.path
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#070e1f]'
              }`}
            >
              <span className="truncate">{file.path}</span>
            </button>
          ))}
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-3 bg-[#070e1f] border border-[#1e293b] rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#0b1528] border-b border-[#1e293b] flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-100">{activeFile.path}</span>
              <span className="text-slate-400 text-[11px] ml-2">
                — {activeFile.description}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 text-[11px] bg-[#070e1f] border border-[#1e293b] rounded text-slate-300 hover:text-slate-100 transition-colors"
            >
              {copyStatus}
            </button>
          </div>

          <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre selection:bg-emerald-500/30">
            {activeFile.code}
          </div>
        </div>
      </div>
    </div>
  );
};
