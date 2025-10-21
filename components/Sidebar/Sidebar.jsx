'use client';

import { useState } from 'react';
import { useRepositories, useFiles } from '@/lib/hooks';
import CreateRepoButton from './CreateRepoButton';

export default function Sidebar({ selectedRepoId, onSelectRepo, selectedFileId, onSelectFile, isOpen, onClose }) {
  const { repositories, loading: isLoading, error } = useRepositories();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRepos, setExpandedRepos] = useState(new Set([selectedRepoId]));

  const toggleRepoExpand = (repoId) => {
    const newExpanded = new Set(expandedRepos);
    if (newExpanded.has(repoId)) {
      newExpanded.delete(repoId);
    } else {
      newExpanded.add(repoId);
    }
    setExpandedRepos(newExpanded);
  };

  const handleRepoClick = (repoId) => {
    onSelectRepo(repoId);
    toggleRepoExpand(repoId);
    onClose?.();
  };

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 lg:static lg:translate-x-0
          w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Explorer
            </h2>
            <CreateRepoButton />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Repository List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-7 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
              ))}
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="text-center py-12 px-4">
              <svg className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {error ? `Error: ${error.message}` : 'No repositories yet'}
              </p>
              {!error && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  Create your first repository
                </p>
              )}
            </div>
          ) : (
            <div className="py-1">
              {filteredRepos.map(repo => (
                <RepoTreeItem
                  key={repo.id}
                  repo={repo}
                  isSelected={selectedRepoId === repo.id}
                  isExpanded={expandedRepos.has(repo.id)}
                  onRepoClick={handleRepoClick}
                  onToggleExpand={toggleRepoExpand}
                  selectedFileId={selectedFileId}
                  onSelectFile={onSelectFile}
                />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// Repository Tree Item Component
function RepoTreeItem({ repo, isSelected, isExpanded, onRepoClick, onToggleExpand, selectedFileId, onSelectFile }) {
  const { files, loading } = useFiles(repo.id);

  return (
    <div className="select-none">
      {/* Repository Item */}
      <div
        className={`group flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition ${
          isSelected && !selectedFileId ? 'bg-zinc-100 dark:bg-zinc-900' : ''
        }`}
        onClick={() => onRepoClick(repo.id)}
      >
        {/* Expand/Collapse Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(repo.id);
          }}
          className="shrink-0 w-4 h-4 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition"
        >
          <svg
            className={`w-3 h-3 text-zinc-500 dark:text-zinc-400 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Folder Icon */}
        <svg
          className={`w-4 h-4 shrink-0 ${
            isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>

        {/* Repository Name */}
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
          {repo.name}
        </span>

        {/* File Count Badge */}
        {files.length > 0 && (
          <span className="ml-auto text-[10px] text-zinc-400 dark:text-zinc-500">
            {files.length}
          </span>
        )}
      </div>

      {/* File List (shown when expanded) */}
      {isExpanded && (
        <div className="ml-5 border-l border-zinc-200 dark:border-zinc-800">
          {loading ? (
            <div className="py-2 px-3">
              <div className="h-5 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
            </div>
          ) : files.length === 0 ? null : (
            <div className="py-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFile(file.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition ${
                    selectedFileId === file.id ? 'bg-indigo-50 dark:bg-indigo-950/30' : ''
                  }`}
                >
                  {/* File Icon */}
                  <svg
                    className={`w-3.5 h-3.5 shrink-0 ${
                      selectedFileId === file.id
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>

                  {/* File Name */}
                  <span
                    className={`text-xs truncate ${
                      selectedFileId === file.id
                        ? 'text-indigo-700 dark:text-indigo-300 font-medium'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {file.filename || file.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}