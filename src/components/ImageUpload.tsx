"use client";

import { useState, useRef } from "react";
import { ImagePlus, X, Link } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [mode, setMode] = useState<"url" | "file">(value ? "url" : "file");
  const [urlInput, setUrlInput] = useState(value || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>

      {value ? (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => { onChange(null); setUrlInput(""); }}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div
            onClick={() => mode === "file" ? fileRef.current?.click() : undefined}
            className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-colors"
          >
            <ImagePlus className="w-8 h-8 mb-1" />
            <span className="text-xs">Upload</span>
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`text-xs px-2 py-1 rounded ${mode === "url" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}
            >
              <Link className="w-3 h-3 inline mr-1" />URL
            </button>
            <button
              type="button"
              onClick={() => setMode("file")}
              className={`text-xs px-2 py-1 rounded ${mode === "file" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}
            >
              <ImagePlus className="w-3 h-3 inline mr-1" />File
            </button>
          </div>
        </div>
      )}

      {!value && mode === "url" && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => onChange(urlInput || null)}
            className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-slate-700"
          >
            Set
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}
