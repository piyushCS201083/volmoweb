/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { PRESET_MEDIA_ASSETS } from "../../data";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
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
    </div>
  );
}
