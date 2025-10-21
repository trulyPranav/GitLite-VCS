'use client';

import { useState, useEffect } from 'react';

/**
 * FileViewer Component
 * Displays file content with syntax highlighting and line numbers
 */
export default function FileViewer({ content, filename, language }) {
  const [displayContent, setDisplayContent] = useState('');
  const [fileType, setFileType] = useState('text');

  useEffect(() => {
    if (content) {
      setDisplayContent(content);
      detectFileType(filename);
    }
  }, [content, filename]);

  const detectFileType = (filename) => {
    if (!filename) return;
    
    const ext = filename.split('.').pop()?.toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];
    const codeExts = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'rb'];
    const markdownExts = ['md', 'markdown'];
    
    if (imageExts.includes(ext)) {
      setFileType('image');
    } else if (codeExts.includes(ext)) {
      setFileType('code');
    } else if (markdownExts.includes(ext)) {
      setFileType('markdown');
    } else {
      setFileType('text');
    }
  };

  const getLanguageFromFilename = (filename) => {
    if (!filename) return 'text';
    const ext = filename.split('.').pop()?.toLowerCase();
    
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby',
      'json': 'json',
      'xml': 'xml',
      'html': 'html',
      'css': 'css',
      'md': 'markdown',
    };
    
    return languageMap[ext] || 'text';
  };

  if (!content) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 p-8">
        <div className="text-center">
          <svg className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">No content to display</p>
        </div>
      </div>
    );
  }

  if (fileType === 'image') {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 p-8">
        <div className="max-w-full max-h-full">
          <img 
            src={content} 
            alt={filename} 
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    );
  }

  const lines = displayContent.split('\n');
  const detectedLanguage = language || getLanguageFromFilename(filename);

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900 min-h-0">
      <div className="min-w-full">
        <div className="flex">
          {/* Line Numbers */}
          <div className="sticky left-0 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 select-none px-4 py-4">
            {lines.map((_, index) => (
              <div
                key={index}
                className="text-xs text-zinc-400 dark:text-zinc-600 text-right leading-6 font-mono"
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code Content */}
          <div className="flex-1 px-4 py-4">
            <pre className="text-sm leading-6 font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre">
              {lines.map((line, index) => (
                <div key={index} className="min-h-6">
                  <code className={`language-${detectedLanguage}`}>
                    {line || '\n'}
                  </code>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>

      {/* Language Badge */}
      {detectedLanguage !== 'text' && (
        <div className="sticky bottom-4 right-4 float-right">
          <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full shadow-sm">
            {detectedLanguage}
          </span>
        </div>
      )}
    </div>
  );
}
