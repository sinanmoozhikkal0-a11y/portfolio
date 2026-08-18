import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Sparkles, 
  User, 
  Code, 
  FolderKanban, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  ExternalLink,
  Menu,
  X
} from "lucide-react";
import { getAuthToken, setAuthToken, fetchApi } from "@/utils/api";
import "./Admin.css";

export default function AdminLayout({ children, title, headerAction }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
    } catch (e) {}
    setAuthToken("");
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Hero Section", icon: Sparkles, path: "/admin/hero" },
    { label: "About Profile", icon: User, path: "/admin/about" },
    { label: "Skills Grid", icon: Code, path: "/admin/skills" },
    { label: "Projects CMS", icon: FolderKanban, path: "/admin/projects" },
    { label: "Footer & Socials", icon: ExternalLink, path: "/admin/footer" },
    { label: "Media Library", icon: ImageIcon, path: "/admin/media" },
    { label: "Messages", icon: MessageSquare, path: "/admin/messages" },
    { label: "Settings", icon: SettingsIcon, path: "/admin/settings" }
  ];

  return (
    <div className="admin-root">
      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="flex items-center gap-2">
            <span className="admin-brand">PORTFOLIO</span>
            <span className="admin-brand-tag">CMS</span>
          </div>
          <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <span>LIVE WEBSITE</span>
            <ExternalLink size={12} />
          </a>
          <button
            onClick={handleLogout}
            className="p-2 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-zinc-400" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="admin-page-title">{title || "CMS DASHBOARD"}</h1>
          </div>

          <div className="flex items-center gap-4">
            {headerAction}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">ONLINE</span>
            </div>
          </div>
        </header>

        <main className="admin-content-body">
          {children}
        </main>
      </div>
    </div>
  );
}
