'use client';

import { useRepositories } from '@/lib/hooks';

export default function RepoList({ selectedRepoId, onSelectRepo }) {
  const { repositories, loading, error } = useRepositories();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm p-3">
        Error loading repositories: {error.message}
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="text-gray-500 text-sm p-3 text-center">
        No repositories yet. Create one to get started!
      </div>
    );
  }

  return (
    <ul className="space-y-2 overflow-auto max-h-[calc(100vh-150px)]">
      {repositories.map((repo) => (
        <li
          key={repo.id}
          onClick={() => onSelectRepo(repo.id)}
          className={`cursor-pointer px-3 py-2 rounded transition-colors ${
            selectedRepoId === repo.id ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-100'
          }`}
        >
          <div className="font-medium">{repo.name}</div>
          {repo.description && (
            <div className="text-xs opacity-75 truncate">{repo.description}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
