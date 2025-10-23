'use client';

import { useState } from 'react';

/**
 * Visual branch flow indicator showing current branch and merge direction
 * Helps users understand the branching model at a glance
 */
export default function BranchFlowIndicator({ currentBranch, isDefault }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!currentBranch) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
      {/* Branch Icon */}
      <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>

      {/* Current Branch Name */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
          On:
        </span>
        <code className="font-mono text-sm font-semibold text-indigo-900 dark:text-indigo-100 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded">
          {currentBranch}
        </code>
        {isDefault && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700">
            default
          </span>
        )}
      </div>

      {/* Info Icon with Tooltip */}
      <div className="relative">
        <button
          type="button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          className="p-0.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded transition"
          aria-label="Branch information"
        >
          <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-zinc-900 dark:bg-zinc-800 text-white text-xs rounded-lg shadow-xl z-50 border border-zinc-700">
            <div className="space-y-2">
              <p className="font-semibold text-indigo-300">Current Branch</p>
              <p className="text-zinc-300">
                Changes you make (upload files, create versions) will only affect <strong>{currentBranch}</strong>
              </p>
              <div className="pt-2 border-t border-zinc-700">
                <p className="text-zinc-400">
                  Use the <strong>Merge</strong> button to merge changes to another branch
                </p>
              </div>
            </div>
            {/* Arrow pointing up */}
            <div className="absolute bottom-full right-4 -mb-1">
              <div className="border-4 border-transparent border-b-zinc-900 dark:border-b-zinc-800"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
