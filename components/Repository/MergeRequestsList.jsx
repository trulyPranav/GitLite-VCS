'use client';

import { useState, useEffect } from 'react';
import { mergeRequestsAPI } from '@/lib/apiClient';
import ConflictResolver from './ConflictResolver';

export default function MergeRequestsList({ repoId, onMergeComplete }) {
  const [mergeRequests, setMergeRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMR, setSelectedMR] = useState(null);
  const [merging, setMerging] = useState(null);

  const fetchMRs = async () => {
    if (!repoId) return;
    setLoading(true);
    setError('');
    try {
      const mrs = await mergeRequestsAPI.list(repoId);
      setMergeRequests(mrs || []);
    } catch (err) {
      console.error('Failed to load merge requests', err);
      setError(err.message || 'Failed to load merge requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMRs();
  }, [repoId]);

  const handleMerge = async (mr) => {
    if (mr.has_conflicts) {
      setSelectedMR(mr);
      return;
    }

    setMerging(mr.id);
    setError('');
    try {
      console.log(`[MergeRequestsList] Attempting to merge MR ${mr.id}`);
      await mergeRequestsAPI.merge(mr.id);
      console.log(`[MergeRequestsList] Merge successful for MR ${mr.id}`);
      await fetchMRs();
      if (onMergeComplete) onMergeComplete(mr);
    } catch (err) {
      console.error(`[MergeRequestsList] Merge failed for MR ${mr.id}:`, err);
      setError(err.message || 'Failed to merge');
    } finally {
      setMerging(null);
    }
  };

  const handleConflictsResolved = async () => {
    setSelectedMR(null);
    await fetchMRs();
  };

  if (!repoId) return null;

  const openMRs = mergeRequests.filter(mr => mr.status === 'open' || mr.status === 'conflicts');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Merge Requests
        </h3>
        <button
          onClick={fetchMRs}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</div>
      )}

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {!loading && openMRs.length === 0 && (
        <div className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
          No open merge requests
        </div>
      )}

      <div className="space-y-2">
        {openMRs.map((mr) => (
          <div
            key={mr.id}
            className="border dark:border-zinc-700 rounded-lg p-3 bg-white dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {mr.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {mr.source_branch?.name || mr.source_branch_name} → {mr.target_branch?.name || mr.target_branch_name}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 text-xs rounded ${
                  mr.status === 'conflicts'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}
              >
                {mr.status}
              </span>
            </div>

            {mr.description && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                {mr.description}
              </p>
            )}

            {mr.has_conflicts && mr.conflicts && mr.conflicts.length > 0 && (
              <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-2">
                ⚠️ {mr.conflicts.length} conflict{mr.conflicts.length !== 1 ? 's' : ''} detected
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleMerge(mr)}
                disabled={merging === mr.id}
                className={`px-3 py-1 text-xs rounded ${
                  mr.has_conflicts
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } disabled:opacity-50`}
              >
                {merging === mr.id
                  ? 'Merging...'
                  : mr.has_conflicts
                  ? 'Resolve Conflicts'
                  : 'Merge'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMR && (
        <ConflictResolver
          repoId={repoId}
          mergeRequest={selectedMR}
          onClose={() => setSelectedMR(null)}
          onResolved={handleConflictsResolved}
        />
      )}
    </div>
  );
}
