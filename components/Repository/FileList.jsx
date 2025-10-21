'use client';

import { useEffect, useState } from 'react';
import { fetchFiles } from '@/lib/api';
import FileItem from './FileItem';

export default function FileList({ repoId, selectedFileId, onSelectFile }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!repoId) {
      setFiles([]);
      return;
    }
    fetchFiles(repoId).then(setFiles);
  }, [repoId]);

  if (!repoId) return <p className="p-4">Select a repository</p>;

  return (
    <div className="border-l border-gray-200 p-4 flex flex-col h-full">
      <h3 className="font-semibold mb-4">Files</h3>
      <ul className="overflow-auto space-y-2 flex-1">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            isSelected={file.id === selectedFileId}
            onSelect={() => onSelectFile(file.id)}
          />
        ))}
      </ul>
    </div>
  );
}
