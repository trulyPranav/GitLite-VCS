'use client';

import { useEffect, useState } from 'react';
import { fetchRepos } from '@/lib/api';

export default function Sidebar({ selectedRepoId, onSelectRepo, isOpen, onClose }) {
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRepos().then((data) => {
      setRepos(data);
      setIsLoading(false);
    });
  }, []);

  const filteredRepos = repos.filter(repo =>
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
          w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        <div className="p-4 border-b border-border">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-zinc-100 dark:bg-zinc-800 text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Repositories
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {filteredRepos.length}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-8 bg-muted/40 rounded animate-pulse" />
              ))}
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No repositories found
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredRepos.map(repo => (
                <li key={repo.id}>
                  <button
                    onClick={() => {
                      onSelectRepo(repo.id);
                      onClose?.();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition
                      ${selectedRepoId === repo.id
                        ? 'bg-accent text-white shadow'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground'
                      }
                    `}
                  >
                    <svg
                      className={`w-4 h-4 ${selectedRepoId === repo.id ? 'text-white' : 'text-zinc-400'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="truncate">{repo.name}</span>
                    {repo.fileCount && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {repo.fileCount}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <button className="w-full py-2 px-3 bg-accent text-white rounded-md text-sm hover:bg-accent-hover transition flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Repository
          </button>
        </div>
      </aside>
    </>
  );
}