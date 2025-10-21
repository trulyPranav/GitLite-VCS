'use client';

import { useState } from 'react';
import { fileAPI } from '@/lib/apiClient';
import DiffViewer from './DiffViewer';

export default function FileVersions({ repoId, fileId, filename, versions, onRefresh }) {
  const [downloading, setDownloading] = useState(null);
  const [comparing, setComparing] = useState(null);
  const [diffData, setDiffData] = useState(null);
  const [compareVersions, setCompareVersions] = useState({ v1: null, v2: null });

  const handleDownload = async (version) => {
    setDownloading(version.version_number);
    try {
      const versionData = await fileAPI.getVersion(repoId, fileId, version.version_number);
      
      // Create blob from content
      const content = versionData.content_text || versionData.content || '';
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_v${version.version_number}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading version:', error);
      alert('Failed to download version: ' + error.message);
    } finally {
      setDownloading(null);
    }
  };

  const handleCompare = async (v1, v2) => {
    // Debug logging
    console.log('Compare versions:', { v1, v2, repoId, fileId });
    
    // Validate parameters
    if (!v1 || !v2) {
      console.error('Invalid version numbers:', { v1, v2 });
      alert('Invalid version numbers');
      return;
    }
    
    setComparing(`${v1}-${v2}`);
    try {
      const diff = await fileAPI.compareVersions(repoId, fileId, v1, v2);
      setDiffData(diff);
      setCompareVersions({ v1, v2 });
    } catch (error) {
      console.error('Error comparing versions:', error);
      alert('Failed to compare versions: ' + error.message);
    } finally {
      setComparing(null);
    }
  };

  const closeDiffViewer = () => {
    setDiffData(null);
    setCompareVersions({ v1: null, v2: null });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (!versions || versions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
        <div className="text-center">
          <svg className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">No versions yet</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">Upload a new version to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-900/50 min-h-0">
      <div className="p-4 space-y-3">
        {versions.map((version, index) => (
          <div
            key={version.id || version.version_number}
            className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-md transition"
          >
            {/* Version Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    v{version.version_number}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      Version {version.version_number}
                    </h4>
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded">
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {formatDate(version.created_at || version.uploadedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Commit Message */}
            {version.commit_message && (
              <div className="mb-3 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded border border-zinc-200 dark:border-zinc-700">
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {version.commit_message}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              {version.file_size && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {formatFileSize(version.file_size)}
                </div>
              )}
              {version.uploader && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {version.uploader}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload(version)}
                disabled={downloading === version.version_number}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded text-xs font-medium transition flex items-center gap-1.5"
              >
                {downloading === version.version_number ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </>
                )}
              </button>
              
              {index < versions.length - 1 && (
                <button
                  onClick={() => handleCompare(versions[index + 1].version_number, version.version_number)}
                  disabled={comparing === `${versions[index + 1].version_number}-${version.version_number}`}
                  className="px-3 py-1.5 bg-zinc-600 hover:bg-zinc-700 disabled:bg-zinc-400 text-white rounded text-xs font-medium transition flex items-center gap-1.5"
                >
                  {comparing === `${versions[index + 1].version_number}-${version.version_number}` ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      Comparing...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Compare with v{versions[index + 1].version_number}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {diffData && (
        <DiffViewer 
          diffData={diffData}
          v1={compareVersions.v1}
          v2={compareVersions.v2}
          filename={filename}
          onClose={closeDiffViewer}
        />
      )}
    </div>
  );
}
