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
        className="px-2 py-1 text-xs rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        + Branch
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded p-4 w-full max-w-md">
            <h3 className="text-sm font-medium mb-2 text-zinc-800 dark:text-zinc-200">Create Branch</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs block mb-1 text-zinc-600 dark:text-zinc-400">Branch name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-2 py-1 border rounded bg-white dark:bg-zinc-800" />
              </div>
              <div>
                <label className="text-xs block mb-1 text-zinc-600 dark:text-zinc-400">Parent branch</label>
                <input 
                  value={parent} 
                  onChange={(e) => setParent(e.target.value)} 
                  className="w-full px-2 py-1 border rounded bg-white dark:bg-zinc-800" 
                  placeholder={currentBranch || "main"}
                />
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                  Leave empty to branch from: {currentBranch || "default branch"}
                </p>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setIsOpen(false)} className="px-3 py-1 rounded border">Cancel</button>
                <button type="submit" disabled={loading} className="px-3 py-1 rounded bg-indigo-600 text-white">
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
