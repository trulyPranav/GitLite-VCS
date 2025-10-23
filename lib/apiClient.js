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

  // Detect FormData bodies so we don't set Content-Type (browser will set multipart boundary)
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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

    // Try to parse JSON, but allow empty/non-json responses
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch (e) {
      return text;
    }
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

  async resetPassword(email){
    return await apiFetch('/auth/password-reset', {
      method: 'POST',
      body: JSON.stringify({email}),
    });
  },

  /**
   * Update password using reset token
   */
  async updatePassword(accessToken, newPassword) {
    return await apiFetch('/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({
        access_token: accessToken,
        new_password: newPassword
      }),
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
  async create(repoId, fileData, { branch } = {}) {
    const qs = branch ? `?branch=${encodeURIComponent(branch)}` : '';
    return await apiFetch(`/repositories/${repoId}/files${qs}`, {
      method: 'POST',
      body: JSON.stringify(fileData),
    });
  },

  /**
   * Upload a binary file to repository
   */
  async upload(repoId, formData, { branch } = {}) {
    const qs = branch ? `?branch=${encodeURIComponent(branch)}` : '';
    const url = `/repositories/${repoId}/files/upload${qs}`;
    const token = getAccessToken();

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      // Use apiFetch to reuse auth/error handling but ensure FormData bypasses JSON content-type
      return await apiFetch(url, {
        method: 'POST',
        headers,
        body: formData, // FormData with file
      });
    } catch (error) {
      console.error(`API Error [/repositories/${repoId}/files/upload${qs}]:`, error);
      throw error;
    }
  },

  /**
   * List all files in repository
   */
  async list(repoId, { branch } = {}) {
    const qs = branch ? `?branch=${encodeURIComponent(branch)}` : '';
    return await apiFetch(`/repositories/${repoId}/files${qs}`);
  },

  /**
   * Get file details
   */
  async getById(repoId, fileId, { branch } = {}) {
    const qs = branch ? `?branch=${encodeURIComponent(branch)}` : '';
    return await apiFetch(`/repositories/${repoId}/files/${fileId}${qs}`);
  },

  /**
   * Update file (creates new version)
   */
  async update(repoId, fileId, updates, { branch } = {}) {
    const qs = branch ? `?branch=${encodeURIComponent(branch)}` : '';
    return await apiFetch(`/repositories/${repoId}/files/${fileId}${qs}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete file
   */
  async delete(repoId, fileId, { branch } = {}) {
    const qs = branch ? `?branch=${encodeURIComponent(branch)}` : '';
    return await apiFetch(`/repositories/${repoId}/files/${fileId}${qs}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get file version history
   */
  async getVersions(repoId, fileId, { branch } = {}) {
    const qs = branch ? `?branch=${encodeURIComponent(branch)}` : '';
    return await apiFetch(`/repositories/${repoId}/files/${fileId}/versions${qs}`);
  },

  /**
   * Get specific file version
   */
  async getVersion(repoId, fileId, version, { branch } = {}) {
    const qs = branch ? `?branch=${encodeURIComponent(branch)}` : '';
    return await apiFetch(`/repositories/${repoId}/files/${fileId}/versions/${version}${qs}`);
  },

  /**
   * Compare file versions (diff)
   * @param {string} format - Diff format: 'unified' (default), 'side_by_side', 'compact', or 'all'
   */
  async compareVersions(repoId, fileId, v1, v2, format = 'all', { branch } = {}) {
    const qsParts = [`format=${encodeURIComponent(format)}`];
    if (branch) qsParts.push(`branch=${encodeURIComponent(branch)}`);
    const qs = qsParts.length ? `?${qsParts.join('&')}` : '';
    return await apiFetch(`/repositories/${repoId}/files/${fileId}/diff/${v1}/${v2}${qs}`);
  },
};

// ============================================================================
// Branching API
// ============================================================================

export const branchesAPI = {
  async create(repoId, name, parentBranchName = null) {
    return await apiFetch(`/repositories/${repoId}/branches`, {
      method: 'POST',
      body: JSON.stringify({ name, parent_branch_name: parentBranchName }),
    });
  },

  async list(repoId) {
    return await apiFetch(`/repositories/${repoId}/branches`);
  },

  async getByName(repoId, branchName) {
    return await apiFetch(`/repositories/${repoId}/branches/${encodeURIComponent(branchName)}`);
  },

  async delete(repoId, branchName) {
    return await apiFetch(`/repositories/${repoId}/branches/${encodeURIComponent(branchName)}`, {
      method: 'DELETE',
    });
  },

  async getVersionHistory(repoId, branchName) {
    return await apiFetch(`/repositories/${repoId}/branches/${encodeURIComponent(branchName)}/versions`);
  },
};

// ============================================================================
// Merge Requests API
// ============================================================================

export const mergeRequestsAPI = {
  async create(repoId, sourceBranch, targetBranch, title, description = '') {
    return await apiFetch(`/repositories/${repoId}/merge-requests`, {
      method: 'POST',
      body: JSON.stringify({
        source_branch: sourceBranch,
        target_branch: targetBranch,
        title,
        description,
      }),
    });
  },

  async list(repoId, { status } = {}) {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return await apiFetch(`/repositories/${repoId}/merge-requests${qs}`);
  },

  async getById(repoId, mrId) {
    return await apiFetch(`/repositories/${repoId}/merge-requests/${mrId}`);
  },

  async merge(mrId) {
    return await apiFetch(`/merge-requests/${mrId}/merge`, {
      method: 'POST',
    });
  },
};

// ============================================================================
// Conflict Resolution API
// ============================================================================

export const conflictsAPI = {
  async resolve(conflictId, strategy, resolvedContentBase64 = null) {
    const body = { resolution_strategy: strategy };
    if (strategy === 'manual') {
      body.resolved_content = resolvedContentBase64;
    }
    return await apiFetch(`/merge-conflicts/${conflictId}/resolve`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};

// ============================================================================
// Export default API client
// ============================================================================

export default {
  auth: authAPI,
  repositories: repositoryAPI,
  files: fileAPI,
  branches: branchesAPI,
  mergeRequests: mergeRequestsAPI,
  conflicts: conflictsAPI,
};
