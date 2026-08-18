import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { fetchApi } from "@/utils/api";
import { Plus, Edit2, Trash2, Save, X, Search, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import "./Admin.css";

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    categoryNum: "01",
    categoryTitle: "",
    description: "",
    tags: "",
    iconColor: "#ffffff",
    order: 0,
    isEnabled: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/skills?admin=true");
      if (res.data && res.data.length > 0) {
        const top3Skills = res.data.slice(0, 3).map((s, idx) => ({
          ...s,
          categoryNum: `0${idx + 1}`
        }));
        setSkills(top3Skills);
      }
    } catch (e) {
      setToast({ type: "error", message: "Failed to load skills list." });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData({
      categoryNum: `0${skills.length + 1}`,
      categoryTitle: "",
      description: "",
      tags: "",
      iconColor: "#ffffff",
      order: skills.length + 1,
      isEnabled: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      categoryNum: skill.categoryNum || "01",
      categoryTitle: skill.categoryTitle || skill.name || "",
      description: skill.description || "",
      tags: Array.isArray(skill.tags) ? skill.tags.join(", ") : "",
      iconColor: skill.iconColor || "#ffffff",
      order: skill.order || 0,
      isEnabled: skill.isEnabled !== undefined ? skill.isEnabled : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill category?")) return;

    try {
      await fetchApi(`/skills/${id}`, { method: "DELETE" });
      setSkills(prev => {
        const remaining = prev.filter(s => s._id !== id);
        return remaining.map((s, idx) => ({
          ...s,
          categoryNum: `0${idx + 1}`
        }));
      });
      setToast({ type: "success", message: "Skill deleted successfully!" });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to delete skill." });
    }
  };

  const handleToggleEnable = async (skill) => {
    try {
      const updated = await fetchApi(`/skills/${skill._id}`, {
        method: "PUT",
        body: JSON.stringify({ isEnabled: !skill.isEnabled })
      });
      setSkills(prev => prev.map(s => s._id === skill._id ? (updated.data || { ...s, isEnabled: !s.isEnabled }) : s));
    } catch (e) {
      setToast({ type: "error", message: "Failed to update status." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const endpoint = editingSkill ? `/skills/${editingSkill._id}` : "/skills";
      const method = editingSkill ? "PUT" : "POST";

      const res = await fetchApi(endpoint, {
        method,
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
        })
      });

      if (res.data) {
        setToast({ type: "success", message: `Skill ${editingSkill ? "updated" : "created"} successfully!` });
        setShowModal(false);
        loadSkills();
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save skill category." });
    } finally {
      setSaving(false);
    }
  };

  const filteredSkills = skills.filter(s => 
    s.categoryTitle?.toLowerCase().includes(search.toLowerCase()) ||
    s.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout title="SKILLS CMS MANAGEMENT">
      {toast && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search skills or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9"
          />
        </div>

        <button onClick={handleOpenAdd} className="admin-btn-primary py-3 px-5 text-xs w-full sm:w-auto">
          <Plus size={14} /> ADD SKILL CATEGORY
        </button>
      </div>

      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ORDER</th>
                <th>CATEGORY TITLE</th>
                <th>TAGS</th>
                <th>STATUS</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-zinc-500 uppercase tracking-widest text-xs">
                    Loading Skills...
                  </td>
                </tr>
              ) : filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-zinc-500 uppercase tracking-widest text-xs">
                    No Skills Found.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill, idx) => (
                  <tr key={skill._id || idx}>
                    <td className="font-bold text-zinc-500">0{idx + 1}</td>
                    <td className="font-bold text-white uppercase">{skill.categoryTitle}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {skill.tags?.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-semibold bg-white/5 border border-white/10 text-zinc-300 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleEnable(skill)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${skill.isEnabled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"}`}
                      >
                        {skill.isEnabled ? <Eye size={10} /> : <EyeOff size={10} />}
                        <span>{skill.isEnabled ? "ACTIVE" : "DISABLED"}</span>
                      </button>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(skill)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(skill._id)} className="p-2 text-zinc-500 hover:text-rose-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                {editingSkill ? "EDIT SKILL CATEGORY" : "ADD NEW SKILL CATEGORY"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="admin-form-group">
                  <label className="admin-label">INDEX NUMBER</label>
                  <input
                    type="text"
                    value={formData.categoryNum}
                    onChange={(e) => setFormData(p => ({ ...p, categoryNum: e.target.value }))}
                    className="admin-input"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">DISPLAY ORDER</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(p => ({ ...p, order: e.target.value }))}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">CATEGORY TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. FRONTEND ARCHITECTURE"
                  value={formData.categoryTitle}
                  onChange={(e) => setFormData(p => ({ ...p, categoryTitle: e.target.value }))}
                  className="admin-input"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">CATEGORY DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="admin-textarea"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">TECHNOLOGY TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="REACT, NEXT.JS, TAILWIND, TYPESCRIPT"
                  value={formData.tags}
                  onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))}
                  className="admin-input"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="admin-btn-secondary">
                  CANCEL
                </button>
                <button type="submit" disabled={saving} className="admin-btn-primary">
                  <Save size={14} />
                  <span>{saving ? "SAVING..." : "SAVE SKILL"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
