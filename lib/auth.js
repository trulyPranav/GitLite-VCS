/**
 * Authentication utility functions for token management
 */

const TOKEN_KEY = 'gitlite_access_token';
const REFRESH_TOKEN_KEY = 'gitlite_refresh_token';
const USER_KEY = 'gitlite_user';

/**
 * Store authentication tokens in localStorage
 */
export function storeAuthTokens(session, user) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TOKEN_KEY, session.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing auth tokens:', error);
  }
}

/**
 * Get the access token from localStorage
 */
export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Get the refresh token from localStorage
 */
export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

/**
 * Get the stored user data from localStorage
 */
export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

/**
 * Clear all authentication data from localStorage
 */
export function clearAuthTokens() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing auth tokens:', error);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getAccessToken();
}

/**
 * Get authorization header for API requests
 */
export function getAuthHeader() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
