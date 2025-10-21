const repos = [
  { id: 'r1', name: 'awesome-project' },
  { id: 'r2', name: 'nextjs-app' },
];

const files = {
  r1: [
    { id: 'f1', name: 'README.md' },
    { id: 'f2', name: 'index.js' },
  ],
  r2: [
    { id: 'f3', name: 'app.jsx' },
    { id: 'f4', name: 'styles.css' },
  ],
};

const versions = {
  f1: [
    { id: 'v1', version: '1.0', uploadedAt: '2023-10-20', uploader: 'Alice' },
    { id: 'v2', version: '1.1', uploadedAt: '2023-10-22', uploader: 'Bob' },
  ],
  f2: [
    { id: 'v3', version: '1.0', uploadedAt: '2023-10-21', uploader: 'Alice' },
  ],
  f3: [
    { id: 'v4', version: '0.1', uploadedAt: '2023-10-18', uploader: 'Charlie' },
  ],
  f4: [
    { id: 'v5', version: '2.0', uploadedAt: '2023-10-19', uploader: 'Alice' },
  ],
};

export async function fetchRepos() {
  return new Promise((res) => setTimeout(() => res(repos), 300));
}

export async function fetchFiles(repoId) {
  return new Promise((res) => setTimeout(() => res(files[repoId] || []), 300));
}

export async function fetchVersions(fileId) {
  return new Promise((res) => setTimeout(() => res(versions[fileId] || []), 300));
}

export async function uploadNewVersion(fileId, newVersion) {
  // Just simulating
  versions[fileId] = versions[fileId] || [];
  versions[fileId].push({
    id: `v${Date.now()}`,
    version: newVersion.version,
    uploadedAt: new Date().toISOString().slice(0, 10),
    uploader: newVersion.uploader,
  });
  return new Promise((res) => setTimeout(() => res({ success: true }), 300));
}
