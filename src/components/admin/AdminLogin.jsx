import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi, setAuthToken } from "@/utils/api";
import { Lock, User, AlertCircle } from "lucide-react";
import "./Admin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });

      const token = data.token || data.accessToken;
      if (token) {
        setAuthToken(token);
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4 select-none">
      <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 block mb-2 uppercase">
            AUTHENTICATION
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white">PORTFOLIO CMS</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="admin-label flex items-center gap-2">
              <User size={12} />
              <span>USERNAME</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-input"
              placeholder="admin"
            />
          </div>

          <div className="space-y-2">
            <label className="admin-label flex items-center gap-2">
              <Lock size={12} />
              <span>PASSWORD</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn-primary w-full py-4 text-xs font-bold tracking-[0.2em]"
          >
            {loading ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
          </button>
        </form>
      </div>
    </div>
  );
}
