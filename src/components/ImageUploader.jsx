import { useState, useRef } from "react";
import { uploadImage } from "@/utils/cloudinary";
import { Upload, Check, Copy, AlertCircle, RefreshCw, X, Image as ImageIcon } from "lucide-react";

export default function ImageUploader({
  onUploadSuccess,
  initialUrl = "",
  label = "Upload Image to Cloudinary",
  className = ""
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(initialUrl);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    startUpload(selectedFile);
  };

  const onInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const startUpload = async (fileToUpload) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadImage(fileToUpload, (percent) => {
        setProgress(percent);
      });

      setUploadedUrl(result.secure_url);
      setPreview(result.secure_url);

      if (onUploadSuccess && typeof onUploadSuccess === "function") {
        onUploadSuccess(result.secure_url, result);
      }
    } catch (err) {
      setError(err.message || "Failed to upload image to Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = () => {
    if (!uploadedUrl) return;
    navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetUploader = () => {
    setFile(null);
    setPreview("");
    setUploadedUrl("");
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-black tracking-widest uppercase mb-2 text-black dark:text-white">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 flex flex-col items-center justify-center text-center ${
          error
            ? "border-rose-500/50 bg-rose-500/5"
            : uploadedUrl
            ? "border-emerald-500/50 bg-emerald-500/5"
            : uploading
            ? "border-blue-500/50 bg-blue-500/5"
            : "border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 bg-black/5 dark:bg-white/5"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onInputChange}
          accept="image/*"
          disabled={uploading}
          className="hidden"
        />

        {/* Preview or Icon */}
        {preview ? (
          <div className="relative mb-4 w-full max-w-xs aspect-video rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-black/20 shadow-md flex items-center justify-center">
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            {!uploading && (
              <button
                type="button"
                onClick={resetUploader}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors shadow-lg"
                title="Remove image"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center mb-3 text-black dark:text-white">
            <ImageIcon size={20} />
          </div>
        )}

        {/* Upload State Text & Progress */}
        {uploading ? (
          <div className="w-full max-w-xs flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              <RefreshCw size={14} className="animate-spin text-blue-500" />
              <span>Uploading to Cloudinary... ({progress}%)</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : uploadedUrl ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
              <Check size={14} />
              <span>Upload Complete!</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-bold tracking-wider uppercase underline text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
              >
                Change Image
              </button>
              <span className="text-black/30 dark:text-white/30">•</span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? "Copied!" : "Copy Cloudinary URL"}</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-1">
              Drag & Drop image here or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="underline text-blue-500 hover:text-blue-600"
              >
                browse
              </button>
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Supports PNG, JPG, WEBP, GIF, SVG (Max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-wider flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
          {file && (
            <button
              type="button"
              onClick={() => startUpload(file)}
              className="flex items-center gap-1 text-[10px] font-black underline hover:text-rose-400"
            >
              <RefreshCw size={10} />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}

      {/* Display Uploaded URL if present */}
      {uploadedUrl && (
        <div className="mt-3 p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono font-medium truncate text-zinc-600 dark:text-zinc-300 select-all">
            {uploadedUrl}
          </span>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors flex-shrink-0"
            title="Copy URL"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}
