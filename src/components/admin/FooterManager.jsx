import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { fetchApi } from "@/utils/api";
import { Save, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import "./Admin.css";

export default function FooterManager() {
  const [formData, setFormData] = useState({
    copyrightText: "",
    description: "",
    email: "",
    phone: "",
    location: "",
    workingHours: "",
    contactButtonText: "LET'S TALK"
  });

  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/footer");
      if (res.data) {
        setFormData({
          copyrightText: res.data.copyrightText || "",
          description: res.data.description || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          location: res.data.location || "",
          workingHours: res.data.workingHours || "",
          contactButtonText: res.data.contactButtonText || "LET'S TALK"
        });
        setSocials(res.data.socials || []);
      }
    } catch (e) {
      setToast({ type: "error", message: "Failed to load Footer configuration." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialUrlChange = (index, url) => {
    setSocials(prev => {
      const updated = [...prev];
      updated[index].url = url;
      return updated;
    });
  };

  const handleToggleSocial = (index) => {
    setSocials(prev => {
      const updated = [...prev];
      updated[index].isEnabled = !updated[index].isEnabled;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const res = await fetchApi("/footer", {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          socials
        })
      });

      if (res.data) {
        setToast({ type: "success", message: "Footer & Social links updated successfully!" });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save Footer settings." });
    } finally {
      setSaving(false);
    }
  };

  const saveBtn = (
    <button type="button" onClick={handleSubmit} disabled={saving} className="admin-btn-primary py-2.5 px-5 text-xs">
      <Save size={14} />
      <span>{saving ? "SAVING..." : "SAVE FOOTER"}</span>
    </button>
  );

  if (loading) {
    return (
      <AdminLayout title="FOOTER & SOCIAL LINKS MANAGEMENT">
        <div className="p-8 text-zinc-500 uppercase tracking-widest text-xs animate-pulse">Loading Footer Configuration...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="FOOTER & SOCIAL LINKS MANAGEMENT" headerAction={saveBtn}>
      {toast && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">FOOTER TEXT & CONTACT META</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="admin-form-group md:col-span-2">
              <label className="admin-label">FOOTER STUDIO STATEMENT / DESCRIPTION</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="admin-textarea" />
            </div>

            <div className="admin-form-group md:col-span-2">
              <label className="admin-label">COPYRIGHT NOTICE TEXT</label>
              <input type="text" name="copyrightText" value={formData.copyrightText} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">EMAIL ADDRESS</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">PHONE NUMBER</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">LOCATION</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">WORKING HOURS</label>
              <input type="text" name="workingHours" value={formData.workingHours} onChange={handleChange} className="admin-input" />
            </div>
          </div>
        </div>

        {/* Social Platforms Enable/Disable & Links */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">SOCIAL MEDIA NETWORKS</span>
          </div>

          <div className="space-y-4">
            {socials.map((item, idx) => (
              <div key={idx} className="p-4 bg-[#090909] border border-white/10 rounded-xl flex items-center justify-between gap-4">
                <div className="w-32 flex items-center gap-2">
                  <span className="font-bold text-xs uppercase text-white">{item.platform}</span>
                </div>

                <input
                  type="text"
                  placeholder="https://..."
                  value={item.url}
                  onChange={(e) => handleSocialUrlChange(idx, e.target.value)}
                  className="admin-input flex-grow"
                />

                <button
                  type="button"
                  onClick={() => handleToggleSocial(idx)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${item.isEnabled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"}`}
                >
                  {item.isEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>{item.isEnabled ? "ENABLED" : "DISABLED"}</span>
                </button>
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
