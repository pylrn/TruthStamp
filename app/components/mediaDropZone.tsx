"use client";

import { ReactNode, useRef, useState, useEffect } from "react";

interface MediaDropZoneProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  accept: string[];
  onFileSelect: (file: File) => Promise<void> | void;
  onSubmit?: (file: File) => Promise<void> | void; 
  accent?: "emerald" | "cyan" | "violet";
}

const accentMap = {
  emerald: "text-emerald-400 border-emerald-500/40",
  cyan: "text-cyan-400 border-cyan-500/40",
  violet: "text-violet-400 border-violet-500/40",
};

export default function MediaDropZone({
  title,
  subtitle,
  icon,
  accept,
  onFileSelect,
  onSubmit,
  accent = "emerald",
}: MediaDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);


  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  /* ---------- Validation ---------- */
  const validateAndSet = async (file: File) => {
    if (!accept.includes(file.type)) {
      setError("Invalid file type");
      return;
    }

    setError(null);
    setFile(file);
    await onFileSelect(file);
  };

  /* ---------- Drag & Drop ---------- */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (file) return;

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) validateAndSet(droppedFile);
  };

  /* ---------- Preview Renderer ---------- */
  const renderPreview = () => {
    if (!file || !previewUrl) return null;

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={previewUrl}
          alt="preview"
          className="w-full h-full object-cover rounded-xl"
        />
      );
    }

    if (file.type.startsWith("video/")) {
      return (
        <video
          src={previewUrl}
          controls
          className="w-full h-full object-cover rounded-xl"
        />
      );
    }

    return null;
  };

  
  const handleSubmit = async () => {
    if (!file || !onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(file);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => !file && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        !file && setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative w-full h-64 rounded-2xl
        border border-dashed
        bg-gradient-to-b from-white/[0.02] to-transparent
        transition-all duration-300 cursor-pointer group
        ${accentMap[accent]}
        ${isDragging ? "bg-white/[0.06] scale-[1.02]" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept.join(",")}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) validateAndSet(f);
        }}
      />

      {/* Hover grid */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-[size:20px_20px] bg-[linear-gradient(to_right,#34d399_1px,transparent_1px),linear-gradient(to_bottom,#34d399_1px,transparent_1px)] rounded-2xl" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {file ? (
          <>
         
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-red-500 transition"
            >
              ✕
            </button>

            <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10">
              {renderPreview()}
            </div>

            <p className="text-[10px] font-mono text-slate-400 mt-2 truncate w-full">
              {file.name}
            </p>

       
            {onSubmit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit();
                }}
                disabled={isSubmitting}
                className="mt-3 px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-lg
                           bg-emerald-500 text-black hover:bg-emerald-400
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition"
              >
                {isSubmitting ? "Analyzing…" : "Send to AI"}
              </button>
            )}
          </>
        ) : (
          <>
    
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full blur-xl bg-current opacity-60" />
              <div className="relative w-full h-full rounded-xl bg-black border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <div className="absolute -inset-2 border border-dashed border-current/40 rounded-full animate-[spin_10s_linear_infinite]" />
            </div>

            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-[11px] font-mono text-slate-500">{subtitle}</p>
          </>
        )}

        {error && (
          <p className="text-[10px] text-red-400 mt-2 font-mono">{error}</p>
        )}
      </div>
    </div>
  );
}
