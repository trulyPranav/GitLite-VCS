# 📁 GitLite VCS

<div align="center">

![GitLite Banner](https://img.shields.io/badge/GitLite-Version%20Control-6366f1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)

**A lightweight, intuitive version control system for modern developers**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Screenshots](#-screenshots) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

GitLite VCS is a streamlined version control system designed to make file management and collaboration effortless. With an intuitive web interface built on Next.js and React, GitLite provides powerful version tracking capabilities without the complexity of traditional VCS tools.

### Why GitLite?

- 🎯 **Simple & Intuitive** - Clean UI/UX that anyone can use
- 🚀 **Lightweight** - Fast and efficient with minimal overhead
- 🔍 **Advanced Diff Viewer** - Multiple view modes (Unified, Side-by-Side, Compact)
- 📦 **Repository Management** - Organize projects with ease
- 🌙 **Dark Mode** - Full support for light and dark themes
- 📱 **Responsive Design** - Works seamlessly on all devices

---

## ✨ Features

### 🔄 Version Control
- **File History Tracking** - Keep track of every change with detailed version history
- **Commit Messages** - Annotate changes with descriptive commit messages
- **Version Comparison** - Compare any two versions with advanced diff algorithms
- **Download Versions** - Download any previous version of your files

### 🔍 Advanced Diff Viewer
- **Unified View** - Traditional git-style diff with line numbers
- **Side-by-Side View** - Split-screen comparison with color-coded changes
- **Compact View** - Shows only changed sections for quick review
- **Statistics** - Track additions, deletions, and modifications
- **Color-Coded Changes** - Green for additions, red for deletions, yellow for modifications

### 📁 Repository Management
- **Create Repositories** - Organize your projects into separate repositories
- **File Explorer** - Intuitive file tree structure
- **File Upload** - Easy drag-and-drop file uploads
- **Repository Settings** - Manage repository configurations

### 🎨 User Interface
- **Modern Design** - Clean, minimalistic interface using Tailwind CSS
- **Dark Mode** - Seamless dark/light theme switching
- **Responsive Layout** - Mobile-first design that adapts to any screen size
- **Smooth Animations** - Polished transitions and interactions

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Backend API** running (see backend setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/trulyPranav/GitLite-VCS.git
   cd GitLite-VCS
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentation

### Project Structure

```
gitlite-vcs/
├── app/                          # Next.js App Router
│   ├── page.js                   # Landing page
│   ├── login/                    # Authentication pages
│   ├── dashboard/                # Main dashboard
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── File/                     # File-related components
│   │   ├── FileDetails.jsx       # File viewer & history
│   │   ├── FileVersions.jsx      # Version list
│   │   ├── DiffViewer.jsx        # Enhanced diff viewer
│   │   └── UploadVersionForm.jsx # Version upload form
│   ├── Repository/               # Repository components
│   │   ├── FileList.jsx          # File explorer
│   │   └── FileItem.jsx          # File tree items
│   ├── Sidebar/                  # Navigation components
│   │   ├── Sidebar.jsx           # Main sidebar
│   │   ├── RepoList.jsx          # Repository list
│   │   └── CreateRepoButton.jsx  # Create repo button
│   └── Layout/                   # Layout components
│       └── Header.jsx            # App header
├── lib/                          # Utilities & hooks
│   ├── apiClient.js              # API client configuration
│   ├── hooks.js                  # Custom React hooks
│   └── auth.js                   # Authentication utilities
└── public/                       # Static assets
```

### API Integration

GitLite uses a RESTful API backend. The frontend communicates with the backend through the `apiClient.js`:

```javascript
import { authAPI, repoAPI, fileAPI } from '@/lib/apiClient';

// Authentication
await authAPI.login({ email, password });

// Repositories
const repos = await repoAPI.getAll();
await repoAPI.create({ name, description });

// Files
const file = await fileAPI.getById(repoId, fileId);
const versions = await fileAPI.getVersions(repoId, fileId);
const diff = await fileAPI.compareVersions(repoId, fileId, v1, v2);
```

### Key Components

#### DiffViewer Component

The enhanced diff viewer supports multiple view modes:

```jsx
<DiffViewer 
  diffData={diffData}        // API response with diff, side_by_side, compact
  v1={oldVersion}            // Old version number
  v2={newVersion}            // New version number
  filename={filename}        // File name
  onClose={handleClose}      // Close callback
/>
```

#### FileVersions Component

Displays version history with compare and download actions:

```jsx
<FileVersions 
  repoId={repoId}
  fileId={fileId}
  filename={filename}
  versions={versions}        // Array of version objects
  onRefresh={refetch}
/>
```

---

## 🎨 Screenshots

### Landing Page
Modern, responsive landing page with feature highlights and call-to-action buttons.

### Dashboard
Intuitive dashboard with sidebar navigation, file explorer, and file viewer.

### Diff Viewer
Advanced diff comparison with three view modes:
- **Unified**: Traditional git-style diff
- **Side-by-Side**: Split-screen comparison
- **Compact**: Shows only changed sections

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[PostCSS](https://postcss.org/)** - CSS processing

### Backend (Separate Repository)
- **Python** with FastAPI
- **PostgreSQL** for data storage
- **Enhanced diffing algorithms** (difflib.SequenceMatcher)

---

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8000` |

### Code Style

- **ESLint** for code linting
- **Prettier** for code formatting (recommended)
- **Tailwind CSS** for styling (no custom CSS files)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Use TypeScript when possible
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Repositories
- `GET /repositories` - List all repositories
- `POST /repositories` - Create a new repository
- `GET /repositories/{id}` - Get repository details
- `PUT /repositories/{id}` - Update repository
- `DELETE /repositories/{id}` - Delete repository

### Files
- `GET /repositories/{repo_id}/files` - List files in repository
- `GET /repositories/{repo_id}/files/{file_id}` - Get file details
- `POST /repositories/{repo_id}/files` - Upload file
- `GET /repositories/{repo_id}/files/{file_id}/versions` - Get version history
- `GET /repositories/{repo_id}/files/{file_id}/versions/{version}` - Get specific version
- `GET /repositories/{repo_id}/files/{file_id}/diff/{v1}/{v2}` - Compare versions

---

## 🐛 Known Issues

- None currently reported

## 🗺️ Roadmap

- [ ] Multi-user collaboration
- [ ] Branch support
- [ ] Merge functionality
- [ ] Conflict resolution
- [ ] File annotations
- [ ] Advanced search
- [ ] Activity timeline
- [ ] Email notifications
- [ ] API rate limiting
- [ ] Two-factor authentication

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Pranav** - *Initial work* - [@trulyPranav](https://github.com/trulyPranav)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS approach
- React team for the powerful UI library
- All contributors who help improve this project

---

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@gitlite.dev
- 🐛 [Issue Tracker](https://github.com/trulyPranav/GitLite-VCS/issues)
- 💬 [Discussions](https://github.com/trulyPranav/GitLite-VCS/discussions)

---

<div align="center">

**Made with ❤️ by developers, for developers**

⭐ Star this repo if you find it helpful!

</div>