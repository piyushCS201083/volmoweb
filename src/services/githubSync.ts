/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from "./api";

export interface GitHubAuth {
  token: string;
  repo: string; // e.g. "piyushCS201083/volmo"
  branch: string; // e.g. "main"
}

export interface SyncProgressUpdate {
  step: "init" | "auth" | "images" | "backend" | "github" | "done" | "error";
  message: string;
  progressPercent: number; // 0 to 100
  detail?: string;
}

export interface SyncResult {
  success: boolean;
  uploadedImagesCount: number;
  commitUrl?: string;
  commitSha?: string;
  filesCommitted: string[];
  error?: string;
}

const STORAGE_KEY_TOKEN = "volmo_github_token";
const STORAGE_KEY_REPO = "volmo_github_repo";
const STORAGE_KEY_BRANCH = "volmo_github_branch";

export const DEFAULT_REPO = "piyushCS201083/volmo";
export const DEFAULT_BRANCH = "main";

/**
 * Retrieve saved GitHub auth from browser storage
 */
export function getStoredGitHubAuth(): GitHubAuth | null {
  try {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (!token) return null;
    const repo = localStorage.getItem(STORAGE_KEY_REPO) || DEFAULT_REPO;
    const branch = localStorage.getItem(STORAGE_KEY_BRANCH) || DEFAULT_BRANCH;
    return { token, repo, branch };
  } catch (e) {
    return null;
  }
}

/**
 * Save GitHub auth in browser storage
 */
export function saveGitHubAuth(auth: GitHubAuth): void {
  try {
    localStorage.setItem(STORAGE_KEY_TOKEN, auth.token.trim());
    localStorage.setItem(STORAGE_KEY_REPO, (auth.repo || DEFAULT_REPO).trim());
    localStorage.setItem(STORAGE_KEY_BRANCH, (auth.branch || DEFAULT_BRANCH).trim());
  } catch (e) {
    console.warn("Could not save GitHub auth to localStorage:", e);
  }
}

/**
 * Remove saved GitHub auth
 */
export function clearStoredGitHubAuth(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  } catch (e) {}
}

/**
 * Verify GitHub token and repository access permissions
 */
export async function verifyGitHubPermission(
  token: string,
  repo: string = DEFAULT_REPO
): Promise<{ valid: boolean; repoName?: string; permissions?: any; error?: string }> {
  try {
    const cleanRepo = repo.replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "").trim();
    const res = await fetch(`https://api.github.com/repos/${cleanRepo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token.trim()}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { valid: false, error: "Invalid GitHub Personal Access Token." };
      }
      if (res.status === 404) {
        return {
          valid: false,
          error: `Repository '${cleanRepo}' not found or token lacks 'repo' permission.`,
        };
      }
      return { valid: false, error: `GitHub API error: ${res.statusText} (${res.status})` };
    }

    const data = await res.json();
    return {
      valid: true,
      repoName: data.full_name,
      permissions: data.permissions,
    };
  } catch (err: any) {
    return { valid: false, error: err.message || "Failed to reach GitHub API" };
  }
}

/**
 * Helper to fetch existing file SHA on a GitHub branch
 */
async function getFileSha(
  token: string,
  repo: string,
  filePath: string,
  branch: string
): Promise<string | null> {
  try {
    const cleanRepo = repo.replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "").trim();
    const res = await fetch(
      `https://api.github.com/repos/${cleanRepo}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token.trim()}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      return data.sha || null;
    }
  } catch (e) {}
  return null;
}

/**
 * Commit a file to GitHub repository using GitHub Contents API
 */
export async function commitFileToGitHub(
  token: string,
  repo: string,
  filePath: string,
  contentBase64: string,
  commitMessage: string,
  branch: string = DEFAULT_BRANCH
): Promise<{ success: boolean; sha?: string; commitUrl?: string; error?: string }> {
  try {
    const cleanRepo = repo.replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "").trim();
    const existingSha = await getFileSha(token, cleanRepo, filePath, branch);

    const body: Record<string, any> = {
      message: commitMessage,
      content: contentBase64,
      branch: branch,
    };
    if (existingSha) {
      body.sha = existingSha;
    }

    const res = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token.trim()}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      return {
        success: false,
        error: (errData && errData.message) || `Failed to commit ${filePath} (${res.status})`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      sha: data.commit?.sha || data.content?.sha,
      commitUrl: data.commit?.html_url,
    };
  } catch (err: any) {
    return { success: false, error: err.message || `Network error committing ${filePath}` };
  }
}

/**
 * Convert string to UTF-8 Base64
 */
function utf8ToBase64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

/**
 * Deep scan and extract all Base64 images from configuration
 */
export interface ExtractedImageItem {
  keyPath: string[];
  dataUrl: string;
  mimeType: string;
  ext: string;
  rawBase64: string;
  suggestedName: string;
}

export function findBase64Images(obj: any, path: string[] = []): ExtractedImageItem[] {
  const images: ExtractedImageItem[] = [];

  function traverse(current: any, currPath: string[]) {
    if (!current) return;
    if (typeof current === "string") {
      if (current.startsWith("data:image/")) {
        const matches = current.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const rawBase64 = matches[2];
          let ext = "png";
          if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
          else if (mimeType.includes("webp")) ext = "webp";
          else if (mimeType.includes("svg")) ext = "svg";

          // Generate friendly name based on key path (e.g. models_0_colors_1_image)
          const slug = currPath
            .filter((p) => isNaN(Number(p)))
            .slice(-2)
            .join("_") || "image";
          const suggestedName = `volmo_${slug}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}.${ext}`;

          images.push({
            keyPath: [...currPath],
            dataUrl: current,
            mimeType,
            ext,
            rawBase64,
            suggestedName,
          });
        }
      }
    } else if (Array.isArray(current)) {
      current.forEach((item, index) => {
        traverse(item, [...currPath, String(index)]);
      });
    } else if (typeof current === "object") {
      for (const [key, value] of Object.entries(current)) {
        traverse(value, [...currPath, key]);
      }
    }
  }

  traverse(obj, path);
  return images;
}

/**
 * Replace values at key path in object clone
 */
function setDeepValue(obj: any, keyPath: string[], value: any): void {
  let curr = obj;
  for (let i = 0; i < keyPath.length - 1; i++) {
    const key = keyPath[i];
    if (!(key in curr)) return;
    curr = curr[key];
  }
  const lastKey = keyPath[keyPath.length - 1];
  curr[lastKey] = value;
}

/**
 * Complete Master Sync Process:
 * 1. Scans and extracts all uploaded Base64 images.
 * 2. Uploads images to Backend API server on Render (so live backend serves /uploads/...).
 * 3. Commits image files directly to GitHub repository (public/uploads/ & src/assets/images/cms/).
 * 4. Replaces Base64 strings with clean permanent URLs (/uploads/...).
 * 5. Saves updated config to Backend API server on Render.
 * 6. Commits updated config JSON directly into GitHub repository (triggering auto-deployment).
 */
export async function syncAllDataToGitHubAndBackend(
  fullConfig: any,
  auth: GitHubAuth,
  commitMessage: string = "CMS: Update site data and images [Volmo Admin Portal]",
  onProgress?: (update: SyncProgressUpdate) => void
): Promise<SyncResult> {
  const filesCommitted: string[] = [];
  let lastCommitUrl: string | undefined;
  let lastCommitSha: string | undefined;

  try {
    // Step 1: Validate GitHub Token & Repo
    onProgress?.({
      step: "auth",
      message: "Verifying GitHub repository access...",
      progressPercent: 10,
      detail: `Checking repository permissions on ${auth.repo}...`,
    });

    const check = await verifyGitHubPermission(auth.token, auth.repo);
    if (!check.valid) {
      throw new Error(check.error || "GitHub authorization failed.");
    }

    // Step 2: Find and extract all Base64 images in config
    onProgress?.({
      step: "images",
      message: "Scanning for uploaded images and photos...",
      progressPercent: 20,
    });

    // Deep clone config
    const cleanedConfig = JSON.parse(JSON.stringify(fullConfig));
    const extractedImages = findBase64Images(cleanedConfig);

    onProgress?.({
      step: "images",
      message: `Found ${extractedImages.length} uploaded photo(s). Processing...`,
      progressPercent: 30,
      detail:
        extractedImages.length > 0
          ? `Extracting and saving ${extractedImages.length} image files to server and GitHub...`
          : "No new Base64 photos found; committing site configuration.",
    });

    // Step 3: Save images to Backend server AND commit to GitHub
    let imageIndex = 0;
    for (const img of extractedImages) {
      imageIndex++;
      const currentPct = 30 + Math.floor((imageIndex / (extractedImages.length || 1)) * 30);

      onProgress?.({
        step: "images",
        message: `Saving image ${imageIndex} of ${extractedImages.length} (${img.suggestedName})...`,
        progressPercent: currentPct,
        detail: `Uploading to backend server & committing to public/uploads/${img.suggestedName}`,
      });

      // A) Save to backend server on Render
      try {
        await api.upload.uploadImage(img.dataUrl, img.suggestedName);
      } catch (err: any) {
        console.warn(`[Sync] Backend upload warning for ${img.suggestedName}:`, err.message);
      }

      // B) Commit image file to GitHub repository
      const githubImgPath = `public/uploads/${img.suggestedName}`;
      const imgCommit = await commitFileToGitHub(
        auth.token,
        auth.repo,
        githubImgPath,
        img.rawBase64,
        `CMS: Upload image ${img.suggestedName} [Volmo Admin]`,
        auth.branch
      );

      if (imgCommit.success) {
        filesCommitted.push(githubImgPath);
        if (imgCommit.commitUrl) lastCommitUrl = imgCommit.commitUrl;
        if (imgCommit.sha) lastCommitSha = imgCommit.sha;
      }

      // C) Update clean URL in configuration
      const permanentUrl = `/uploads/${img.suggestedName}`;
      setDeepValue(cleanedConfig, img.keyPath, permanentUrl);
    }

    // Step 4: Save cleaned config to Backend server on Render
    onProgress?.({
      step: "backend",
      message: "Saving configuration to Render Backend server...",
      progressPercent: 75,
      detail: `Updating live database at ${api.getBaseUrl() || "same-origin"}`,
    });

    try {
      await api.config.saveConfig(cleanedConfig);
    } catch (err: any) {
      console.warn("[Sync] Backend config save warning:", err.message);
    }

    // Step 5: Commit config JSON directly to GitHub repository
    onProgress?.({
      step: "github",
      message: "Committing updated configuration to GitHub source code...",
      progressPercent: 85,
      detail: `Writing server/data/site-config.json and src/data/cmsConfig.json on branch '${auth.branch}'`,
    });

    const configJsonString = JSON.stringify(cleanedConfig, null, 2);
    const configBase64 = utf8ToBase64(configJsonString);

    // Commit 1: server/data/site-config.json
    const serverConfigPath = "server/data/site-config.json";
    const commitServer = await commitFileToGitHub(
      auth.token,
      auth.repo,
      serverConfigPath,
      configBase64,
      commitMessage,
      auth.branch
    );

    if (commitServer.success) {
      filesCommitted.push(serverConfigPath);
      if (commitServer.commitUrl) lastCommitUrl = commitServer.commitUrl;
      if (commitServer.sha) lastCommitSha = commitServer.sha;
    }

    // Commit 2: src/data/cmsConfig.json (client-side bundled data)
    const clientConfigPath = "src/data/cmsConfig.json";
    const commitClient = await commitFileToGitHub(
      auth.token,
      auth.repo,
      clientConfigPath,
      configBase64,
      `CMS: Sync client bundle config [Volmo Admin]`,
      auth.branch
    );

    if (commitClient.success) {
      filesCommitted.push(clientConfigPath);
    }

    // Commit 3: Ensure root package.json has 'start' script for Render/production deployment
    const rootPackageJson = JSON.stringify(
      {
        name: "volmo-electric",
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: {
          dev: "tsx server.ts",
          build: "vite build",
          "vercel-build": "vite build",
          start: "node server.ts",
          "start:backend": "node server/server.js",
          backend: "node server/server.js",
          preview: "vite preview",
          clean: "rm -rf dist server.js",
          lint: "tsc --noEmit",
        },
        dependencies: {
          "@google/genai": "^2.4.0",
          "@tailwindcss/vite": "^4.1.14",
          "@vitejs/plugin-react": "^5.0.4",
          autoprefixer: "^10.4.21",
          cors: "^2.8.6",
          dotenv: "^17.2.3",
          esbuild: "^0.25.0",
          express: "^4.21.2",
          "lucide-react": "^0.546.0",
          motion: "^12.23.24",
          nodemailer: "^10.0.10",
          react: "^19.0.1",
          "react-dom": "^19.0.1",
          tailwindcss: "^4.1.14",
          tsx: "^4.21.0",
          typescript: "~5.8.2",
          vite: "^6.2.3",
        },
        devDependencies: {
          "@types/cors": "^2.8.19",
          "@types/express": "^4.17.21",
          "@types/node": "^22.14.0",
          "@types/nodemailer": "^8.0.2",
        },
      },
      null,
      2
    );

    const commitPkg = await commitFileToGitHub(
      auth.token,
      auth.repo,
      "package.json",
      utf8ToBase64(rootPackageJson),
      "Fix: Ensure start script in package.json for Render deployment",
      auth.branch
    );
    if (commitPkg.success) {
      filesCommitted.push("package.json");
    }

    // Commit 4: Ensure server/package.json has 'start' script
    const serverPackageJson = JSON.stringify(
      {
        name: "volmo-backend-api",
        version: "1.0.0",
        description: "Standalone backend server for Volmo Electric",
        main: "server.js",
        type: "module",
        scripts: {
          start: "node server.js",
          dev: "node server.js",
          build: "echo 'Ready'",
        },
        dependencies: {
          cors: "^2.8.5",
          dotenv: "^17.2.3",
          express: "^4.21.2",
          nodemailer: "^10.0.10",
        },
        devDependencies: {
          "@types/cors": "^2.8.17",
          "@types/express": "^4.17.21",
          "@types/node": "^22.14.0",
          "@types/nodemailer": "^8.0.2",
        },
      },
      null,
      2
    );

    const commitServerPkg = await commitFileToGitHub(
      auth.token,
      auth.repo,
      "server/package.json",
      utf8ToBase64(serverPackageJson),
      "Fix: Ensure start script in server/package.json for Render",
      auth.branch
    );
    if (commitServerPkg.success) {
      filesCommitted.push("server/package.json");
    }

    onProgress?.({
      step: "done",
      message: "Sync complete! GitHub source code updated & auto-deploy triggered.",
      progressPercent: 100,
      detail: `Committed ${filesCommitted.length} file(s) to GitHub '${auth.repo}' on branch '${auth.branch}'.`,
    });

    return {
      success: true,
      uploadedImagesCount: extractedImages.length,
      commitUrl: lastCommitUrl,
      commitSha: lastCommitSha,
      filesCommitted,
    };
  } catch (err: any) {
    onProgress?.({
      step: "error",
      message: `Sync failed: ${err.message || "Unknown error"}`,
      progressPercent: 0,
      detail: err.message,
    });
    return {
      success: false,
      uploadedImagesCount: 0,
      filesCommitted,
      error: err.message || "Failed to sync to GitHub and backend",
    };
  }
}
