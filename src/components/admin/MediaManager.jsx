import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import ImageUploader from "@/components/ImageUploader";
import { fetchApi } from "@/utils/api";
import { Upload, Trash2, Copy, Check, FileText, ImageIcon, AlertCircle } from "lucide-react";
import "./Admin.css";

export default function MediaManager() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/media");
      if (res.data) {
        setMediaList(res.data);
      }
    } catch (e) {
      setToast({ type: "error", message: "Failed to load Media assets." });
    } finally {
      setLoading(false);
    }
  };

  const handleCloudinarySuccess = async (secureUrl, result) => {
    setToast({ type: "success", message: "Cloudinary upload successful!" });
    
    try {
      // Save asset record to MongoDB media collection
      await fetchApi("/media", {
        method: "POST",
        body: JSON.stringify({
          name: result?.public_id || "Cloudinary Asset",
          url: secureUrl,
          format: result?.format || "image"
        })
      });
      loadMedia();
    } catch (err) {
      // Asset is still uploaded to Cloudinary even if DB index fails
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media file?")) return;

    try {
      await fetchApi(`/media/${id}`, { method: "DELETE" });
      setMediaList(prev => prev.filter(m => m._id !== id));
      setToast({ type: "success", message: "Media deleted successfully!" });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to delete media asset." });
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout title="MEDIA LIBRARY & CLOUD ASSETS">
      {toast && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="admin-card mb-8">
        <ImageUploader
          label="UPLOAD NEW CLOUD MEDIA (DIRECT TO CLOUDINARY)"
          onUploadSuccess={handleCloudinarySuccess}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500 uppercase tracking-widest text-xs animate-pulse">
            Loading Media Library Assets...
          </div>
        ) : mediaList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 uppercase tracking-widest text-xs">
            No uploaded assets found in Media Library.
          </div>
        ) : (
          mediaList.map((item) => {
            const isPdf = item.format && item.format.includes("pdf");
            return (
              <div key={item._id} className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between group">
                <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden">
                  {isPdf ? (
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <FileText size={32} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">PDF DOCUMENT</span>
                    </div>
                  ) : (
                    <img src={item.url} alt={item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                </div>

                <div className="p-3 bg-[#0d0d0d] flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white truncate" title={item.filename}>{item.filename}</span>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleCopyUrl(item.url, item._id)}
                      className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedId === item._id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedId === item._id ? "COPIED" : "COPY URL"}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Delete asset"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}
