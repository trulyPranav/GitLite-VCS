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
        className="px-3 py-2 text-xs font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1.5 shadow-sm hover:shadow"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Merge
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Create Merge Request
            </h3>
            
            {/* Visual Merge Direction Indicator */}
            <div className="mb-5 p-4 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-3 font-semibold flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Merge Direction
              </p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 px-4 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl border-2 border-blue-300 dark:border-blue-700">
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Source</div>
                  <div className="font-mono text-sm font-bold text-blue-900 dark:text-blue-200">
                    {currentBranch}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">flows to</span>
                </div>
                <div className="flex-1 px-4 py-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl border-2 border-emerald-300 dark:border-emerald-700">
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Target</div>
                  <div className="font-mono text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    {targetBranch || '...'}
                  </div>
                </div>
              </div>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-3 flex items-start gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>File versions from <strong>{currentBranch}</strong> will update <strong>{targetBranch || 'target'}</strong></span>
              </p>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-2 text-zinc-700 dark:text-zinc-300">
                    Source Branch
                  </label>
                  <input
                    value={currentBranch}
                    disabled
                    className="w-full px-4 py-3 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-2 text-zinc-700 dark:text-zinc-300">
                    Target Branch *
                  </label>
                  <select
                    value={targetBranch}
                    onChange={(e) => setTargetBranch(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-zinc-600/30 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-sm hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                <label className="text-xs font-medium block mb-2 text-zinc-700 dark:text-zinc-300">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Merge ${currentBranch} into ${targetBranch || '...'}`}
                  className="w-full px-4 py-3 border-2 border-zinc-600/30 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-2 text-zinc-700 dark:text-zinc-300">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the changes..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-zinc-600/30 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setError('');
                  }}
                  className="px-4 py-2.5 rounded-xl border-2 border-zinc-600/30 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : 'Create Merge Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
