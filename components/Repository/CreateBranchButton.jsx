 'use client';

import { useState } from 'react';
import { branchesAPI } from '@/lib/apiClient';

export default function CreateBranchButton({ repoId, currentBranch, onCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Branch name is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Use current branch as parent if no parent specified
      const parentBranch = parent.trim() || currentBranch || null;
      console.log(`Creating branch '${name.trim()}' from parent '${parentBranch}'`);
      
      const created = await branchesAPI.create(repoId, name.trim(), parentBranch);
      console.log('Branch created successfully:', created);
      
      setIsOpen(false);
      setName('');
      setParent('');
      
      if (onCreated) {
        console.log('Calling onCreated callback with:', created);
        onCreated(created);
      }
    } catch (err) {
      console.error('Create branch failed', err);
      setError(err.message || 'Failed to create branch');
      // Don't close modal on error so user can see the error and retry
    } finally {
      setLoading(false);
    }
  };

  if (!repoId) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-2 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1.5 shadow-sm hover:shadow"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Branch
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Create New Branch</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-2 text-zinc-700 dark:text-zinc-300">Branch Name *</label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-zinc-600/30 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="feature/new-feature"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-2 text-zinc-700 dark:text-zinc-300">Parent Branch</label>
                <input 
                  value={parent} 
                  onChange={(e) => setParent(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-zinc-600/30 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                  placeholder={currentBranch || "main"}
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Leave empty to branch from: <span className="font-medium text-indigo-600 dark:text-indigo-400">{currentBranch || "default branch"}</span>
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="px-4 py-2.5 rounded-xl border-2 border-zinc-600/30 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
