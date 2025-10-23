'use client';

import { useState, useEffect } from 'react';
import { fileAPI } from '@/lib/apiClient';

export default function UploadVersionForm({ repoId, fileId, onSuccess, onCancel, branch }) {
  const [uploadMode, setUploadMode] = useState('text'); // 'text' or 'file'
  const [textContent, setTextContent] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [error, setError] = useState('');

  // Fetch current file content when component mounts
  useEffect(() => {
    const fetchCurrentContent = async () => {
      if (!repoId || !fileId) return;
      
      setIsLoadingContent(true);
      try {
        const fileData = await fileAPI.getById(repoId, fileId, { branch });
        if (fileData.content_text || fileData.content) {
          setTextContent(fileData.content_text || fileData.content || '');
        }
      } catch (err) {
        console.error('Failed to load current file content:', err);
        // Don't show error, just leave content empty
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchCurrentContent();
  }, [repoId, fileId, branch]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // For text files, read content
      if (file.type.startsWith('text/') || file.name.match(/\.(txt|md|js|jsx|ts|tsx|py|java|cpp|c|cs|go|rs|php|rb|json|xml|html|css|yml|yaml)$/i)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setTextContent(e.target.result);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError('');
    
    try {
      if (uploadMode === 'file' && !selectedFile) {
        setError('Please select a file to upload');
        return;
      }

      if (uploadMode === 'text' && !textContent.trim()) {
        setError('File content cannot be empty');
        return;
      }

      if (uploadMode === 'file') {
        // Use binary upload endpoint
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('commit_message', commitMessage.trim() || 'Upload file');
        // Optional: include text content as fallback
        if (textContent) formData.append('content_text', textContent);

        await fileAPI.upload(repoId, formData, { branch });
      } else {
        // Use PUT endpoint to create new version (text)
        await fileAPI.update(repoId, fileId, {
          content_text: textContent,
          commit_message: commitMessage.trim() || 'Update file',
        }, { branch });
      }
      
      // Reset form
      setTextContent('');
      setCommitMessage('');
      setSelectedFile(null);
      setUploadMode('text');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to upload new version');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Upload New Version</h3>
      
      {/* Upload Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setUploadMode('text')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
            uploadMode === 'text'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Text
          </span>
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
            uploadMode === 'file'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload File
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {uploadMode === 'file' ? (
          // File Upload Mode
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Select File *
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 dark:file:bg-indigo-900/30 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50"
                required
              />
            </div>
            {selectedFile && (
              <div className="mt-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-md">
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-indigo-700 dark:text-indigo-300 font-medium">{selectedFile.name}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                </div>
              </div>
            )}
            {textContent && (
              <div className="mt-2">
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  File Preview
                </label>
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md max-h-32 overflow-auto">
                  <pre className="text-xs font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{textContent.slice(0, 500)}{textContent.length > 500 ? '...' : ''}</pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Text Content Mode
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              File Content *
            </label>
            {isLoadingContent ? (
              <div className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center" style={{ minHeight: '288px' }}>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading current content...</p>
                </div>
              </div>
            ) : (
              <textarea
                required
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none font-mono"
                placeholder="Enter file content..."
                rows={12}
              />
            )}
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {textContent.length} characters, {textContent.split('\n').length} lines
            </p>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Commit Message
          </label>
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Describe what you changed..."
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-md">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-700 dark:text-zinc-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading || isLoadingContent || (!textContent.trim() && uploadMode === 'text')}
            className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Uploading...</span>
              </>
            ) : isLoadingContent ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Upload Version</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
