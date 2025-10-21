import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">GitLite</span>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
          >
            Log In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-8">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Lightweight Version Control System
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 leading-tight">
              Simple, Powerful
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">Version Control</span>
            </h1>
            
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Manage your project files with ease. Track changes, compare versions, 
              and collaborate seamlessly with GitLite's intuitive interface.
            </p>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/login"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-base font-semibold transition shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-base font-semibold transition border border-zinc-200 dark:border-zinc-700"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Version Tracking
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Keep track of every change to your files with detailed version history and commit messages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Advanced Diff Viewer
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Compare versions with unified, side-by-side, and compact diff views with syntax highlighting.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Repository Management
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Organize your projects into repositories with intuitive file and folder structures.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to streamline your workflow?
            </h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Join developers who trust GitLite for their version control needs.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-lg text-base font-semibold hover:bg-indigo-50 transition shadow-xl"
            >
              Start Using GitLite
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 px-6 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">GitLite</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © 2025 GitLite VCS. A lightweight version control system for modern developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
