'use client';

import { useFiles } from '@/lib/hooks';
import FileItem from './FileItem';
import CreateFileButton from './CreateFileButton';

export default function FileList({ repoId, selectedFileId, onSelectFile }) {
  const { files, loading, error } = useFiles(repoId);

  if (!repoId) {
    return (
      <div className="border-l border-gray-200 p-4 flex items-center justify-center h-full">
        <p className="text-gray-500">Select a repository to view files</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border-l border-gray-200 p-4 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-l border-gray-200 p-4">
        <div className="text-red-600 text-sm">
          Error loading files: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="border-l border-gray-200 dark:border-zinc-800 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold dark:text-white">Files</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">{files.length}</span>
        </div>
        <CreateFileButton repoId={repoId} />
      </div>
      
      {files.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <svg className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">No files in this repository yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs">Click "New File" to create your first file</p>
        </div>
      ) : (
        <ul className="overflow-auto space-y-2 flex-1">
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              isSelected={file.id === selectedFileId}
              onSelect={() => onSelectFile(file.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
