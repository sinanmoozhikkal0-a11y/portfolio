import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { fetchApi } from "@/utils/api";
import { Save, FolderKanban, Code, MessageSquare, Image as ImageIcon, Check, AlertCircle } from "lucide-react";
import "./Admin.css";

export default function SettingsManager() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalSkills: 0,
    unreadMessages: 0,
    totalMedia: 0
  });

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/settings");
      if (res.data) {
        setStats(res.data.stats || {});
        if (res.data.admin) {
          setUsername(res.data.admin.username || "admin");
        }
      }
    } catch (e) {
      setToast({ type: "error", message: "Failed to load dashboard settings metrics." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const res = await fetchApi("/settings", {
        method: "PUT",
        body: JSON.stringify({
          username,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined
        })
      });

      if (res) {
        setToast({ type: "success", message: "Admin credentials updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to update account settings." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="CMS DASHBOARD & SETTINGS">
      {toast && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Dashboard Analytics Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="stat-lbl">TOTAL PROJECTS</span>
            <FolderKanban size={18} />
          </div>
          <span className="stat-val">{stats.totalProjects}</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="stat-lbl">SKILLS CATEGORIES</span>
            <Code size={18} />
          </div>
          <span className="stat-val">{stats.totalSkills}</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="stat-lbl">UNREAD MESSAGES</span>
            <MessageSquare size={18} />
          </div>
          <span className="stat-val text-amber-400">{stats.unreadMessages}</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="stat-lbl">MEDIA ASSETS</span>
            <ImageIcon size={18} />
          </div>
          <span className="stat-val">{stats.totalMedia}</span>
        </div>
      </div>

      {/* Account Settings Form */}
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">ACCOUNT CREDENTIALS & SECURITY</span>
        </div>

        <form onSubmit={handleUpdateAccount} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="admin-form-group md:col-span-2">
              <label className="admin-label">ADMIN USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-input"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">CURRENT PASSWORD (REQUIRED FOR NEW PASSWORD)</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="admin-input"
                placeholder="••••••••"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">NEW PASSWORD</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="admin-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="admin-btn-primary py-4 px-8">
              <Save size={14} />
              <span>{saving ? "SAVING..." : "UPDATE CREDENTIALS"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
