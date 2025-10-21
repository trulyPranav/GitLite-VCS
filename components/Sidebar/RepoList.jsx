'use client';

import { useEffect, useState } from 'react';
import { fetchRepos } from '@/lib/api';

export default function RepoList({ selectedRepoId, onSelectRepo }) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetchRepos().then(setRepos);
  }, []);

  return (
    <ul className="space-y-2 overflow-auto max-h-[calc(100vh-150px)]">
      {repos.map((repo) => (
        <li
          key={repo.id}
          onClick={() => onSelectRepo(repo.id)}
          className={`cursor-pointer px-3 py-2 rounded ${
            selectedRepoId === repo.id ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-100'
          }`}
        >
          {repo.name}
        </li>
      ))}
    </ul>
  );
}
