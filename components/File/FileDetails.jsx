'use client';

import { useEffect, useState } from 'react';
import { fetchVersions, uploadNewVersion } from '@/lib/api';

export default function FileDetails({ fileId, onVersionUpload }) {
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({ version: '', uploader: '', notes: '' });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!fileId) {
      setVersions([]);
      return;
    }
    setIsLoading(true);
    fetchVersions(fileId).then((data) => {
      setVersions(data);
      setIsLoading(false);
    });
  }, [fileId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    const res = await uploadNewVersion(fileId, uploadData);
    setIsUploading(false);
    
    if (res.success) {
      setUploadData({ version: '', uploader: '', notes: '' });
      setShowUploadForm(false);
      onVersionUpload();
    }
  };

  if (!fileId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <svg className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-sm font-medium text-foreground mb-1">No file selected</h3>
          <p className="text-xs text-muted-foreground">Select a file to view versions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Version History</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {versions.length} {versions.length === 1 ? 'version' : 'versions'}
            </p>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Version
          </button>
        </div>
      </div>

      {showUploadForm && (
        <div className="p-4 border-b border-border bg-muted/30">
          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Version Number
              </label>
              <input
                type="text"
                required
                value={uploadData.version}
                onChange={(e) => setUploadData({ ...uploadData, version: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="e.g., 1.2.0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Uploader Name
              </label>
              <input
                type="text"
                required
                value={uploadData.uploader}
                onChange={(e) => setUploadData({ ...uploadData, uploader: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Release Notes (Optional)
              </label>
              <textarea
                value={uploadData.notes}
                onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                placeholder="Describe the changes..."
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 py-2 px-4 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isUploading ? 'Uploading...' : 'Upload Version'}
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-muted-foreground">No versions yet</p>
            <p className="text-xs text-muted-foreground mt-1">Upload the first version to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="p-4 border border-border rounded-lg hover:border-border-hover transition-all bg-background group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">
                          Version {version.version}
                        </h4>
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        by {version.uploader} • {version.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                {version.notes && (
                  <p className="text-sm text-muted-foreground mt-2 pl-13">
                    {version.notes}
                  </p>
                )}
                <div className="flex gap-2 mt-3 pl-13">
                  <button className="text-xs text-accent hover:text-accent-hover font-medium transition-colors">
                    Download
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button className="text-xs text-accent hover:text-accent-hover font-medium transition-colors">
                    Compare
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button className="text-xs text-accent hover:text-accent-hover font-medium transition-colors">
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}