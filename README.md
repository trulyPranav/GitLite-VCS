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
- **Branch Management** - Create, switch, and manage branches effortlessly
- **Merge Requests** - Create and manage merge requests between branches
- **Delete Branches** - Remove branches with safety checks for default branches

### 🌿 Branch System
- **Branch Creation** - Create new branches from any parent branch
- **Branch Selector** - Intuitive dropdown with branch icons and indicators
- **Branch Flow Indicator** - Visual representation of current branch context
- **Branch-Specific Versions** - View file versions filtered by branch
- **Default Branch Protection** - Automatic protection for default branches
- **Branching Guide** - Interactive guide explaining branching workflows

### � Merge & Collaboration
- **Merge Request Creation** - Visual merge direction indicators
- **Conflict Detection** - Automatic conflict detection during merges
- **Merge Request List** - View and manage all pending merge requests
- **Branch History** - Track file versions across branches

### �🔍 Advanced Diff Viewer
- **Unified View** - Traditional git-style diff with line numbers
- **Side-by-Side View** - Split-screen comparison with color-coded changes
- **Compact View** - Shows only changed sections for quick review
- **Statistics** - Track additions, deletions, and modifications
- **Color-Coded Changes** - Green for additions, red for deletions, yellow for modifications
- **No Border Design** - Clean, minimalistic diff presentation
- **Modal Interface** - Full-screen modal for focused comparison

### 📁 Repository Management
- **Create Repositories** - Organize your projects into separate repositories
- **File Explorer** - Intuitive file tree structure with branch context
- **File Upload** - Easy drag-and-drop file uploads with branch support
- **Repository Settings** - Manage repository configurations
- **Sidebar Navigation** - Collapsible sidebar with repository list

### 🎨 User Interface
- **Modern Design** - Clean, minimalistic interface using Tailwind CSS
- **Dark/Light Mode Toggle** - Seamless theme switching with system preference detection
- **Theme Persistence** - Saves theme preference across sessions
- **Responsive Layout** - Mobile-first design that adapts to any screen size
- **Smooth Animations** - Polished transitions and interactions
- **Rounded Corners** - Consistent `rounded-xl` design language
- **Shadow Effects** - Subtle shadows for depth and hierarchy
- **Icon Integration** - Consistent SVG icons throughout the interface

### 🔐 Authentication
- **User Login** - Secure authentication with JWT tokens
- **Token Management** - Access and refresh token handling
- **Auto-Refresh** - Automatic token refresh for seamless experience
- **User Profile** - User avatar with initials, name, and email display
- **Protected Routes** - Client-side route protection

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
│   ├── page.js                   # Landing page with features
│   ├── layout.js                 # Root layout with theme script
│   ├── globals.css               # Global styles & Tailwind
│   ├── login/                    # Authentication pages
│   │   ├── page.jsx              # Login page
│   │   └── LoginForm.jsx         # Login form component
│   └── dashboard/                # Main dashboard
│       └── page.jsx              # Dashboard with file management
│
├── components/                   # React components
│   ├── File/                     # File-related components
│   │   ├── FileDetails.jsx       # File viewer with tabs
│   │   ├── FileVersions.jsx      # Version history list
│   │   ├── DiffViewer.jsx        # Enhanced 3-mode diff viewer
│   │   └── UploadVersionForm.jsx # Version upload with branch support
│   │
│   ├── Repository/               # Repository & Branch components
│   │   ├── FileList.jsx          # File explorer tree
│   │   ├── FileItem.jsx          # Individual file items
│   │   ├── CreateFileButton.jsx  # File creation button
│   │   ├── BranchSelector.jsx    # Branch dropdown selector
│   │   ├── CreateBranchButton.jsx# Branch creation modal
│   │   ├── DeleteBranchButton.jsx# Branch deletion with warnings
│   │   ├── MergeRequestButton.jsx# Merge request creation
│   │   ├── MergeRequestsList.jsx # Merge requests panel
│   │   ├── BranchFlowIndicator.jsx# Current branch indicator
│   │   └── BranchingGuide.jsx    # Interactive branching guide
│   │
│   ├── Sidebar/                  # Navigation components
│   │   ├── Sidebar.jsx           # Collapsible sidebar
│   │   ├── RepoList.jsx          # Repository list
│   │   └── CreateRepoButton.jsx  # Repository creation
│   │
│   └── Layout/                   # Layout components
│       └── Header.jsx            # App header
│
├── lib/                          # Utilities & hooks
│   ├── apiClient.js              # API client with interceptors
│   ├── hooks.js                  # Custom React hooks
│   │                             # - useFiles, useFile, useBranches
│   │                             # - useCurrentUser, useLogout
│   └── auth.js                   # Authentication utilities
│
├── public/                       # Static assets
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.mjs            # PostCSS configuration
├── next.config.mjs               # Next.js configuration
└── jsconfig.json                 # JavaScript configuration
```

### API Integration

GitLite uses a RESTful API backend with comprehensive endpoints. The frontend communicates through `apiClient.js`:

```javascript
import { authAPI, repoAPI, fileAPI, branchesAPI, mergeRequestsAPI } from '@/lib/apiClient';

// Authentication
await authAPI.login({ email, password });
await authAPI.signup({ email, password, full_name });
const user = await authAPI.getCurrentUser();

// Repositories
const repos = await repoAPI.getAll();
await repoAPI.create({ name, description });
await repoAPI.update(repoId, { name, description });
await repoAPI.delete(repoId);

// Files
const files = await fileAPI.list(repoId, { branch });
const file = await fileAPI.getById(repoId, fileId, { branch });
const versions = await fileAPI.getVersions(repoId, fileId);
const diff = await fileAPI.compareVersions(repoId, fileId, v1, v2, 'all');
await fileAPI.create(repoId, fileData, { branch });

// Branches
const branches = await branchesAPI.list(repoId);
await branchesAPI.create(repoId, name, parentBranch);
await branchesAPI.delete(repoId, branchName);
const history = await branchesAPI.getVersionHistory(repoId, branchName);

// Merge Requests
const mergeRequests = await mergeRequestsAPI.list(repoId);
await mergeRequestsAPI.create(repoId, sourceBranch, targetBranch, title, description);
await mergeRequestsAPI.merge(repoId, mergeRequestId, resolution);
```

### Key Components

#### DiffViewer Component

The enhanced diff viewer supports three view modes with comprehensive diff data:

```jsx
<DiffViewer 
  diffData={{
    unified: [...],           // Unified diff format
    side_by_side: {...},      // Side-by-side comparison
    compact: [...],           // Compact diff format
    stats: { additions, deletions, modifications }
  }}
  v1={oldVersion}            // Old version number
  v2={newVersion}            // New version number
  filename={filename}        // File name
  onClose={handleClose}      // Close callback
/>
```

**Features:**
- Three view modes: Unified, Side-by-Side, Compact
- Line numbers in all views
- Color-coded changes (green/red/yellow)
- Statistics footer
- Modal interface with backdrop blur

#### FileVersions Component

Displays version history with compare, download, and branch context:

```jsx
<FileVersions 
  repoId={repoId}
  fileId={fileId}
  filename={filename}
  versions={versions}        // Array of version objects
  onRefresh={refetch}
  branch={currentBranch}     // Current branch context
/>
```

#### BranchSelector Component

Intuitive branch selector with custom styling:

```jsx
<BranchSelector
  repoId={repoId}
  currentBranch={selectedBranch}
  onChange={handleBranchChange}
  refreshKey={branchRefreshKey}
/>
```

**Features:**
- Branch icon on the left
- Dropdown chevron on the right
- Minimum width for longer branch names
- Text truncation with ellipsis
- Default branch indicator

#### Theme Toggle

Dark/light mode toggle with system preference detection:

**Features:**
- Persists across sessions (localStorage)
- Detects system preference on first visit
- Inline script prevents FOUC (Flash of Unstyled Content)
- Moon/sun icon based on current theme
- Instant switching with no page reload

---

## 🎨 Screenshots

### Landing Page
Modern, responsive landing page with:
- Hero section with gradient background
- Feature highlights (Version Control, Branching, Collaboration)
- Call-to-action buttons
- Clean footer with project information

### Dashboard
Intuitive dashboard featuring:
- Collapsible sidebar with repository list
- Branch selector with visual indicators
- File explorer tree with branch context
- Branch management buttons (Create, Merge, Delete)
- Theme toggle in header
- User menu with profile information

### Branch Management
Complete branching system with:
- Branch selector dropdown with icons
- Create branch modal with parent selection
- Merge request creation with visual flow
- Delete branch with safety warnings
- Branch flow indicator showing current context
- Interactive branching guide

### Diff Viewer
Advanced diff comparison with three view modes:
- **Unified**: Traditional git-style diff with line numbers
- **Side-by-Side**: Split-screen comparison with old/new columns
- **Compact**: Shows only changed sections with context
- Statistics footer with addition/deletion counts
- Clean, borderless design for readability

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
- **Tailwind CSS** for styling
  - Utility-first approach
  - Custom color scheme (zinc, indigo)
  - Consistent design tokens (`rounded-xl`, `shadow-sm`)
- **Component patterns**:
  - Buttons: `px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700`
  - Inputs: `border-2 border-zinc-600/30 rounded-xl focus:ring-2`
  - Modals: `rounded-2xl shadow-2xl backdrop-blur-sm`

### Design System

**Colors:**
- Primary: Indigo (600-700)
- Secondary: Zinc (50-950)
- Success: Emerald (600-700)
- Danger: Red (600-700)
- Warning: Yellow (600-700)

**Spacing:**
- Consistent gap values: `gap-2`, `gap-3`, `gap-4`
- Padding: `px-3 py-2` for buttons, `p-4` for containers
- Rounded corners: `rounded-lg` for small, `rounded-xl` for medium, `rounded-2xl` for modals

**Dark Mode:**
- Class-based strategy (`dark:` prefix)
- System preference detection
- LocalStorage persistence
- Inline script prevents FOUC

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
- `POST /auth/login` - User login with JWT tokens
- `POST /auth/signup` - User registration
- `GET /auth/me` - Get current user profile
- `POST /auth/refresh` - Refresh access token

### Repositories
- `GET /repositories` - List all user repositories
- `POST /repositories` - Create a new repository
- `GET /repositories/{id}` - Get repository details
- `PUT /repositories/{id}` - Update repository
- `DELETE /repositories/{id}` - Delete repository

### Files
- `GET /repositories/{repo_id}/files` - List files (with branch filter)
- `GET /repositories/{repo_id}/files/{file_id}` - Get file details
- `POST /repositories/{repo_id}/files` - Upload file to branch
- `GET /repositories/{repo_id}/files/{file_id}/versions` - Get version history
- `GET /repositories/{repo_id}/files/{file_id}/versions/{version}` - Get specific version
- `GET /repositories/{repo_id}/files/{file_id}/diff/{v1}/{v2}?format=all` - Compare versions (unified, side-by-side, compact)

### Branches
- `GET /repositories/{repo_id}/branches` - List all branches
- `POST /repositories/{repo_id}/branches` - Create new branch
- `DELETE /repositories/{repo_id}/branches/{name}` - Delete branch
- `GET /repositories/{repo_id}/branches/{name}/versions` - Get branch version history

### Merge Requests
- `GET /repositories/{repo_id}/merge-requests` - List merge requests
- `POST /repositories/{repo_id}/merge-requests` - Create merge request
- `GET /repositories/{repo_id}/merge-requests/{id}` - Get merge request details
- `POST /repositories/{repo_id}/merge-requests/{id}/merge` - Execute merge
- `DELETE /repositories/{repo_id}/merge-requests/{id}` - Delete merge request

---

## 🐛 Known Issues

- None currently reported

## 🗺️ Roadmap

### Completed ✅
- [x] Branch support with creation and deletion
- [x] Merge functionality with merge requests
- [x] Conflict detection during merges
- [x] Advanced diff viewer (3 modes)
- [x] Dark/light mode toggle (currently based on system theme)
- [x] Branch flow indicators
- [x] Interactive branching guide
- [x] Responsive UI with minimalistic design
- [x] File version management per branch
- [x] User authentication with JWT

### In Progress 🚧
- [ ] Conflict resolution UI
- [ ] File annotations and comments
- [ ] Advanced search and filtering

### Planned 📋
- [ ] Multi-user collaboration features
- [ ] Real-time updates with WebSockets
- [ ] Activity timeline and audit logs
- [ ] Email notifications for merge requests
- [ ] API rate limiting
- [ ] Two-factor authentication (2FA)
- [ ] Repository statistics and insights
- [ ] Code review functionality
- [ ] Blame view (git blame equivalent)
- [ ] Cherry-pick functionality

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Pranav** - *Repository and Versions* - [@trulyPranav](https://github.com/trulyPranav)
- **Rigzin** - *Auth SetUps* - [@Rigzin00](https://github.com/Rigzin00)
- **Aswin** - *Branchings and Mergings*

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS approach
- React team for the powerful UI library
- All contributors who help improve this project

---

<div align="center">

**Made with ❤️ by developers, for developers**

⭐ Star this repo if you find it helpful!

</div>
