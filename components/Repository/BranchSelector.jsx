 'use client';

import { useEffect, useState, useRef } from 'react';
import { branchesAPI } from '@/lib/apiClient';
import DeleteBranchButton from './DeleteBranchButton';

export default function BranchSelector({ repoId, currentBranch, onChange, refreshKey }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lastValidatedBranch = useRef(null);
  const lastRepoId = useRef(null);

  useEffect(() => {
    if (!repoId) return;
    
    // Reset validation tracking when repo changes
    if (lastRepoId.current !== repoId) {
      console.log(`[BranchSelector] Repo changed from ${lastRepoId.current} to ${repoId}, resetting validation`);
      lastValidatedBranch.current = null;
      lastRepoId.current = repoId;
    }
    
    let mounted = true;
    setLoading(true);
    
    console.log(`[BranchSelector] Loading branches for repo ${repoId}, refreshKey: ${refreshKey}, currentBranch: ${currentBranch}`);
    
    branchesAPI.list(repoId)
      .then((data) => {
        if (!mounted) return;
        console.log(`[BranchSelector] Loaded ${data?.length || 0} branches:`, data?.map(b => b.name).join(', '));
        
        setBranches(data || []);
        setError('');
        
        // If no branch is selected and branches exist, auto-select default or first branch
        if (data && data.length > 0 && !currentBranch) {
          const defaultBranch = data.find(b => b.is_default);
          const autoSelectBranch = defaultBranch || data[0];
          
          if (onChange && autoSelectBranch) {
            console.log(`[BranchSelector] Auto-selecting branch '${autoSelectBranch.name}'`);
            onChange(autoSelectBranch.name);
            lastValidatedBranch.current = autoSelectBranch.name;
            return; // Exit early, no need to validate further
          }
        }
        
        // Validate current branch exists ONLY after branches are loaded
        // and only if we haven't validated this branch yet
        if (data && data.length > 0 && currentBranch && lastValidatedBranch.current !== currentBranch) {
          const branchExists = data.some(b => b.name === currentBranch);
          
          if (!branchExists) {
            // Current branch doesn't exist, switch to default or first branch
            const defaultBranch = data.find(b => b.is_default);
            const fallbackBranch = defaultBranch || data[0];
            
            if (onChange && fallbackBranch) {
              console.warn(`[BranchSelector] Branch '${currentBranch}' not found in loaded branches, switching to '${fallbackBranch.name}'`);
              onChange(fallbackBranch.name);
              lastValidatedBranch.current = fallbackBranch.name;
            }
          } else {
            // Branch exists, mark as validated
            console.log(`[BranchSelector] Branch '${currentBranch}' validated successfully`);
            lastValidatedBranch.current = currentBranch;
          }
        }
      })
      .catch((err) => {
        console.error('[BranchSelector] Failed to load branches', err);
        if (mounted) setError('Failed to load branches');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [repoId, refreshKey, currentBranch]);

  const handleBranchDeleted = (deletedBranchName) => {
    console.log(`[BranchSelector] Branch '${deletedBranchName}' deleted, switching to default branch`);
    
    // Remove from local state
    const remainingBranches = branches.filter(b => b.name !== deletedBranchName);
    setBranches(remainingBranches);
    
    // If deleted branch was selected, switch to default or first available
    if (currentBranch === deletedBranchName) {
      const defaultBranch = remainingBranches.find(b => b.is_default);
      const fallbackBranch = defaultBranch || remainingBranches[0];
      
      if (onChange && fallbackBranch) {
        onChange(fallbackBranch.name);
      }
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <label className="sr-only">Branch</label>
      <select
        value={
          // Only show currentBranch if it exists in branches list
          branches.some(b => b.name === currentBranch) ? currentBranch : 
          branches.find(b => b.is_default)?.name || 
          branches[0]?.name || 
          ''
        }
        onChange={(e) => onChange && onChange(e.target.value)}
        className="px-2 py-1 text-sm border rounded-md bg-white dark:bg-zinc-800"
        disabled={loading}
      >
        {branches.map((b) => (
          <option key={b.id} value={b.name}>
            {b.name} {b.is_default ? '(default)' : ''}
          </option>
        ))}
        {branches.length === 0 && !loading && <option value="">main</option>}
      </select>
      
      {currentBranch && (
        <DeleteBranchButton
          repoId={repoId}
          branchName={currentBranch}
          isDefault={branches.find(b => b.name === currentBranch)?.is_default}
          onDeleted={handleBranchDeleted}
        />
      )}
    </div>
  );
}
