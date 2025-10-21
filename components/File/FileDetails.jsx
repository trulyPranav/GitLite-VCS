'use client';

import { useState } from 'react';
import { useFile } from '@/lib/hooks';
import { fileAPI } from '@/lib/apiClient';
import FileViewer from './FileViewer';
import FileVersions from './FileVersions';
import UploadVersionForm from './UploadVersionForm';

export default function FileDetails({ repoId, fileId, onVersionUpload }) {
  const { file, versions, loading, error, refetch } = useFile(repoId, fileId);
  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'versions'
  const [showUploadForm, setShowUploadForm] = useState(false);

  if (!fileId || !repoId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <svg className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">Select a file from the explorer</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading file...</p>
        </div>
      </div>
    );
  }

  const handleVersionUploadSuccess = () => {
    setShowUploadForm(false);
    refetch();
    if (onVersionUpload) {
      onVersionUpload();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {file?.filename || 'Loading...'}
              </h2>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                {versions.length} {versions.length === 1 ? 'version' : 'versions'}
                {file?.file_size && ` • ${(file.file_size / 1024).toFixed(2)} KB`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Version
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition ${
              activeTab === 'content'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Content
            </span>
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition ${
              activeTab === 'versions'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History ({versions.length})
            </span>
          </button>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <UploadVersionForm
          repoId={repoId}
          fileId={fileId}
          onSuccess={handleVersionUploadSuccess}
          onCancel={() => setShowUploadForm(false)}
        />
      )}

      {/* Content Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        {activeTab === 'content' ? (
          <FileViewer
            content={file?.content_text || file?.content}
            filename={file?.filename}
          />
        ) : (
          <FileVersions
            repoId={repoId}
            fileId={fileId}
            filename={file?.filename}
            versions={versions}
            onRefresh={refetch}
          />
        )}
      </div>
    </div>
  );
}
