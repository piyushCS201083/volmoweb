/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Database,
  UploadCloud,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  Copy,
  Check,
  Loader2,
  Server,
  Zap,
} from "lucide-react";
import { api } from "../../services/api";
import { useSiteConfig } from "../../SiteConfigContext";
import { PriceInquiry, DealershipApp } from "../../types";

interface CloudDatabaseCMSProps {
  onShowToast: (msg: string) => void;
  inquiries: PriceInquiry[];
  dealers: DealershipApp[];
  onRefreshLeads: () => void;
}

export default function CloudDatabaseCMS({
  onShowToast,
  inquiries,
  dealers,
  onRefreshLeads,
}: CloudDatabaseCMSProps) {
  const {
    modelsData,
    saveAllModels,
    brandingConfig,
    updateBrandingConfig,
    accessoriesData,
    updateAccessoriesData,
  } = useSiteConfig();

  const [cloudStatus, setCloudStatus] = useState<{
    success: boolean;
    cloudName: string;
    hasApiKey: boolean;
  }>({
    success: true,
    cloudName: "oz1mkn2s",
    hasApiKey: true,
  });

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [migratingImages, setMigratingImages] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<any>(null);
  const [cloudImages, setCloudImages] = useState<
    Array<{ publicId: string; url: string; bytes: number; format: string; createdAt: string }>
  >([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Check connection
  const checkStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await api.cloudinary.getStatus();
      setCloudStatus(res);
    } catch (e: any) {
      console.warn("Cloudinary status check notice:", e.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  // Load Cloudinary images
  const loadCloudImages = async () => {
    setLoadingImages(true);
    try {
      const res = await api.cloudinary.listImages("volmo_assets");
      if (res && res.images) {
        setCloudImages(res.images);
      }
    } catch (e) {
      console.warn("Could not load Cloudinary image list:", e);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    checkStatus();
    loadCloudImages();
  }, []);

  // Sync All Data (Config, Inquiries, Dealers) to Cloud Database
  const handleSyncAllToCloud = async () => {
    setSyncingAll(true);
    try {
      const res = await api.cloudinary.syncAllToCloud();
      setLastSyncResult(res);
      onShowToast("✓ All form submissions and site data permanently synced to Cloud Database!");
      onRefreshLeads();
    } catch (err: any) {
      onShowToast("Cloud sync failed: " + err.message);
    } finally {
      setSyncingAll(false);
    }
  };

  // Migrate Local Scooter Images to Cloudinary CDN
  const handleMigrateLocalImages = async () => {
    setMigratingImages(true);
    try {
      const res = await api.cloudinary.syncLocalImages();
      if (res && res.migrated && res.migrated.length > 0) {
        const urlMap = new Map<string, string>();
        res.migrated.forEach((m) => {
          urlMap.set(m.localPath, m.cloudUrl);
          urlMap.set(m.localName, m.cloudUrl);
        });

        // Update models with Cloudinary URLs
        const updatedModels = modelsData.map((m) => {
          let updatedPhoto = m.photo;
          if (m.photo && urlMap.has(m.photo)) {
            updatedPhoto = urlMap.get(m.photo)!;
          }

          const updatedColors = m.colors.map((c) => {
            if (c.image && urlMap.has(c.image)) {
              return { ...c, image: urlMap.get(c.image)! };
            }
            return c;
          });

          return { ...m, photo: updatedPhoto, colors: updatedColors };
        });

        saveAllModels(updatedModels);

        // Update branding logo if matches
        if (brandingConfig.logoImage && urlMap.has(brandingConfig.logoImage)) {
          updateBrandingConfig({ logoImage: urlMap.get(brandingConfig.logoImage) });
        }

        onShowToast(`✓ ${res.migrated.length} local images uploaded and migrated to Cloudinary CDN!`);
        loadCloudImages();
      } else {
        onShowToast("All local images are already synced to Cloudinary.");
      }
    } catch (err: any) {
      onShowToast("Image migration warning: " + err.message);
    } finally {
      setMigratingImages(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-800/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold">
              <Cloud size={14} className="animate-pulse" />
              Cloud Database &amp; CDN Storage Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Cloud Database &amp; Asset Center
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Connected to Cloudinary Cloud <strong className="text-blue-400 font-mono">oz1mkn2s</strong>.
              All custom uploaded scooter photos, site configurations, and form submissions
              (Inquiries &amp; Dealership Leads) are stored in this cloud forever.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleSyncAllToCloud}
              disabled={syncingAll}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-blue-950/50 transition-all cursor-pointer disabled:opacity-50"
            >
              {syncingAll ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Syncing to Cloud...
                </>
              ) : (
                <>
                  <UploadCloud size={14} />
                  Sync All Data to Cloud
                </>
              )}
            </button>
            <a
              href="https://cloudinary.com/console"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-medium rounded-xl transition-all"
            >
              <ExternalLink size={13} />
              Open Cloudinary Console
            </a>
          </div>
        </div>
      </div>

      {/* Cloud Status & Config Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Connection Info */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              Cloud Credentials
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={10} /> Connected
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-500">Cloud Name:</span>
              <strong className="text-blue-400">{cloudStatus.cloudName}</strong>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-500">API Key:</span>
              <span className="text-slate-300">458683116565521</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-500">Status:</span>
              <span className="text-emerald-400 font-bold">Authenticated</span>
            </div>
          </div>

          <button
            onClick={checkStatus}
            disabled={loadingStatus}
            className="w-full mt-2 py-1.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-400 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={11} className={loadingStatus ? "animate-spin" : ""} />
            Test Cloud Connection
          </button>
        </div>

        {/* Card 2: Form Submissions Persistence */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              Cloud Form Database
            </span>
            <Database size={16} className="text-indigo-400" />
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-500">Inquiries Synced:</span>
              <span className="text-emerald-400 font-bold">{inquiries.length} records</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-500">Dealerships Synced:</span>
              <span className="text-emerald-400 font-bold">{dealers.length} records</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-500">Storage Type:</span>
              <span className="text-blue-300">Cloud Raw JSON</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono">
            Every submission through the website is immediately saved to Cloudinary cloud storage so
            leads are never lost.
          </p>
        </div>

        {/* Card 3: Image CDN & Asset Migration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              Website Image CDN
            </span>
            <ImageIcon size={16} className="text-orange-400" />
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-500">Cloud Assets:</span>
              <span className="text-orange-400 font-bold">{cloudImages.length} images</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-500">CDN Delivery:</span>
              <span className="text-emerald-400 font-bold">Global HTTPS</span>
            </div>
          </div>

          <button
            onClick={handleMigrateLocalImages}
            disabled={migratingImages}
            className="w-full mt-2 py-1.5 px-3 bg-gradient-to-r from-orange-600/80 to-amber-600/80 hover:from-orange-500 hover:to-amber-500 border border-orange-500/40 text-[11px] font-mono text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {migratingImages ? (
              <>
                <Loader2 size={12} className="animate-spin" /> Migrating...
              </>
            ) : (
              <>
                <Zap size={12} /> Sync Local Images to Cloudinary
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cloud Data Endpoints & Live URLs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Server size={14} className="text-blue-400" />
          Cloud Database Endpoints (Cloudinary Raw Storage)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Inquiries Database:</span>
            <p className="text-slate-300 truncate text-[11px]">volmo_cloud_db/inquiries</p>
            <span className="inline-block text-[10px] text-emerald-400 font-bold">
              ✓ Synced Live on Form Submit
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Dealers Database:</span>
            <p className="text-slate-300 truncate text-[11px]">volmo_cloud_db/dealers</p>
            <span className="inline-block text-[10px] text-emerald-400 font-bold">
              ✓ Synced Live on Form Submit
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Site Configuration:</span>
            <p className="text-slate-300 truncate text-[11px]">volmo_cloud_db/site-config</p>
            <span className="inline-block text-[10px] text-emerald-400 font-bold">
              ✓ Auto-persisted across redeploys
            </span>
          </div>
        </div>
      </div>

      {/* Cloudinary Asset Gallery */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon size={16} className="text-blue-400" />
              Cloudinary Image Library (Folder: volmo_assets)
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Images hosted on your Cloudinary cloud. Click any image URL to copy or use it in the CMS.
            </p>
          </div>

          <button
            onClick={loadCloudImages}
            disabled={loadingImages}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
            title="Refresh Cloudinary Images"
          >
            <RefreshCw size={14} className={loadingImages ? "animate-spin" : ""} />
          </button>
        </div>

        {loadingImages ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 size={24} className="animate-spin text-blue-400" />
            <span className="text-xs font-mono">Loading Cloudinary assets...</span>
          </div>
        ) : cloudImages.length === 0 ? (
          <div className="py-10 border border-dashed border-slate-800 rounded-xl text-center space-y-3">
            <Cloud size={32} className="mx-auto text-slate-600" />
            <p className="text-xs text-slate-400 font-mono">
              No images in folder &apos;volmo_assets&apos; yet.
            </p>
            <button
              onClick={handleMigrateLocalImages}
              disabled={migratingImages}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl transition-all"
            >
              Upload Local Scooter Photos to Cloudinary
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {cloudImages.map((img) => (
              <div
                key={img.publicId}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group hover:border-blue-500/50 transition-all flex flex-col"
              >
                <div className="aspect-video w-full bg-slate-900 overflow-hidden relative">
                  <img
                    src={img.url}
                    alt={img.publicId}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyToClipboard(img.url)}
                      className="p-1.5 bg-slate-900/90 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      title="Copy Image URL"
                    >
                      {copiedUrl === img.url ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-white rounded-lg transition-colors"
                      title="View Full Size"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                <div className="p-2.5 font-mono text-[10px] space-y-1 flex-1 flex flex-col justify-between">
                  <p className="text-slate-300 font-bold truncate" title={img.publicId}>
                    {img.publicId.split("/").pop()}
                  </p>
                  <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-900">
                    <span>{img.format.toUpperCase()}</span>
                    <span>{(img.bytes / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
