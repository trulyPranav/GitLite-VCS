/**
 * Centralized API Client for GitLite VCS
 * Handles all API requests with authentication
 */

import { getAccessToken, clearAuthTokens } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Base fetch wrapper with authentication and error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authentication token if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle authentication errors
    if (response.status === 401) {
      clearAuthTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please login again.');
    }

    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(response);
    // Return parsed JSON response
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============================================================================
// Authentication API
// ============================================================================

export const authAPI = {
  /**
   * Login (unified signin/signup)
   */
  async login(credentials) {
    return await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Sign out
   */
  async signout() {
    return await apiFetch('/auth/signout', {
      method: 'POST',
    });
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    return await apiFetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    return await apiFetch('/auth/me');
  },

  /**
   * Update user profile
   */
  async updateProfile(updates) {
    return await apiFetch('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Get user by ID (public profile)
   */
  async getUserById(userId) {
    return await apiFetch(`/auth/user/${userId}`);
  },
};

// ============================================================================
// Repository API
// ============================================================================

export const repositoryAPI = {
  /**
   * List all repositories for current user
   * TODO: Backend needs to implement this endpoint
   */
  async list() {
    return await apiFetch('/repositories');
  },

  /**
   * Create a new repository
   */
  async create(data) {
    return await apiFetch('/repositories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get repository by ID
   */
  async getById(repoId) {
    return await apiFetch(`/repositories/${repoId}`);
  },

  /**
   * Update repository
   */
  async update(repoId, updates) {
    return await apiFetch(`/repositories/${repoId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete repository
   */
  async delete(repoId) {
    return await apiFetch(`/repositories/${repoId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get repository statistics
   */
  async getStats(repoId) {
    return await apiFetch(`/repositories/${repoId}/stats`);
  },

  /**
   * Get repository activity
   */
  async getActivity(repoId, limit = 20) {
    return await apiFetch(`/repositories/${repoId}/activity?limit=${limit}`);
  },

  /**
   * Compare repository states
   */
  async compareStates(repoId, state1Date, state2Date) {
    return await apiFetch(`/repositories/${repoId}/compare`, {
      method: 'POST',
      body: JSON.stringify({
        state1_date: state1Date,
        state2_date: state2Date,
      }),
    });
  },
};

// ============================================================================
// File Management API
// ============================================================================

export const fileAPI = {
  /**
   * Create a new file in repository (text content)
   */
  async create(repoId, fileData) {
    return await apiFetch(`/repositories/${repoId}/files`, {
      method: 'POST',
      body: JSON.stringify(fileData),
    });
  },

  /**
   * Upload a binary file to repository
   */
  async upload(repoId, formData) {
    const url = `${API_BASE_URL}/repositories/${repoId}/files/upload`;
    const token = getAccessToken();

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData, // FormData with file
      });

      if (response.status === 401) {
        clearAuthTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [/repositories/${repoId}/files/upload]:`, error);
      throw error;
    }
  },

  /**
   * List all files in repository
   */
  async list(repoId) {
    return await apiFetch(`/repositories/${repoId}/files`);
  },

  /**
   * Get file details
   */
  async getById(repoId, fileId) {
    return await apiFetch(`/repositories/${repoId}/files/${fileId}`);
  },

  /**
   * Update file (creates new version)
   */
  async update(repoId, fileId, updates) {
    return await apiFetch(`/repositories/${repoId}/files/${fileId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete file
   */
  async delete(repoId, fileId) {
    return await apiFetch(`/repositories/${repoId}/files/${fileId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get file version history
   */
  async getVersions(repoId, fileId) {
    return await apiFetch(`/repositories/${repoId}/files/${fileId}/versions`);
  },

  /**
   * Get specific file version
   */
  async getVersion(repoId, fileId, version) {
    return await apiFetch(`/repositories/${repoId}/files/${fileId}/versions/${version}`);
  },

  /**
   * Compare file versions (diff)
   * @param {string} format - Diff format: 'unified' (default), 'side_by_side', 'compact', or 'all'
   */
  async compareVersions(repoId, fileId, v1, v2, format = 'all') {
    return await apiFetch(`/repositories/${repoId}/files/${fileId}/diff/${v1}/${v2}?format=${format}`);
  },
};

// ============================================================================
// Export default API client
// ============================================================================

export default {
  auth: authAPI,
  repositories: repositoryAPI,
  files: fileAPI,
};
