'use client';

import { useState, useEffect } from 'react';
import { conflictsAPI, mergeRequestsAPI, fileAPI } from '@/lib/apiClient';

export default function ConflictResolver({ repoId, mergeRequest, onClose, onResolved }) {
  const [resolutions, setResolutions] = useState({});
  const [manualEdits, setManualEdits] = useState({});
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState('');
  const [expandedConflicts, setExpandedConflicts] = useState(new Set());

  const conflicts = mergeRequest.conflicts || [];

  const toggleExpand = (conflictId) => {
    const newExpanded = new Set(expandedConflicts);
    if (newExpanded.has(conflictId)) {
      newExpanded.delete(conflictId);
    } else {
      newExpanded.add(conflictId);
    }
    setExpandedConflicts(newExpanded);
  };

  const handleStrategyChange = (conflict, strategy) => {
    setResolutions({
      ...resolutions,
      [conflict.id]: strategy,
    });
  };

  const handleManualEdit = (conflict, content) => {
    setManualEdits({
      ...manualEdits,
      [conflict.id]: content,
    });
  };

  const handleResolveAll = async () => {
    setResolving(true);
    setError('');
    
    try {
      // Resolve each conflict
      for (const conflict of conflicts) {
        const strategy = resolutions[conflict.id] || 'ours';
        const manualContent = manualEdits[conflict.id];
        
        let resolvedContentBase64 = null;
        if (strategy === 'manual' && manualContent) {
          resolvedContentBase64 = btoa(unescape(encodeURIComponent(manualContent)));
        }
        
        await conflictsAPI.resolve(conflict.id, strategy, resolvedContentBase64);
      }

      // After all conflicts resolved, try to merge
      await mergeRequestsAPI.merge(mergeRequest.id);
      
      if (onResolved) onResolved();
      onClose();
    } catch (err) {
      console.error('Resolution failed', err);
      setError(err.message || 'Failed to resolve conflicts');
    } finally {
      setResolving(false);
    }
  };

  const allResolved = conflicts.every(c => {
    const strategy = resolutions[c.id];
    if (!strategy) return false;
    if (strategy === 'manual') {
      return manualEdits[c.id]?.trim();
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-5 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Resolve Conflicts
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            ⚠️ {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} detected. 
            Choose a resolution strategy for each file.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-4">
          {conflicts.map((conflict) => {
            const isExpanded = expandedConflicts.has(conflict.id);
            const strategy = resolutions[conflict.id] || '';

            return (
              <div
                key={conflict.id}
                className="border dark:border-zinc-700 rounded-lg overflow-hidden"
              >
                <div
                  className="p-3 bg-zinc-50 dark:bg-zinc-800 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleExpand(conflict.id)}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {conflict.filename}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      ({conflict.conflict_type})
                    </span>
                  </div>
                  {strategy && (
                    <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">
                      {strategy}
                    </span>
                  )}
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        Resolution Strategy
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleStrategyChange(conflict, 'ours')}
                          className={`px-3 py-2 text-sm rounded border ${
                            strategy === 'ours'
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          Keep Ours (v{conflict.target_version})
                        </button>
                        <button
                          onClick={() => handleStrategyChange(conflict, 'theirs')}
                          className={`px-3 py-2 text-sm rounded border ${
                            strategy === 'theirs'
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          Take Theirs (v{conflict.source_version})
                        </button>
                        <button
                          onClick={() => handleStrategyChange(conflict, 'manual')}
                          className={`px-3 py-2 text-sm rounded border ${
                            strategy === 'manual'
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          Manual Edit
                        </button>
                      </div>
                    </div>

                    {strategy === 'manual' && (
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          Resolved Content
                        </label>
                        <textarea
                          value={manualEdits[conflict.id] || ''}
                          onChange={(e) => handleManualEdit(conflict, e.target.value)}
                          placeholder="Enter the resolved content..."
                          rows={10}
                          className="w-full px-3 py-2 text-sm font-mono border rounded bg-white dark:bg-zinc-800"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          Target (Ours) - v{conflict.target_version}
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded text-xs font-mono max-h-40 overflow-auto">
                          <ConflictPreview conflict={conflict} version="target" repoId={repoId} />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          Source (Theirs) - v{conflict.source_version}
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded text-xs font-mono max-h-40 overflow-auto">
                          <ConflictPreview conflict={conflict} version="source" repoId={repoId} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 justify-end pt-3 border-t dark:border-zinc-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleResolveAll}
            disabled={!allResolved || resolving}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50"
          >
            {resolving ? 'Resolving & Merging...' : 'Resolve All & Merge'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper component to preview file content
function ConflictPreview({ conflict, version, repoId }) {
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    const versionNum = version === 'source' ? conflict.source_version : conflict.target_version;
    fileAPI
      .getVersion(repoId, conflict.file_id, versionNum)
      .then((data) => {
        setContent(data.content_text || data.content || '(No content)');
      })
      .catch((err) => {
        setContent(`Error loading: ${err.message}`);
      });
  }, [conflict, version, repoId]);

  return <pre className="whitespace-pre-wrap text-xs">{content}</pre>;
}
