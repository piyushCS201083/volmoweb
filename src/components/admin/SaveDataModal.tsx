/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  CloudUpload,
  GitBranch,
  Github,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Loader2,
  X,
  FileCheck,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
  Server,
  RefreshCw,
  Cloud,
} from "lucide-react";
import {
  getStoredGitHubAuth,
  saveGitHubAuth,
  clearStoredGitHubAuth,
  verifyGitHubPermission,
  findBase64Images,
  syncAllDataToGitHubAndBackend,
  SyncProgressUpdate,
  SyncResult,
  DEFAULT_REPO,
  DEFAULT_BRANCH,
} from "../../services/githubSync";
import { api } from "../../services/api";

interface SaveDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullConfig: any;
  onSuccessToast?: (msg: string) => void;
}

export default function SaveDataModal({
  isOpen,
  onClose,
  fullConfig,
  onSuccessToast,
}: SaveDataModalProps) {
  // Auth state
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState(DEFAULT_REPO);
  const [branch, setBranch] = useState(DEFAULT_BRANCH);
  const [showToken, setShowToken] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [verifyingAuth, setVerifyingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync execution state
  const [commitMessage, setCommitMessage] = useState(
    "CMS Update: Save site configuration and custom images [Volmo Admin]"
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgressUpdate | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [activeTab, setActiveTab] = useState<"save" | "settings">("save");

  // Detected images count
  const [detectedImages, setDetectedImages] = useState<number>(0);

  // On open, check stored auth and count images
  useEffect(() => {
    if (!isOpen) {
      setSyncProgress(null);
      setSyncResult(null);
      return;
    }

    const stored = getStoredGitHubAuth();
    if (stored && stored.token) {
      setToken(stored.token);
      setRepo(stored.repo || DEFAULT_REPO);
      setBranch(stored.branch || DEFAULT_BRANCH);
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    // Count uploaded base64 images
    try {
      const images = findBase64Images(fullConfig);
      setDetectedImages(images.length);
    } catch (e) {
      setDetectedImages(0);
    }
  }, [isOpen, fullConfig]);

  if (!isOpen) return null;

  // Verify and save token
  const handleVerifyAndGrant = async () => {
    if (!token.trim()) {
      setAuthError("Please enter your GitHub Personal Access Token.");
      return;
    }

    setVerifyingAuth(true);
    setAuthError(null);

    const check = await verifyGitHubPermission(token.trim(), repo.trim());
    setVerifyingAuth(false);

    if (check.valid) {
      saveGitHubAuth({
        token: token.trim(),
        repo: repo.trim(),
        branch: branch.trim(),
      });
      setIsAuthorized(true);
      setActiveTab("save");
    } else {
      setAuthError(
        check.error ||
          "Could not verify repository access. Ensure token has 'repo' scope and repository name is correct."
      );
    }
  };

  // Disconnect GitHub permission
  const handleRevokePermission = () => {
    clearStoredGitHubAuth();
    setToken("");
    setIsAuthorized(false);
    setActiveTab("settings");
  };

  // Execute full sync
  const handleExecuteSync = async () => {
    if (!isAuthorized) {
      setActiveTab("settings");
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);
    setSyncProgress({
      step: "init",
      message: "Starting source code synchronization...",
      progressPercent: 5,
    });

    const result = await syncAllDataToGitHubAndBackend(
      fullConfig,
      { token: token.trim(), repo: repo.trim(), branch: branch.trim() },
      commitMessage.trim() || "CMS: Save site data and images [Volmo Admin]",
      (progress) => {
        setSyncProgress(progress);
      }
    );

    setIsSyncing(false);
    setSyncResult(result);

    if (result.success) {
      onSuccessToast?.("✓ Data and images permanently saved to GitHub source code & backend server!");
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <CloudUpload size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Save Data &amp; Sync to Source Code
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Permanent persistence on GitHub repository &amp; Render backend server
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSyncing}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          {/* Target Status Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2">
              <Github size={15} className="text-white flex-shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                  GitHub Repo:
                </span>
                <span className="font-bold text-slate-200 truncate block text-[11px]">
                  {repo} <span className="text-orange-400">({branch})</span>
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2">
              <Cloud size={15} className="text-blue-400 flex-shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                  Cloud Database &amp; CDN:
                </span>
                <span className="font-bold text-blue-300 truncate block text-[11px]">
                  Cloudinary (oz1mkn2s)
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2">
              <Server size={15} className="text-emerald-400 flex-shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                  Backend API:
                </span>
                <span className="font-bold text-emerald-300 truncate block text-[11px]">
                  {api.getBaseUrl() || "volmoweb-2"}
                </span>
              </div>
            </div>
          </div>

          {/* If synchronization completed successfully */}
          {syncResult && syncResult.success ? (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-300">
                    Saved &amp; Committed to Source Code!
                  </h3>
                  <p className="text-xs text-slate-300">
                    Your changes, specs, and uploaded images are now committed directly into the
                    GitHub repository and live on the Render backend server.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Uploaded Images Saved:</span>
                  <span className="font-bold text-orange-400">
                    {syncResult.uploadedImagesCount} photos
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Files Committed to GitHub:</span>
                  <span className="font-bold text-emerald-400">
                    {syncResult.filesCommitted.length} files
                  </span>
                </div>
                {syncResult.commitSha && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Commit SHA:</span>
                    <span className="text-slate-400">{syncResult.commitSha.substring(0, 7)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {syncResult.commitUrl && (
                  <a
                    href={syncResult.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono rounded-xl transition-all"
                  >
                    <ExternalLink size={13} />
                    View Commit on GitHub
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSyncResult(null)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition-all"
                >
                  Save Another Update
                </button>
              </div>
            </div>
          ) : isSyncing ? (
            /* Active Syncing State */
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-2">
                  <Loader2 size={16} className="text-orange-400 animate-spin" />
                  {syncProgress?.message || "Syncing in progress..."}
                </span>
                <span className="text-orange-400 font-bold">
                  {syncProgress?.progressPercent || 10}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${syncProgress?.progressPercent || 10}%` }}
                />
              </div>

              {syncProgress?.detail && (
                <p className="text-xs text-slate-400 font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {syncProgress.detail}
                </p>
              )}
            </div>
          ) : (
            /* Main Form / Setup View */
            <div className="space-y-5">
              {/* Permission Status Box */}
              {!isAuthorized ? (
                <div className="bg-amber-950/20 border border-amber-600/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        GitHub Permission Required
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        To replace the edits in the source code on GitHub and store uploaded images
                        forever, provide a GitHub Personal Access Token (PAT) with{" "}
                        <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">
                          repo
                        </code>{" "}
                        scope.
                      </p>
                    </div>
                  </div>

                  {/* Token Configuration Inputs */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-300 font-mono">
                          GitHub Personal Access Token:
                        </label>
                        <a
                          href="https://github.com/settings/tokens/new?scopes=repo&description=Volmo+Admin+CMS+Sync"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono underline"
                        >
                          Generate Token (1-click) <ExternalLink size={10} />
                        </a>
                      </div>
                      <div className="relative">
                        <input
                          type={showToken ? "text" : "password"}
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-orange-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken(!showToken)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                        >
                          {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">
                        Saved in your browser&apos;s encrypted local storage. Never shared with third parties.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 font-mono block mb-1">
                          Repository (owner/repo):
                        </label>
                        <input
                          type="text"
                          value={repo}
                          onChange={(e) => setRepo(e.target.value)}
                          placeholder="piyushCS201083/volmo"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 font-mono block mb-1">
                          Target Branch:
                        </label>
                        <input
                          type="text"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          placeholder="main"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {authError && (
                      <p className="text-xs text-red-400 font-mono bg-red-950/40 p-2.5 rounded-lg border border-red-900/50">
                        {authError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleVerifyAndGrant}
                      disabled={verifyingAuth}
                      className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {verifyingAuth ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Verifying Access...
                        </>
                      ) : (
                        <>
                          <KeyRound size={14} /> Grant Permission &amp; Save Credentials
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Authorized Banner */
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-300 font-mono">
                        GitHub Permission Granted
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Connected to <span className="text-white">{repo}</span> (branch:{" "}
                        <span className="text-orange-400">{branch}</span>)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRevokePermission}
                    className="text-xs text-slate-400 hover:text-red-400 font-mono underline"
                  >
                    Change / Revoke
                  </button>
                </div>
              )}

              {/* Data & Image Summary */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Synchronization Scope:
                  </span>
                  <span className="text-slate-300">Live CMS Snapshot</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="flex items-center gap-2">
                    <FileCheck size={14} className="text-emerald-400" />
                    <span>Models &amp; Specs: All Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck size={14} className="text-emerald-400" />
                    <span>Branding &amp; Contact: Updated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck size={14} className="text-emerald-400" />
                    <span>Batteries &amp; Chargers: All</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImageIcon size={14} className="text-orange-400" />
                    <span>
                      Uploaded Photos:{" "}
                      <strong className="text-orange-400">{detectedImages}</strong>
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  💡 <strong>How it works:</strong> Any custom images uploaded in the CMS will be
                  saved as image files to the backend server and committed into{" "}
                  <code className="text-orange-300">public/uploads/</code> in the GitHub source code.
                  This ensures that the next time anyone visits the website, all images load
                  permanently forever!
                </p>
              </div>

              {/* Commit Message */}
              <div>
                <label className="text-xs font-bold text-slate-300 font-mono block mb-1">
                  GitHub Commit Message:
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              {syncResult && !syncResult.success && (
                <div className="bg-red-950/40 border border-red-900/60 rounded-xl p-3 text-xs text-red-300 font-mono">
                  <strong>Sync Error:</strong> {syncResult.error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isSyncing}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            Close
          </button>

          {!syncResult?.success && (
            <button
              type="button"
              onClick={handleExecuteSync}
              disabled={isSyncing || !isAuthorized}
              className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs font-mono rounded-xl shadow-lg shadow-orange-950/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSyncing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving &amp; Committing...
                </>
              ) : (
                <>
                  <CloudUpload size={14} />
                  Save Data &amp; Commit to Source Code
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
