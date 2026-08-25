"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

export function ImageDropzone({
  onFile,
  label = "Click to upload, or drag an image here",
  hint = "JPG, PNG, WEBP, GIF, or AVIF · up to 4 MB",
  className = "",
}: {
  onFile: (file: File) => void;
  label?: string;
  hint?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
      className={`w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
        dragging
          ? "border-[#38B685] bg-[#38B685]/5"
          : "border-white/15 hover:border-white/30 hover:bg-white/[0.02]"
      } ${className}`}
    >
      <ImagePlus className={`w-6 h-6 ${dragging ? "text-[#38B685]" : "text-white/40"}`} />
      <span className="text-sm font-semibold text-white/70">{label}</span>
      <span className="text-xs text-white/30">{hint}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
        className="hidden"
      />
    </button>
  );
}
