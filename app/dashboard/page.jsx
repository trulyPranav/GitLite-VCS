'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import FileList from '@/components/Repository/FileList';
import FileDetails from '@/components/File/FileDetails';
import Header from '@/components/Layout/Header';

export default function DashboardPage() {
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectRepo = (repoId) => {
    setSelectedRepoId(repoId);
    setSelectedFileId(null);
    setIsSidebarOpen(false);
  };

  const handleSelectFile = (fileId) => {
    setSelectedFileId(fileId);
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const handleVersionUpload = () => {
    setRefreshKey((v) => v + 1);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedRepoId={selectedRepoId}
          onSelectRepo={handleSelectRepo}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 flex overflow-hidden">
          <FileList
            repoId={selectedRepoId}
            selectedFileId={selectedFileId}
            onSelectFile={handleSelectFile}
          />

          <FileDetails
            key={`${selectedFileId}-${refreshKey}`}
            fileId={selectedFileId}
            onVersionUpload={handleVersionUpload}
          />
        </div>
      </div>
    </div>
  );
}