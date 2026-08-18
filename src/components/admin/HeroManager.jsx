import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { fetchApi } from "@/utils/api";
import { Save, Upload, Link as LinkIcon, FileText, Check, AlertCircle } from "lucide-react";
import "./Admin.css";

export default function HeroManager() {
  const [formData, setFormData] = useState({
    heading: "",
    highlightText: "",
    description: "",
    marqueeText: "",
    badgeText: "",
    cta1Text: "",
    cta1Link: "",
    cta2Text: "",
    cta2Link: "",
    imageUrl: "",
    resumeFileUrl: ""
  });

  const [imageMode, setImageMode] = useState("url");
  const [resumeMode, setResumeMode] = useState("upload");
  const [fileImage, setFileImage] = useState(null);
  const [fileResume, setFileResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/hero");
      if (res.data) {
        setFormData({
          heading: res.data.heading || "",
          highlightText: res.data.highlightText || "",
          description: res.data.description || "",
          marqueeText: res.data.marqueeText || "",
          badgeText: res.data.badgeText || "",
          cta1Text: res.data.cta1Text || "",
          cta1Link: res.data.cta1Link || "",
          cta2Text: res.data.cta2Text || "",
          cta2Link: res.data.cta2Link || "",
          imageUrl: res.data.image || "",
          resumeFileUrl: res.data.resumeUrl || ""
        });
      }
    } catch (e) {
      setToast({ type: "error", message: "Failed to load Hero parameters." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (imageMode === "upload" && fileImage) {
        data.append("image", fileImage);
      }
      if (resumeMode === "upload" && fileResume) {
        data.append("resume", fileResume);
      }

      const res = await fetchApi("/hero", {
        method: "PUT",
        body: data
      });

      if (res.data) {
        setToast({ type: "success", message: "Hero parameters updated successfully!" });
        setFormData(prev => ({
          ...prev,
          imageUrl: res.data.image || prev.imageUrl,
          resumeFileUrl: res.data.resumeUrl || prev.resumeFileUrl
        }));
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save Hero section." });
    } finally {
      setSaving(false);
    }
  };

  const saveBtn = (
    <button type="button" onClick={handleSubmit} disabled={saving} className="admin-btn-primary py-2.5 px-5 text-xs">
      <Save size={14} />
      <span>{saving ? "SAVING..." : "SAVE HERO"}</span>
    </button>
  );

  if (loading) {
    return (
      <AdminLayout title="HERO MANAGEMENT">
        <div className="p-8 text-zinc-500 uppercase tracking-widest text-xs animate-pulse">Loading Hero Configuration...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="HERO SECTION MANAGEMENT" headerAction={saveBtn}>
      {toast && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">HERO TYPOGRAPHY & TEXT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="admin-form-group">
              <label className="admin-label">STATUS BADGE TEXT</label>
              <input type="text" name="badgeText" value={formData.badgeText} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">MAIN HEADING PREFIX</label>
              <input type="text" name="heading" value={formData.heading} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group md:col-span-2">
              <label className="admin-label">HIGHLIGHT TEXT LINE</label>
              <input type="text" name="highlightText" value={formData.highlightText} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group md:col-span-2">
              <label className="admin-label">SHORT DESCRIPTION SUBTITLE</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="admin-textarea" />
            </div>

            <div className="admin-form-group md:col-span-2">
              <label className="admin-label">MARQUEE SCROLLING TEXT</label>
              <input type="text" name="marqueeText" value={formData.marqueeText} onChange={handleChange} className="admin-input" />
            </div>
          </div>
        </div>

        {/* Action Buttons & Links */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">ACTION CALL-TO-ACTIONS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="admin-form-group">
              <label className="admin-label">BUTTON 1 TEXT</label>
              <input type="text" name="cta1Text" value={formData.cta1Text} onChange={handleChange} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">BUTTON 1 TARGET LINK</label>
              <input type="text" name="cta1Link" value={formData.cta1Link} onChange={handleChange} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">BUTTON 2 TEXT</label>
              <input type="text" name="cta2Text" value={formData.cta2Text} onChange={handleChange} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">BUTTON 2 TARGET LINK</label>
              <input type="text" name="cta2Link" value={formData.cta2Link} onChange={handleChange} className="admin-input" />
            </div>
          </div>
        </div>

        {/* Dual Mode Resume Document Manager */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">RESUME PDF MANAGEMENT</span>
            <div className="input-mode-tabs">
              <button type="button" className={`input-mode-tab ${resumeMode === "upload" ? "active" : ""}`} onClick={() => setResumeMode("upload")}>
                <Upload size={10} className="inline mr-1" /> UPLOAD PDF
              </button>
              <button type="button" className={`input-mode-tab ${resumeMode === "url" ? "active" : ""}`} onClick={() => setResumeMode("url")}>
                <LinkIcon size={10} className="inline mr-1" /> PASTE URL
              </button>
            </div>
          </div>

          {resumeMode === "upload" ? (
            <div className="admin-form-group">
              <label className="admin-label">SELECT RESUME FILE (PDF)</label>
              <input type="file" accept=".pdf" onChange={(e) => setFileResume(e.target.files[0])} className="admin-input cursor-pointer" />
            </div>
          ) : (
            <div className="admin-form-group">
              <label className="admin-label">DIRECT RESUME PDF URL</label>
              <input type="text" name="resumeFileUrl" value={formData.resumeFileUrl} onChange={handleChange} className="admin-input" placeholder="https://..." />
            </div>
          )}

          {formData.resumeFileUrl && (
            <div className="mt-2 flex items-center gap-4">
              <a href={formData.resumeFileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-white font-semibold flex items-center gap-1 underline">
                <FileText size={14} /> VIEW CURRENT RESUME PDF
              </a>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          {saveBtn}
        </div>
      </form>
    </AdminLayout>
  );
}
