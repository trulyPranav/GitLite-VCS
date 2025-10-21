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
export function useFiles(repoId) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(async () => {
    if (!repoId) return;

    setLoading(true);
    setError(null);
    try {
      const fetchedFiles = await api.files.list(repoId);
      setFiles(fetchedFiles);
    } catch (err) {
      setError(err);
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const createFile = useCallback(
    async (fileData) => {
      setLoading(true);
      setError(null);
      try {
        const newFile = await api.files.create(repoId, fileData);
        setFiles((prev) => [...prev, newFile]);
        return newFile;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [repoId]
  );

  const uploadFile = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const newFile = await api.files.upload(repoId, formData);
        setFiles((prev) => [...prev, newFile]);
        return newFile;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [repoId]
  );

  const updateFile = useCallback(
    async (fileId, updates) => {
      setLoading(true);
      setError(null);
      try {
        const updatedFile = await api.files.update(repoId, fileId, updates);
        setFiles((prev) =>
          prev.map((file) => (file.id === fileId ? updatedFile : file))
        );
        return updatedFile;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [repoId]
  );

  const deleteFile = useCallback(
    async (fileId) => {
      setLoading(true);
      setError(null);
      try {
        await api.files.delete(repoId, fileId);
        setFiles((prev) => prev.filter((file) => file.id !== fileId));
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [repoId]
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
export function useFile(repoId, fileId) {
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
        api.files.getById(repoId, fileId),
        api.files.getVersions(repoId, fileId),
      ]);
      setFile(fileDetails);
      setVersions(fileVersions);
    } catch (err) {
      setError(err);
      console.error('Error fetching file:', err);
    } finally {
      setLoading(false);
    }
  }, [repoId, fileId]);

  useEffect(() => {
    fetchFile();
  }, [fetchFile]);

  const getVersion = useCallback(
    async (version) => {
      try {
        return await api.files.getVersion(repoId, fileId, version);
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [repoId, fileId]
  );

  const compareVersions = useCallback(
    async (v1, v2) => {
      try {
        return await api.files.compareVersions(repoId, fileId, v1, v2);
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [repoId, fileId]
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
