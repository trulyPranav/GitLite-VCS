'use client';

import { useState } from 'react';
import { useCurrentUser, useLogout } from '@/lib/hooks';

export default function Header({ onToggleSidebar, isSidebarOpen }) {
  const { user, loading, error } = useCurrentUser();
  const logout = useLogout();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const getUserInitials = () => {
    if (user?.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  // If there's an auth error, don't show user menu
  const isAuthenticated = user && !error;

  return (
    <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h1 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            GitLite VCS
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors" 
              aria-label="User menu"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-white">{getUserInitials()}</span>
              </div>
              <svg className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 z-50">
                <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{user?.full_name || user?.username || 'User'}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <a
            href="/login"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition"
          >
            Sign In
          </a>
        )}
      </div>
    </header>
  );
}