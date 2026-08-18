import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { fetchApi } from "@/utils/api";
import { Save, Upload, Link as LinkIcon, Plus, Trash2, Check, AlertCircle } from "lucide-react";
import "./Admin.css";

export default function AboutManager() {
  const [formData, setFormData] = useState({
    bioTitle: "ABOUT",
    bioParagraph1: "",
    bioParagraph2: "",
    philosophyQuote: "",
    yearsExperience: 2,
    location: "",
    email: "",
    phone: "",
    profileImageUrl: ""
  });

  const [timeline, setTimeline] = useState([]);
  const [imageMode, setImageMode] = useState("url");
  const [fileImage, setFileImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/about");
      if (res.data) {
        setFormData({
          bioTitle: res.data.bioTitle || "ABOUT",
          bioParagraph1: res.data.bioParagraph1 || "",
          bioParagraph2: res.data.bioParagraph2 || "",
          philosophyQuote: res.data.philosophyQuote || "",
          yearsExperience: res.data.yearsExperience || 0,
          location: res.data.location || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          profileImageUrl: res.data.profileImage || ""
        });
        setTimeline(res.data.experienceTimeline || []);
      }
    } catch (e) {
      setToast({ type: "error", message: "Failed to load About section configuration." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTimeline = () => {
    setTimeline(prev => [...prev, { role: "", company: "", period: "" }]);
  };

  const handleTimelineChange = (index, field, value) => {
    setTimeline(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleRemoveTimeline = (index) => {
    setTimeline(prev => prev.filter((_, i) => i !== index));
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
      data.append("experienceTimeline", JSON.stringify(timeline));

      if (imageMode === "upload" && fileImage) {
        data.append("profileImage", fileImage);
      }

      const res = await fetchApi("/about", {
        method: "PUT",
        body: data
      });

      if (res.data) {
        setToast({ type: "success", message: "About section updated successfully!" });
        setFormData(prev => ({
          ...prev,
          profileImageUrl: res.data.profileImage || prev.profileImageUrl
        }));
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save About section." });
    } finally {
      setSaving(false);
    }
  };

  const saveBtn = (
    <button type="button" onClick={handleSubmit} disabled={saving} className="admin-btn-primary py-2.5 px-5 text-xs">
      <Save size={14} />
      <span>{saving ? "SAVING..." : "SAVE ABOUT"}</span>
    </button>
  );

  if (loading) {
    return (
      <AdminLayout title="ABOUT PROFILE MANAGEMENT">
        <div className="p-8 text-zinc-500 uppercase tracking-widest text-xs animate-pulse">Loading About Configuration...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="ABOUT PROFILE MANAGEMENT" headerAction={saveBtn}>
      {toast && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">BIOGRAPHY & PROFILE DETAILS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="admin-form-group">
              <label className="admin-label">SECTION HEADING</label>
              <input type="text" name="bioTitle" value={formData.bioTitle} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">YEARS OF EXPERIENCE</label>
              <input type="number" name="yearsExperience" value={formData.yearsExperience} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group md:col-span-2">
              <label className="admin-label">PRIMARY BIO PARAGRAPH</label>
              <textarea name="bioParagraph1" value={formData.bioParagraph1} onChange={handleChange} rows={3} className="admin-textarea" required />
            </div>

            <div className="admin-form-group md:col-span-2">
              <label className="admin-label">SECONDARY BIO PARAGRAPH</label>
              <textarea name="bioParagraph2" value={formData.bioParagraph2} onChange={handleChange} rows={3} className="admin-textarea" required />
            </div>

            <div className="admin-form-group md:col-span-2">
              <label className="admin-label">PHILOSOPHY STATEMENT QUOTE</label>
              <textarea name="philosophyQuote" value={formData.philosophyQuote} onChange={handleChange} rows={2} className="admin-textarea" required />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">LOCATION</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">CONTACT EMAIL</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="admin-input" />
            </div>
          </div>
        </div>

        {/* Profile Image Dual-Mode */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">PROFILE IMAGE</span>
            <div className="input-mode-tabs">
              <button type="button" className={`input-mode-tab ${imageMode === "upload" ? "active" : ""}`} onClick={() => setImageMode("upload")}>
                <Upload size={10} className="inline mr-1" /> UPLOAD FILE
              </button>
              <button type="button" className={`input-mode-tab ${imageMode === "url" ? "active" : ""}`} onClick={() => setImageMode("url")}>
                <LinkIcon size={10} className="inline mr-1" /> PASTE IMAGE URL
              </button>
            </div>
          </div>

          {imageMode === "upload" ? (
            <div className="admin-form-group">
              <label className="admin-label">UPLOAD IMAGE FILE</label>
              <input type="file" accept="image/*" onChange={(e) => setFileImage(e.target.files[0])} className="admin-input cursor-pointer" />
            </div>
          ) : (
            <div className="admin-form-group">
              <label className="admin-label">DIRECT IMAGE URL</label>
              <input type="text" name="profileImageUrl" value={formData.profileImageUrl} onChange={handleChange} className="admin-input" placeholder="https://..." />
            </div>
          )}

          {formData.profileImageUrl && (
            <div className="preview-box">
              <img src={formData.profileImageUrl} alt="Profile Preview" className="preview-img" />
            </div>
          )}
        </div>

        {/* Experience Timeline Editor */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">CAREER TIMELINE & EXPERIENCE</span>
            <button type="button" onClick={handleAddTimeline} className="admin-btn-secondary py-2 px-3 text-[10px]">
              <Plus size={12} /> ADD EXPERIENCE
            </button>
          </div>

          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="p-4 bg-[#090909] border border-white/10 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <input
                  type="text"
                  placeholder="ROLE (e.g. Lead UI/UX Engineer)"
                  value={item.role}
                  onChange={(e) => handleTimelineChange(idx, "role", e.target.value)}
                  className="admin-input"
                />
                <input
                  type="text"
                  placeholder="COMPANY / LOCATION"
                  value={item.company}
                  onChange={(e) => handleTimelineChange(idx, "company", e.target.value)}
                  className="admin-input"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="PERIOD (e.g. 2025 - PRESENT)"
                    value={item.period}
                    onChange={(e) => handleTimelineChange(idx, "period", e.target.value)}
                    className="admin-input flex-grow"
                  />
                  <button type="button" onClick={() => handleRemoveTimeline(idx)} className="p-3 text-rose-400 hover:text-rose-300">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          {saveBtn}
        </div>
      </form>
    </AdminLayout>
  );
}
