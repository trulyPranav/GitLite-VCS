'use client';

import { useState, Fragment } from 'react';

/**
 * Enhanced DiffViewer Component
 * Supports multiple view modes: Unified, Side-by-Side, and Compact
 */
export default function DiffViewer({ diffData, v1, v2, filename, onClose }) {
  const [viewMode, setViewMode] = useState('unified'); // 'unified', 'side-by-side', 'compact'

  if (!diffData) return null;

  // Extract data from enhanced response
  const { diff, side_by_side, compact, file_id, version1, version2 } = diffData;

  // Parse unified diff into lines
  const parseUnifiedDiff = (diffString) => {
    if (!diffString) return [];
    const lines = diffString.split('\n');
    return lines.map(line => {
      if (line.startsWith('+++') || line.startsWith('---')) {
        return { type: 'header', text: line };
      } else if (line.startsWith('@@')) {
        return { type: 'hunk', text: line };
      } else if (line.startsWith('+') && !line.startsWith('+++')) {
        return { type: 'addition', text: line.substring(1) };
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        return { type: 'deletion', text: line.substring(1) };
      } else if (line.startsWith('Changes:') || line.startsWith('Summary:') || line.startsWith('===')) {
        return { type: 'meta', text: line };
      } else {
        return { type: 'context', text: line };
      }
    });
  };

  const unifiedLines = parseUnifiedDiff(diff);

  const getLineStyles = (type) => {
    switch (type) {
      case 'header':
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold';
      case 'hunk':
        return 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-medium';
      case 'addition':
        return 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400';
      case 'deletion':
        return 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400';
      case 'meta':
        return 'bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 font-medium border-y border-zinc-200 dark:border-zinc-700';
      default:
        return 'text-zinc-700 dark:text-zinc-300';
    }
  };

  const getChangeTypeStyles = (type) => {
    switch (type) {
      case 'modify':
        return 'bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-400';
      case 'insert':
        return 'bg-green-50 dark:bg-green-950/30 border-l-4 border-green-400';
      case 'delete':
        return 'bg-red-50 dark:bg-red-950/30 border-l-4 border-red-400';
      default:
        return '';
    }
  };

  const renderUnifiedView = () => {
    let lineNumber = 0;
    
    return (
      <div className="font-mono text-xs">
        {unifiedLines.map((line, index) => {
          // Track line numbers (skip headers, hunks, and meta lines)
          if (line.type === 'context' || line.type === 'addition' || line.type === 'deletion') {
            lineNumber++;
          }
          
          const showLineNumber = line.type === 'context' || line.type === 'addition' || line.type === 'deletion';
          
          return (
            <div
              key={index}
              className={`px-4 py-1 flex gap-3 ${getLineStyles(line.type)}`}
            >
              {showLineNumber && (
                <span className="select-none text-zinc-400 dark:text-zinc-600 min-w-10 text-right shrink-0">
                  {lineNumber}
                </span>
              )}
              <div className="flex gap-2 flex-1 whitespace-pre-wrap">
                {line.type === 'addition' && <span className="select-none opacity-70">+</span>}
                {line.type === 'deletion' && <span className="select-none opacity-70">-</span>}
                {line.type === 'context' && <span className="select-none opacity-30"> </span>}
                <span className="flex-1">{line.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSideBySideView = () => {
    if (!side_by_side || !side_by_side.changes) {
      return (
        <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
          Side-by-side view not available
        </div>
      );
    }

    const { changes, statistics, summary } = side_by_side;

    return (
      <div className="flex flex-col h-full">
        {/* Statistics Header */}
        {statistics && (
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-700 text-xs">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Changes: </span>
            <span className="text-green-600 dark:text-green-400">+{statistics.additions}</span>
            <span className="mx-1 text-zinc-400">•</span>
            <span className="text-red-600 dark:text-red-400">-{statistics.deletions}</span>
            <span className="mx-1 text-zinc-400">•</span>
            <span className="text-yellow-600 dark:text-yellow-400">~{statistics.modifications}</span>
            {summary && <span className="ml-2 text-zinc-500 dark:text-zinc-400">({summary})</span>}
          </div>
        )}

        {/* Side-by-side comparison */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-700">
            {/* Old version header */}
            <div className="px-4 py-2 bg-red-50 dark:bg-red-950/20 text-xs font-semibold text-red-700 dark:text-red-400 border-b border-zinc-200 dark:border-zinc-700">
              Version {version1 || v1} (Old)
            </div>
            {/* New version header */}
            <div className="px-4 py-2 bg-green-50 dark:bg-green-950/20 text-xs font-semibold text-green-700 dark:text-green-400 border-b border-zinc-200 dark:border-zinc-700">
              Version {version2 || v2} (New)
            </div>

            {/* Changes */}
            {changes.map((change, index) => (
              <Fragment key={index}>
                {/* Old lines */}
                <div className={`px-4 py-2 font-mono text-xs ${getChangeTypeStyles(change.type)}`}>
                  {change.old_lines && change.old_lines.length > 0 ? (
                    change.old_lines.map((line, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-zinc-400 dark:text-zinc-600 select-none min-w-10 text-right">
                          {change.old_line_numbers && change.old_line_numbers[i]}
                        </span>
                        <span className="text-zinc-700 dark:text-zinc-300">{line}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-zinc-400 dark:text-zinc-600 italic">(empty)</div>
                  )}
                </div>

                {/* New lines */}
                <div className={`px-4 py-2 font-mono text-xs ${getChangeTypeStyles(change.type)}`}>
                  {change.new_lines && change.new_lines.length > 0 ? (
                    change.new_lines.map((line, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-zinc-400 dark:text-zinc-600 select-none min-w-10 text-right">
                          {change.new_line_numbers && change.new_line_numbers[i]}
                        </span>
                        <span className="text-zinc-700 dark:text-zinc-300">{line}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-zinc-400 dark:text-zinc-600 italic">(empty)</div>
                  )}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCompactView = () => {
    if (!compact) {
      return (
        <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
          Compact view not available
        </div>
      );
    }

    const compactLines = compact.split('\n');
    let lineNumber = 0;

    return (
      <div className="font-mono text-xs">
        {compactLines.map((line, index) => {
          let type = 'context';
          if (line.startsWith('Summary:') || line.startsWith('===')) {
            type = 'meta';
          } else if (line.startsWith('@ ')) {
            type = 'hunk';
          } else if (line.startsWith('+')) {
            type = 'addition';
            lineNumber++;
          } else if (line.startsWith('-')) {
            type = 'deletion';
            lineNumber++;
          }

          const showLineNumber = type === 'addition' || type === 'deletion';

          return (
            <div
              key={index}
              className={`px-4 py-1 flex gap-3 ${getLineStyles(type)}`}
            >
              {showLineNumber && (
                <span className="select-none text-zinc-400 dark:text-zinc-600 min-w-10 text-right shrink-0">
                  {lineNumber}
                </span>
              )}
              <div className="flex-1 whitespace-pre-wrap">
                {line}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Compare Versions
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {filename} • v{version2 || v2} ↔ v{version1 || v1}
              </p>
            </div>
          </div>
          
          {/* View Mode Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded p-0.5">
              <button
                onClick={() => setViewMode('unified')}
                className={`px-3 py-1 text-xs font-medium rounded transition ${
                  viewMode === 'unified'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Unified
              </button>
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-1 text-xs font-medium rounded transition ${
                  viewMode === 'side-by-side'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-3 py-1 text-xs font-medium rounded transition ${
                  viewMode === 'compact'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Compact
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Legend - only show for unified and compact views */}
        {(viewMode === 'unified' || viewMode === 'compact') && (
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4 text-xs shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-green-200 dark:bg-green-900/50 rounded"></div>
              <span className="text-zinc-600 dark:text-zinc-400">Added</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-200 dark:bg-red-900/50 rounded"></div>
              <span className="text-zinc-600 dark:text-zinc-400">Removed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-blue-200 dark:bg-blue-900/50 rounded"></div>
              <span className="text-zinc-600 dark:text-zinc-400">Location</span>
            </div>
            {viewMode === 'unified' && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                <span className="text-zinc-600 dark:text-zinc-400">Context</span>
              </div>
            )}
          </div>
        )}

        {/* Diff Content */}
        <div className="flex-1 overflow-auto min-h-0 bg-white dark:bg-zinc-950">
          {viewMode === 'unified' && renderUnifiedView()}
          {viewMode === 'side-by-side' && renderSideBySideView()}
          {viewMode === 'compact' && renderCompactView()}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {viewMode === 'side-by-side' && side_by_side?.statistics ? (
              <>
                {side_by_side.statistics.additions} additions • {' '}
                {side_by_side.statistics.deletions} deletions • {' '}
                {side_by_side.statistics.modifications} modifications
              </>
            ) : (
              <>
                {unifiedLines.filter(l => l.type === 'addition').length} additions • {' '}
                {unifiedLines.filter(l => l.type === 'deletion').length} deletions
              </>
            )}
          </p>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
