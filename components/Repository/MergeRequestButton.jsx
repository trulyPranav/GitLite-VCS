'use client';

import { useState, useEffect } from 'react';
import { branchesAPI, mergeRequestsAPI } from '@/lib/apiClient';

export default function MergeRequestButton({ repoId, currentBranch, onCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [branches, setBranches] = useState([]);
  const [targetBranch, setTargetBranch] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && repoId) {
      branchesAPI.list(repoId)
        .then((data) => {
          setBranches(data || []);
          // Auto-select default branch as target
          const defaultBranch = data.find(b => b.is_default);
          if (defaultBranch && !targetBranch) {
            setTargetBranch(defaultBranch.name);
          }
        })
        .catch(err => console.error('Failed to load branches', err));
    }
  }, [isOpen, repoId, targetBranch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!currentBranch || !targetBranch) {
      setError('Source and target branches are required');
      return;
    }

    if (currentBranch === targetBranch) {
      setError('Source and target branches must be different');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const mr = await mergeRequestsAPI.create(
        repoId,
        currentBranch,
        targetBranch,
        title || `Merge ${currentBranch} into ${targetBranch}`,
        description
      );
      
      setIsOpen(false);
      setTitle('');
      setDescription('');
      if (onCreated) onCreated(mr);
    } catch (err) {
      console.error('Create MR failed', err);
      setError(err.message || 'Failed to create merge request');
    } finally {
      setLoading(false);
    }
  };

  if (!repoId || !currentBranch) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-2 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white"
      >
        Merge
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-5 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-3 text-zinc-800 dark:text-zinc-200">
              Create Merge Request
            </h3>
            
            {/* Visual Merge Direction Indicator */}
            <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-2 font-medium">
                Merge Direction (Source → Target)
              </p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded border border-blue-300 dark:border-blue-700">
                  <div className="text-xs text-blue-600 dark:text-blue-400">Source</div>
                  <div className="font-mono text-sm font-semibold text-blue-900 dark:text-blue-200">
                    {currentBranch}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">flows to</span>
                </div>
                <div className="flex-1 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded border border-green-300 dark:border-green-700">
                  <div className="text-xs text-green-600 dark:text-green-400">Target</div>
                  <div className="font-mono text-sm font-semibold text-green-900 dark:text-green-200">
                    {targetBranch || '...'}
                  </div>
                </div>
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                💡 File versions from <strong>{currentBranch}</strong> will update <strong>{targetBranch || 'target'}</strong>
              </p>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs block mb-1 text-zinc-600 dark:text-zinc-400">
                    Source Branch
                  </label>
                  <input
                    value={currentBranch}
                    disabled
                    className="w-full px-2 py-1.5 border rounded bg-zinc-50 dark:bg-zinc-800 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs block mb-1 text-zinc-600 dark:text-zinc-400">
                    Target Branch *
                  </label>
                  <select
                    value={targetBranch}
                    onChange={(e) => setTargetBranch(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded bg-white dark:bg-zinc-800 text-sm"
                    required
                  >
                    <option value="">Select target...</option>
                    {branches
                      .filter(b => b.name !== currentBranch)
                      .map(b => (
                        <option key={b.id} value={b.name}>
                          {b.name} {b.is_default ? '(default)' : ''}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs block mb-1 text-zinc-600 dark:text-zinc-400">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Merge ${currentBranch} into ${targetBranch || '...'}`}
                  className="w-full px-2 py-1.5 border rounded bg-white dark:bg-zinc-800 text-sm"
                />
              </div>

              <div>
                <label className="text-xs block mb-1 text-zinc-600 dark:text-zinc-400">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the changes..."
                  rows={3}
                  className="w-full px-2 py-1.5 border rounded bg-white dark:bg-zinc-800 text-sm"
                />
              </div>

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setError('');
                  }}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Merge Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
