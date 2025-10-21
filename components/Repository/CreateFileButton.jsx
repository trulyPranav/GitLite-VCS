'use client';

import { useState } from 'react';
import { useFiles } from '@/lib/hooks';

export default function CreateFileButton({ repoId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState('text'); // 'text' or 'file'
  const [filename, setFilename] = useState('');
  const [contentText, setContentText] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const { createFile, uploadFile, loading } = useFiles(repoId);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilename(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!filename.trim()) {
      setError('Filename is required');
      return;
    }

    try {
      if (uploadMode === 'file') {
        // Binary file upload
        if (!selectedFile) {
          setError('Please select a file to upload');
          return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('commit_message', commitMessage.trim() || 'Upload file');
        
        await uploadFile(formData);
      } else {
        // Text content creation
        await createFile({
          filename: filename.trim(),
          content_text: contentText,
          commit_message: commitMessage.trim() || 'Initial commit',
        });
      }
      
      // Reset and close
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to create file');
    }
  };

  const resetForm = () => {
    setFilename('');
    setContentText('');
    setCommitMessage('');
    setSelectedFile(null);
    setError('');
    setUploadMode('text');
  };

  if (!repoId) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New File
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Create New File</h2>
            
            {/* Upload Mode Toggle */}
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setUploadMode('text')}
                className={`flex-1 px-4 py-2 rounded-md transition ${
                  uploadMode === 'text'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                📝 Text Content
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`flex-1 px-4 py-2 rounded-md transition ${
                  uploadMode === 'file'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                📁 Upload File
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {uploadMode === 'file' ? (
                // File Upload Mode
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Select File *
                    </label>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-800 dark:text-white"
                      required
                    />
                    {selectedFile && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                </>
              ) : (
                // Text Content Mode
                <>
                  <div>
                    <label htmlFor="filename" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Filename *
                    </label>
                    <input
                      id="filename"
                      type="text"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      placeholder="main.py"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      File Content
                    </label>
                    <textarea
                      id="content"
                      value={contentText}
                      onChange={(e) => setContentText(e.target.value)}
                      placeholder="Enter file content..."
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm bg-white dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="commit-msg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Commit Message
                </label>
                <input
                  id="commit-msg"
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder={uploadMode === 'file' ? 'Upload file' : 'Initial commit'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Creating...' : uploadMode === 'file' ? 'Upload File' : 'Create File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
