'use client';

import { useState } from 'react';
import { uploadNewVersion } from '@/lib/api';

export default function UploadVersionForm({ fileId, onUploadSuccess }) {
  const [version, setVersion] = useState('');
  const [uploader, setUploader] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!fileId) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!version || !uploader) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    const res = await uploadNewVersion(fileId, { version, uploader });
    setLoading(false);

    if (res.success) {
      setVersion('');
      setUploader('');
      onUploadSuccess();
    } else {
      setError('Failed to upload version');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <h4 className="font-semibold mb-2">Upload New Version</h4>
      <div className="mb-2">
        <label className="block mb-1 text-sm font-medium">Version</label>
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
          placeholder="e.g. 1.2"
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 text-sm font-medium">Uploader</label>
        <input
          type="text"
          value={uploader}
          onChange={(e) => setUploader(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
          placeholder="Your name"
        />
      </div>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}
