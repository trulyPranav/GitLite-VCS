'use client';

import { useEffect, useState } from 'react';
import { fetchVersions } from '@/lib/api';

export default function FileVersions({ fileId }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fileId) {
      setVersions([]);
      return;
    }
    setLoading(true);
    fetchVersions(fileId).then((data) => {
      setVersions(data);
      setLoading(false);
    });
  }, [fileId]);

  if (!fileId) return <p className="p-4">Select a file to view versions</p>;
  if (loading) return <p className="p-4">Loading versions...</p>;

  if (versions.length === 0)
    return <p className="p-4 text-gray-500">No versions available</p>;

  return (
    <div className="p-4 border-l border-gray-200 h-full flex flex-col">
      <h3 className="font-semibold mb-4">Versions</h3>
      <ul className="overflow-auto flex-1 space-y-2">
        {versions.map((v) => (
          <li key={v.id} className="p-2 border rounded bg-white">
            <div>
              <strong>Version:</strong> {v.version}
            </div>
            <div>
              <small>
                Uploaded by {v.uploader} on {v.uploadedAt}
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
