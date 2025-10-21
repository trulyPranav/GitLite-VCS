'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import FileDetails from '@/components/File/FileDetails';
import Header from '@/components/Layout/Header';
import CreateFileButton from '@/components/Repository/CreateFileButton';

export default function DashboardPage() {
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectRepo = (repoId) => {
    setSelectedRepoId(repoId);
    setSelectedFileId(null);
  };

  const handleSelectFile = (fileId) => {
    setSelectedFileId(fileId);
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const handleVersionUpload = () => {
    setRefreshKey((v) => v + 1);
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex-1 flex overflow-hidden min-h-0">
        <Sidebar
          selectedRepoId={selectedRepoId}
          onSelectRepo={handleSelectRepo}
          selectedFileId={selectedFileId}
          onSelectFile={handleSelectFile}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Top Bar with New File Button */}
          {selectedRepoId && (
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Repository Files
                </span>
              </div>
              <CreateFileButton repoId={selectedRepoId} />
            </div>
          )}

          {/* File Content Area */}
          <div className="flex-1 min-h-0 flex flex-col">
            <FileDetails
              key={`${selectedFileId}-${refreshKey}`}
              repoId={selectedRepoId}
              fileId={selectedFileId}
              onVersionUpload={handleVersionUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}