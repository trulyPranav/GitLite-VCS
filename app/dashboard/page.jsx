'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import FileDetails from '@/components/File/FileDetails';
import Header from '@/components/Layout/Header';
import CreateFileButton from '@/components/Repository/CreateFileButton';
import CreateBranchButton from '@/components/Repository/CreateBranchButton';
import BranchSelector from '@/components/Repository/BranchSelector';
import MergeRequestButton from '@/components/Repository/MergeRequestButton';
import MergeRequestsList from '@/components/Repository/MergeRequestsList';
import BranchingGuide from '@/components/Repository/BranchingGuide';
import BranchFlowIndicator from '@/components/Repository/BranchFlowIndicator';

export default function DashboardPage() {
  const [selectedRepoId, setSelectedRepoId] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchRefreshKey, setBranchRefreshKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMergeRequests, setShowMergeRequests] = useState(false);
  const [mrRefreshKey, setMrRefreshKey] = useState(0);

  const handleSelectRepo = (repoId) => {
    console.log(`[Dashboard] Selecting repo ${repoId}`);
    setSelectedRepoId(repoId);
    setSelectedFileId(null);
    // Reset branch when switching repos - will be set by BranchSelector
    setSelectedBranch(null);
    // Trigger branch list refresh for new repo
    setBranchRefreshKey((v) => v + 1);
  };

  const handleSelectFile = (fileId) => {
    setSelectedFileId(fileId);
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const handleVersionUpload = () => {
    setRefreshKey((v) => v + 1);
  };

  const handleBranchChange = (newBranch) => {
    console.log(`[Dashboard] Branch change: '${selectedBranch}' → '${newBranch}'`);
    setSelectedBranch(newBranch);
    // Clear selected file when switching branches to avoid "file not found" errors
    setSelectedFileId(null);
  };

  const handleRepoDeleted = (deletedRepoId, repoName) => {
    console.log(`[Dashboard] Repository '${repoName}' deleted`);
    if (selectedRepoId === deletedRepoId) {
      // Clear selections if deleted repo was selected
      setSelectedRepoId(null);
      setSelectedFileId(null);
      setSelectedBranch(null);
    }
  };

  const handleFileDeleted = (deletedFileId, filename) => {
    console.log(`[Dashboard] File '${filename}' deleted`);
    if (selectedFileId === deletedFileId) {
      // Clear file selection
      setSelectedFileId(null);
    }
    // Trigger refresh to update file list
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
          branch={selectedBranch}
          onRepoDeleted={handleRepoDeleted}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Top Bar with New File Button */}
          {selectedRepoId && (
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Repository Files
                  </span>
                </div>
                
                {/* Branch Controls Section */}
                {selectedRepoId && (
                  <div className="flex items-center gap-2 pl-4 border-l border-zinc-200 dark:border-zinc-700">
                    <BranchSelector
                      repoId={selectedRepoId}
                      currentBranch={selectedBranch}
                      onChange={handleBranchChange}
                      refreshKey={branchRefreshKey}
                    />
                    <CreateBranchButton
                      repoId={selectedRepoId}
                      currentBranch={selectedBranch}
                      onCreated={async (created) => {
                        // Clear selected file first (new branch might not have current file)
                        setSelectedFileId(null);
                        
                        // Refresh branch selector to load the new branch
                        setBranchRefreshKey((v) => v + 1);
                        
                        // Wait a bit longer to ensure backend has fully processed the branch
                        // and BranchSelector has refreshed its list
                        await new Promise(resolve => setTimeout(resolve, 300));
                        
                        // Now switch to the newly created branch
                        setSelectedBranch(created.name);
                      }}
                    />
                    <MergeRequestButton
                      repoId={selectedRepoId}
                      currentBranch={selectedBranch}
                      onCreated={(mr) => {
                        setMrRefreshKey((v) => v + 1);
                        setShowMergeRequests(true);
                      }}
                    />
                    <button
                      onClick={() => setShowMergeRequests(!showMergeRequests)}
                      className="px-3 py-2 text-xs font-medium rounded-xl bg-zinc-600 hover:bg-zinc-700 text-white transition-all flex items-center gap-1.5 shadow-sm hover:shadow"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showMergeRequests ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                      {showMergeRequests ? 'Hide' : 'Show'} MRs
                    </button>
                    <BranchingGuide />
                  </div>
                )}
              </div>
              
              {/* Right side actions */}
              <div className="flex items-center gap-2">
                {/* Branch Flow Indicator */}
                {selectedBranch && (
                  <BranchFlowIndicator 
                    currentBranch={selectedBranch} 
                    isDefault={false} 
                  />
                )}
                <CreateFileButton repoId={selectedRepoId} branch={selectedBranch} />
              </div>
            </div>
          )}

          {/* File Content Area */}
          <div className="flex-1 min-h-0 flex">
            <div className="flex-1 min-h-0 flex flex-col">
              <FileDetails
                key={`${selectedFileId}-${refreshKey}`}
                repoId={selectedRepoId}
                fileId={selectedFileId}
                branch={selectedBranch}
                onVersionUpload={handleVersionUpload}
                onFileDeleted={handleFileDeleted}
              />
            </div>

            {/* Merge Requests Panel */}
            {selectedRepoId && showMergeRequests && (
              <div className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto p-4">
                <MergeRequestsList
                  key={mrRefreshKey}
                  repoId={selectedRepoId}
                  onMergeComplete={() => {
                    setMrRefreshKey((v) => v + 1);
                    setRefreshKey((v) => v + 1);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}