import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { fetchApi } from "@/utils/api";
import { Trash2, Mail, Check, AlertCircle, Clock } from "lucide-react";
import "./Admin.css";

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/contact");
      if (res.data) {
        setMessages(res.data);
      }
    } catch (e) {
      setToast({ type: "error", message: "Failed to load Contact messages." });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const res = await fetchApi(`/contact/${id}/read`, { method: "PATCH" });
      setMessages(prev => prev.map(m => m._id === id ? res.data : m));
    } catch (e) {
      setToast({ type: "error", message: "Failed to update read status." });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await fetchApi(`/contact/${id}`, { method: "DELETE" });
      setMessages(prev => prev.filter(m => m._id !== id));
      setToast({ type: "success", message: "Message deleted successfully!" });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to delete message." });
    }
  };

  return (
    <AdminLayout title="INBOUND MESSAGES QUEUE">
      {toast && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-zinc-500 uppercase tracking-widest text-xs animate-pulse">
            Loading Inbound Messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 bg-[#121212] border border-white/10 rounded-2xl text-center text-zinc-500 uppercase tracking-widest text-xs">
            No contact messages received yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-6 rounded-2xl border transition-all ${!msg.isRead ? "bg-[#161616] border-white/20 shadow-lg" : "bg-[#101010] border-white/5 opacity-80"}`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-white uppercase text-sm">
                    {msg.name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-xs text-zinc-400 hover:text-white underline">
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>

                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkRead(msg._id)}
                      className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-colors"
                    >
                      MARK READ
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-xs md:text-sm text-zinc-300 leading-relaxed tracking-wide">
                "{msg.message}"
              </p>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
