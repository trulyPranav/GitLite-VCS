'use client';

import { useState } from 'react';
import { repositoryAPI } from '@/lib/apiClient';

export default function DeleteRepoButton({ repoId, repoName, onDeleted, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText !== repoName) {
      setError('Repository name does not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log(`[DeleteRepoButton] Deleting repository '${repoName}' (ID: ${repoId})`);
      await repositoryAPI.delete(repoId);
      console.log(`[DeleteRepoButton] Repository '${repoName}' deleted successfully`);
      
      setIsOpen(false);
      if (onDeleted) onDeleted(repoId, repoName);
    } catch (err) {
      console.error(`[DeleteRepoButton] Failed to delete repository:`, err);
      setError(err.message || 'Failed to delete repository');
    } finally {
      setLoading(false);
    }
  };

  const renderModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Delete Repository
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p className="text-sm text-red-800 dark:text-red-300 font-semibold mb-2">
            🚨 Danger Zone
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">
            This will permanently delete the repository <span className="font-semibold">"{repoName}"</span> along with:
          </p>
          <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside mt-2 space-y-1">
            <li>All files and versions</li>
            <li>All branches</li>
            <li>All merge requests</li>
            <li>Complete version history</li>
          </ul>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Type <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{repoName}</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder={repoName}
            autoComplete="off"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              setIsOpen(false);
              setConfirmText('');
              setError('');
            }}
            disabled={loading}
            className="px-4 py-2 text-sm rounded border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || confirmText !== repoName}
            className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              'Delete Repository'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (!repoId) return null;

  if (compact) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="p-1 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition"
          title="Delete repository"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        {isOpen && renderModal()}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 text-sm rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition flex items-center gap-2"
        title="Delete repository"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete Repository
      </button>
      {isOpen && renderModal()}
    </>
  );
}

