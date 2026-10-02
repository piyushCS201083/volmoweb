/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Loader2, CheckCircle2, Cloud } from "lucide-react";
import { PRESET_MEDIA_ASSETS } from "../../data";
import { api } from "../../services/api";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (newVal: string) => void;
  helperText?: string;
  aspectRatio?: "square" | "video" | "wide";
  presets?: { label: string; url: string; category?: string }[];
}

export default function ImageUploader({
  label,
  value,
  onChange,
  helperText,
  aspectRatio = "video",
  presets = PRESET_MEDIA_ASSETS,
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingServer, setIsUploadingServer] = useState(false);
  const [serverStatus, setServerStatus] = useState<string | null>(null);
  const [showCloudPicker, setShowCloudPicker] = useState(false);
  const [cloudList, setCloudList] = useState<Array<{ publicId: string; url: string }>>([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchCloudList = async () => {
    if (cloudList.length > 0) {
      setShowCloudPicker(!showCloudPicker);
      return;
    }
    setLoadingCloud(true);
    setShowCloudPicker(true);
    try {
      const res = await api.cloudinary.listImages("volmo_assets");
      if (res && res.images) {
        setCloudList(res.images);
      }
    } catch (e) {
      console.warn("Could not fetch cloud images:", e);
    } finally {
      setLoadingCloud(false);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setUploadError(null);
    setServerStatus(null);

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Immediate local preview so the user sees their image instantaneously
        onChange(result);

        // Also upload to Backend Server on Render right away to persist on disk
        setIsUploadingServer(true);
        try {
          const res = await api.upload.uploadImage(result, file.name);
          if (res && res.url) {
            onChange(res.url);
            setServerStatus(`✓ Saved to Render Backend Server (${res.url})`);
          }
        } catch (err: any) {
          // If backend is unreachable or offline, base64 is retained as fallback
          console.warn("[ImageUploader] Direct server upload fallback:", err.message);
          setServerStatus("Saved locally. Click 'Save Data' in header to commit to GitHub & Server.");
        } finally {
          setIsUploadingServer(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square w-24"
      : aspectRatio === "wide"
      ? "aspect-[21/9] w-36"
      : "aspect-video w-32";

  return (
    <div className="space-y-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          {label}
        </label>
        {helperText && (
          <span className="text-[10px] text-slate-500 font-mono">{helperText}</span>
        )}
      </div>
      {uploadError && (
        <p className="text-xs text-red-400 font-medium">{uploadError}</p>
      )}

      {isUploadingServer && (
        <div className="flex items-center gap-1.5 text-xs text-orange-400 font-mono bg-orange-950/20 px-3 py-1.5 rounded-lg border border-orange-500/30">
          <Loader2 size={12} className="animate-spin" />
          Uploading &amp; saving image to Render backend server...
        </div>
      )}

      {serverStatus && !isUploadingServer && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <CheckCircle2 size={12} />
          {serverStatus}
        </div>
      )}

      {!serverStatus && !isUploadingServer && value && value.includes("cloudinary.com") && (
        <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-mono">
          <Cloud size={11} />
          Hosted on Cloudinary Cloud CDN (oz1mkn2s)
        </div>
      )}

      {!serverStatus && !isUploadingServer && value && value.startsWith("/uploads/") && (
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-mono">
          <CheckCircle2 size={11} />
          Stored in backend server assets ({value})
        </div>
      )}

      {!serverStatus && !isUploadingServer && value && value.startsWith("data:image/") && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-mono">
          <Cloud size={11} />
          Image draft ready. Click &apos;Save Data&apos; in header to commit permanently to GitHub &amp; Render.
        </div>
      )}

      {/* Visual Preview + Drop Zone */}
      <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center">
        {/* Preview Thumbnail */}
        <div
          className={`relative ${aspectClass} rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center group shadow-md`}
        >
          {value ? (
            <img
              src={value}
              alt={label}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="flex flex-col items-center text-slate-600 gap-1 p-2 text-center">
              <ImageIcon size={20} />
              <span className="text-[9px] font-mono">No Image</span>
            </div>
          )}
        </div>

        {/* Drag and Drop Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files?.[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 w-full border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
            dragOver
              ? "border-orange-500 bg-orange-500/10 scale-[0.99]"
              : "border-slate-700/80 hover:border-slate-500 bg-slate-950/60"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <Upload size={16} className="text-orange-400 mb-1" />
          <p className="text-xs text-slate-200 font-bold">
            Upload Custom Photo (Click / Drag &amp; Drop)
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            PNG, JPG, WebP, SVG &bull; Auto converted to persistent data
          </p>
        </div>
      </div>

      {/* Direct URL input */}
      <div className="pt-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste direct image URL (/src/assets/images/... or https://...)"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-600 font-mono"
        />
      </div>

      {/* 1-Click Presets */}
      {presets && presets.length > 0 && (
        <div className="pt-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
            Quick Studio Presets:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
            {presets.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  value === preset.url
                    ? "bg-orange-500/20 border-orange-500 text-orange-300 font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cloudinary Cloud Picker Button */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
        <button
          type="button"
          onClick={fetchCloudList}
          className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/40 px-3 py-1.5 rounded-xl border border-blue-800/40 transition-all cursor-pointer"
        >
          <Cloud size={12} />
          {showCloudPicker ? "Hide Cloudinary Library" : "Pick from Cloudinary Cloud (oz1mkn2s)"}
          {loadingCloud && <Loader2 size={11} className="animate-spin ml-1" />}
        </button>
      </div>

      {/* Cloudinary Assets Grid */}
      {showCloudPicker && (
        <div className="bg-slate-950/90 border border-blue-900/40 rounded-xl p-3 space-y-2 mt-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Select an image hosted on Cloudinary:</span>
            <span>{cloudList.length} assets</span>
          </div>

          {loadingCloud ? (
            <div className="py-4 text-center text-xs text-slate-400 font-mono">
              Loading Cloudinary assets...
            </div>
          ) : cloudList.length === 0 ? (
            <p className="text-[10px] text-slate-500 font-mono text-center py-2">
              No images found in Cloudinary folder &apos;volmo_assets&apos; yet. Upload above to add images!
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto no-scrollbar pt-1">
              {cloudList.map((asset) => (
                <button
                  key={asset.publicId}
                  type="button"
                  onClick={() => onChange(asset.url)}
                  className={`relative aspect-video rounded-lg overflow-hidden border transition-all group ${
                    value === asset.url
                      ? "border-blue-500 ring-2 ring-blue-500/50"
                      : "border-slate-800 hover:border-slate-600"
                  }`}
                  title={asset.publicId}
                >
                  <img
                    src={asset.url}
                    alt={asset.publicId}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
