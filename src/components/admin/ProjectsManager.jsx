import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import ImageUploader from "@/components/ImageUploader";
import { fetchApi } from "@/utils/api";
import { Plus, Edit2, Trash2, Save, X, Search, Check, AlertCircle, Upload, Link as LinkIcon, Star } from "lucide-react";
import "./Admin.css";

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    num: "01",
    title: "",
    description: "",
    fullDescription: "",
    role: "",
    category: "UI/UX & Web Development",
    stack: "",
    features: "",
    challenges: "",
    solutions: "",
    duration: "3 Months",
    outcome: "",
    status: "Completed",
    demo: "",
    github: "",
    figma: "",
    caseStudyLink: "",
    order: 0,
    isFeatured: true,
    imageUrl: "",
    bannerUrl: "",
    mockupUrls: ""
  });

  const [thumbMode, setThumbMode] = useState("url");
  const [bannerMode, setBannerMode] = useState("url");
  const [fileThumb, setFileThumb] = useState(null);
  const [fileBanner, setFileBanner] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/projects?admin=true");
      if (res.data) {
        setProjects(res.data);
      }
    } catch (e) {
      setToast({ type: "error", message: "Failed to load projects list." });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      num: `0${projects.length + 1}`,
      title: "",
      description: "",
      fullDescription: "",
      role: "Lead UI/UX Designer & Dev",
      category: "UI/UX & Web Development",
      stack: "REACT, TAILWIND, FRAMER MOTION",
      features: "",
      challenges: "",
      solutions: "",
      duration: "3 Months",
      outcome: "+45% engagement",
      status: "Completed",
      demo: "https://demo.example.com",
      github: "https://github.com",
      figma: "",
      caseStudyLink: "",
      order: projects.length + 1,
      isFeatured: true,
      imageUrl: "",
      bannerUrl: "",
      mockupUrls: ""
    });
    setFileThumb(null);
    setFileBanner(null);
    setShowModal(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingProject(proj);
    setFormData({
      num: proj.num || "01",
      title: proj.title || "",
      description: proj.description || "",
      fullDescription: proj.fullDescription || "",
      role: proj.role || "",
      category: proj.category || "",
      stack: Array.isArray(proj.stack) ? proj.stack.join(", ") : "",
      features: Array.isArray(proj.features) ? proj.features.join(", ") : "",
      challenges: proj.challenges || "",
      solutions: proj.solutions || "",
      duration: proj.duration || "",
      outcome: proj.outcome || "",
      status: proj.status || "Completed",
      demo: proj.demo || "",
      github: proj.github || "",
      figma: proj.figma || "",
      caseStudyLink: proj.caseStudyLink || "",
      order: proj.order || 0,
      isFeatured: proj.isFeatured !== undefined ? proj.isFeatured : true,
      imageUrl: proj.image || "",
      bannerUrl: proj.banner || "",
      mockupUrls: Array.isArray(proj.mockups) ? proj.mockups.join(", ") : ""
    });
    setFileThumb(null);
    setFileBanner(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await fetchApi(`/projects/${id}`, { method: "DELETE" });
      setProjects(prev => prev.filter(p => p._id !== id));
      setToast({ type: "success", message: "Project deleted successfully!" });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to delete project." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const endpoint = editingProject ? `/projects/${editingProject._id}` : "/projects";
      const method = editingProject ? "PUT" : "POST";

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (thumbMode === "upload" && fileThumb) {
        data.append("image", fileThumb);
      }
      if (bannerMode === "upload" && fileBanner) {
        data.append("banner", fileBanner);
      }

      const res = await fetchApi(endpoint, {
        method,
        body: data
      });

      if (res.data) {
        setToast({ type: "success", message: `Project ${editingProject ? "updated" : "created"} successfully!` });
        setShowModal(false);
        loadProjects();
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save project." });
    } finally {
      setSaving(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="PROJECTS CMS MANAGEMENT">
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
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9"
          />
        </div>

        <button onClick={handleOpenAdd} className="admin-btn-primary py-3 px-5 text-xs w-full sm:w-auto">
          <Plus size={14} /> CREATE NEW PROJECT
        </button>
      </div>

      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>PREVIEW</th>
                <th>PROJECT TITLE</th>
                <th>ROLE & STACK</th>
                <th>STATUS</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-zinc-500 uppercase tracking-widest text-xs">
                    Loading Case Studies...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-zinc-500 uppercase tracking-widest text-xs">
                    No Projects Found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => (
                  <tr key={proj._id}>
                    <td>
                      <img src={proj.image} alt={proj.title} className="w-14 h-10 object-cover rounded border border-white/10" />
                    </td>
                    <td>
                      <div className="font-bold text-white uppercase flex items-center gap-1.5">
                        <span>{proj.title}</span>
                        {proj.isFeatured && <Star size={12} className="text-amber-400 fill-amber-400" />}
                      </div>
                      <span className="text-xs text-zinc-500 block truncate max-w-xs">{proj.description}</span>
                    </td>
                    <td>
                      <span className="text-xs text-zinc-300 block font-semibold">{proj.role}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.stack?.map((s, idx) => (
                          <span key={idx} className="text-[9px] font-bold bg-white/5 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {proj.status || "Completed"}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(proj)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(proj._id)} className="p-2 text-zinc-500 hover:text-rose-400 transition-colors">
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

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                {editingProject ? "EDIT CASE STUDY" : "CREATE NEW CASE STUDY"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="admin-form-group">
                  <label className="admin-label">PROJECT TITLE</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className="admin-input" required />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">INDEX NUMBER</label>
                  <input type="text" value={formData.num} onChange={(e) => setFormData(p => ({ ...p, num: e.target.value }))} className="admin-input" required />
                </div>

                <div className="admin-form-group md:col-span-2">
                  <label className="admin-label">SHORT DESCRIPTION</label>
                  <textarea rows={2} value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} className="admin-textarea" required />
                </div>

                <div className="admin-form-group md:col-span-2">
                  <label className="admin-label">FULL CASE STUDY DESCRIPTION</label>
                  <textarea rows={4} value={formData.fullDescription} onChange={(e) => setFormData(p => ({ ...p, fullDescription: e.target.value }))} className="admin-textarea" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">ROLE</label>
                  <input type="text" value={formData.role} onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))} className="admin-input" required />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">TIMELINE DURATION</label>
                  <input type="text" value={formData.duration} onChange={(e) => setFormData(p => ({ ...p, duration: e.target.value }))} className="admin-input" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">OUTCOME METRIC</label>
                  <input type="text" value={formData.outcome} onChange={(e) => setFormData(p => ({ ...p, outcome: e.target.value }))} className="admin-input" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">TECH STACK (COMMA SEPARATED)</label>
                  <input type="text" value={formData.stack} onChange={(e) => setFormData(p => ({ ...p, stack: e.target.value }))} className="admin-input" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">LIVE DEMO LINK</label>
                  <input type="text" value={formData.demo} onChange={(e) => setFormData(p => ({ ...p, demo: e.target.value }))} className="admin-input" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">GITHUB LINK</label>
                  <input type="text" value={formData.github} onChange={(e) => setFormData(p => ({ ...p, github: e.target.value }))} className="admin-input" />
                </div>
              </div>

              {/* Dual Mode Thumbnail Selector */}
              <div className="p-4 bg-[#090909] border border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="admin-label">PROJECT THUMBNAIL IMAGE</span>
                  <div className="input-mode-tabs">
                    <button type="button" className={`input-mode-tab ${thumbMode === "upload" ? "active" : ""}`} onClick={() => setThumbMode("upload")}>
                      <Upload size={10} className="inline mr-1" /> UPLOAD TO CLOUDINARY
                    </button>
                    <button type="button" className={`input-mode-tab ${thumbMode === "url" ? "active" : ""}`} onClick={() => setThumbMode("url")}>
                      <LinkIcon size={10} className="inline mr-1" /> PASTE URL
                    </button>
                  </div>
                </div>

                {thumbMode === "upload" ? (
                  <ImageUploader
                    label=""
                    initialUrl={formData.imageUrl}
                    onUploadSuccess={(url) => {
                      setFormData(p => ({ ...p, imageUrl: url }));
                    }}
                  />
                ) : (
                  <input type="text" value={formData.imageUrl} onChange={(e) => setFormData(p => ({ ...p, imageUrl: e.target.value }))} className="admin-input" placeholder="https://res.cloudinary.com/..." />
                )}

                {formData.imageUrl && thumbMode === "url" && (
                  <div className="preview-box mt-3">
                    <img src={formData.imageUrl} alt="Thumbnail Preview" className="preview-img max-h-40 rounded-lg object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="admin-btn-secondary">
                  CANCEL
                </button>
                <button type="submit" disabled={saving} className="admin-btn-primary">
                  <Save size={14} />
                  <span>{saving ? "SAVING..." : "SAVE PROJECT"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
