/**
 * Custom React Hooks for GitLite VCS API
 */

import { useState, useEffect, useCallback } from 'react';
import api from './apiClient';
import { getStoredUser, clearAuthTokens } from './auth';

/**
 * Hook to get current authenticated user
 */
export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        // First try to get from localStorage
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }

        // Then fetch fresh data from API
        const freshUser = await api.auth.getCurrentUser();
        setUser(freshUser);
      } catch (err) {
        // If user fetch fails, check if it's an auth error
        if (err.message.includes('Session expired') || err.message.includes('unauthorized')) {
          // Token is invalid, clear it
          const { clearAuthTokens } = await import('./auth');
          clearAuthTokens();
        }
        setError(err);
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading, error };
}

/**
 * Hook to manage repositories
 */
export function useRepositories() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch repositories on mount
  useEffect(() => {
    async function fetchRepositories() {
      setLoading(true);
      setError(null);
      try {
        const repos = await api.repositories.list();
        setRepositories(repos);
      } catch (err) {
        console.error('Error fetching repositories:', err);
        setError(err);
        // Fallback to empty array if fetch fails
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRepositories();
  }, []);

  const createRepository = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const newRepo = await api.repositories.create(data);
      setRepositories((prev) => [...prev, newRepo]);
      return newRepo;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRepository = useCallback(async (repoId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRepo = await api.repositories.update(repoId, updates);
      setRepositories((prev) =>
        prev.map((repo) => (repo.id === repoId ? updatedRepo : repo))
      );
      return updatedRepo;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRepository = useCallback(async (repoId) => {
    setLoading(true);
    setError(null);
    try {
      await api.repositories.delete(repoId);
      setRepositories((prev) => prev.filter((repo) => repo.id !== repoId));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    repositories,
    loading,
    error,
    createRepository,
    updateRepository,
    deleteRepository,
    setRepositories,
  };
}

/**
 * Hook to manage a single repository
 */
export function useRepository(repoId) {
  const [repository, setRepository] = useState(null);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRepository = useCallback(async () => {
    if (!repoId) return;
    
    setLoading(true);
    setError(null);
    try {
      const [repo, repoStats, repoActivity] = await Promise.all([
        api.repositories.getById(repoId),
        api.repositories.getStats(repoId),
        api.repositories.getActivity(repoId),
      ]);
      setRepository(repo);
      setStats(repoStats);
      setActivity(repoActivity);
    } catch (err) {
      setError(err);
      console.error('Error fetching repository:', err);
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    fetchRepository();
  }, [fetchRepository]);

  const compareStates = useCallback(
    async (state1Date, state2Date) => {
      try {
        return await api.repositories.compareStates(repoId, state1Date, state2Date);
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [repoId]
  );

  return {
    repository,
    stats,
    activity,
    loading,
    error,
    refetch: fetchRepository,
    compareStates,
  };
}

/**
 * Hook to manage files in a repository
 */
export function useFiles(repoId, branch = null) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(async () => {
    if (!repoId) return;
    
    // Don't fetch files if branch is explicitly null (waiting for branch selection)
    // Only fetch if branch is undefined (no branching) or has a value
    if (branch === null) {
      console.log(`[useFiles] Skipping file fetch - branch not selected yet for repo ${repoId}`);
      setFiles([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    console.log(`[useFiles] Fetching files for repo ${repoId}, branch: ${branch || 'none'}`);
    
    try {
      const fetchedFiles = await api.files.list(repoId, { branch });
      console.log(`[useFiles] Fetched ${fetchedFiles?.length || 0} files for branch '${branch}'`);
      setFiles(fetchedFiles);
    } catch (err) {
      // Only log errors that aren't "expected" branch-related errors
      if (!err.message?.includes('not found in branch') && !err.message?.includes('Branch') && !err.message?.includes('not found')) {
        console.error('[useFiles] Error fetching files:', err);
      } else {
        console.warn(`[useFiles] Expected error for branch '${branch}':`, err.message);
      }
      setError(err);
      setFiles([]); // Clear files on error
    } finally {
      setLoading(false);
    }
  }, [repoId, branch]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const createFile = useCallback(
    async (fileData) => {
      setLoading(true);
      setError(null);
      try {
        const newFile = await api.files.create(repoId, fileData, { branch });
        // Refetch files to ensure we get the updated list from backend
        await fetchFiles();
        return newFile;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [repoId, branch, fetchFiles]
  );

  const uploadFile = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const newFile = await api.files.upload(repoId, formData, { branch });
        // Refetch files to ensure we get the updated list from backend
        await fetchFiles();
        return newFile;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [repoId, branch, fetchFiles]
  );

  const updateFile = useCallback(
    async (fileId, updates) => {
      setLoading(true);
      setError(null);
      try {
        const updatedFile = await api.files.update(repoId, fileId, updates, { branch });
        // Refetch files to ensure we get the updated list from backend
        await fetchFiles();
        return updatedFile;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [repoId, branch, fetchFiles]
  );

  const deleteFile = useCallback(
    async (fileId) => {
      setLoading(true);
      setError(null);
      try {
        await api.files.delete(repoId, fileId, { branch });
        // Refetch files to ensure we get the updated list from backend
        await fetchFiles();
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [repoId, branch, fetchFiles]
  );

  return {
    files,
    loading,
    error,
    refetch: fetchFiles,
    createFile,
    uploadFile,
    updateFile,
    deleteFile,
  };
}

/**
 * Hook to manage a single file
 */
export function useFile(repoId, fileId, branch = null) {
  const [file, setFile] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFile = useCallback(async () => {
    if (!repoId || !fileId) return;

    setLoading(true);
    setError(null);
    try {
      const [fileDetails, fileVersions] = await Promise.all([
        api.files.getById(repoId, fileId, { branch }),
        api.files.getVersions(repoId, fileId, { branch }),
      ]);
      setFile(fileDetails);
      setVersions(fileVersions);
    } catch (err) {
      setError(err);
      // Only log non-branch-specific errors (avoid noise for expected branch mismatches)
      if (!err.message?.includes('not found in branch')) {
        console.error('Error fetching file:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [repoId, fileId, branch]);

  useEffect(() => {
    fetchFile();
  }, [fetchFile]);

  const getVersion = useCallback(
    async (version) => {
      try {
        return await api.files.getVersion(repoId, fileId, version, { branch });
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [repoId, fileId, branch]
  );

  const compareVersions = useCallback(
    async (v1, v2) => {
      try {
        return await api.files.compareVersions(repoId, fileId, v1, v2, 'all', { branch });
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [repoId, fileId, branch]
  );

  return {
    file,
    versions,
    loading,
    error,
    refetch: fetchFile,
    getVersion,
    compareVersions,
  };
}

/**
 * Hook to handle logout
 */
export function useLogout() {
  const logout = useCallback(async () => {
    try {
      await api.auth.signout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuthTokens();
      window.location.href = '/login';
    }
  }, []);

  return logout;
}
