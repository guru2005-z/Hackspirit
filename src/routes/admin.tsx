import { useNavigate, Link } from "react-router-dom";
import { useEffect, useMemo, useState, Fragment } from "react";
import { ArrowLeft, Download, Trash2, ChevronDown, ChevronUp, X, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useApp } from "@/lib/AppContext";
import { exportRegistrationsCSV } from "@/lib/hackspirit-utils";
import type { Registration } from "@/lib/AppContext";
import {
  fetchAllRegistrations,
  toggleRegistrationStatus,
  deleteAllRegistrations,
} from "@/lib/hackspirit-cloud";
import { GitHubExport } from "@/components/hackspirit/GitHubExport";
import { TiltWrapper } from "@/components/hackspirit/TiltWrapper";

const PAGE_SIZE = 10;

export default function AdminPage() {
  const navigate = useNavigate();
  const { adminAuth, setAdminAuth } = useApp();

  useEffect(() => {
    document.title = "Admin — HACKSPIRIT 2K26";
  }, []);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [confirmDel, setConfirmDel] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [githubOpen, setGithubOpen] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      setRegs(await fetchAllRegistrations());
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Load failed");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!adminAuth && sessionStorage.getItem("hackspirit_admin_session") !== "true") {
      navigate("/");
      return;
    }
    reload();
  }, [adminAuth, navigate]);

  const stats = useMemo(() => {
    const allMembers = regs.flatMap((r) => r.members.slice(0, r.teamSize));
    return {
      teams: regs.length,
      revenue: regs.reduce((s, r) => s + r.totalFee, 0),
      ieee: allMembers.filter((m) => m.isIEEE).length,
      nonIeee: allMembers.filter((m) => !m.isIEEE).length,
    };
  }, [regs]);

  const toggleStatus = async (id: string) => {
    const reg = regs.find((r) => r.id === id);
    if (!reg) return;
    const next = reg.status === "pending" ? "verified" : "pending";
    setRegs(regs.map((r) => (r.id === id ? { ...r, status: next } : r)));
    try {
      await toggleRegistrationStatus(id, next);
      toast.success("Status updated");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Update failed");
      reload();
    }
  };

  const clearAll = async () => {
    if (confirmText !== "DELETE") return toast.error("Type DELETE to confirm");
    try {
      await deleteAllRegistrations();
      setRegs([]);
      setConfirmDel(false);
      setConfirmText("");
      toast.success("All registrations cleared");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("hackspirit_admin_session");
    setAdminAuth(false);
    navigate("/");
  };

  const pageRegs = regs.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(regs.length / PAGE_SIZE));

  return (
    <div className="min-h-screen px-4 py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <h1 className="font-display text-xl sm:text-3xl gradient-text">🔐 HACKSPIRIT Admin</h1>
        <div className="flex gap-2 flex-wrap">
          <button onClick={reload} className="btn-outline !py-2">
            <RefreshCw size={14} />
            Refresh
          </button>
          <Link to="/" className="btn-outline !py-2">
            <ArrowLeft size={14} />
            Home
          </Link>
          <button onClick={logout} className="btn-outline !py-2 !text-red-400 !border-red-400">
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Teams", value: stats.teams, color: "text-violet" },
          {
            label: "Total Revenue",
            value: `₹${stats.revenue.toLocaleString()}`,
            color: "text-amber",
          },
          { label: "IEEE Members", value: stats.ieee, color: "text-cyan" },
          { label: "Non-IEEE", value: stats.nonIeee, color: "text-muted" },
        ].map((s) => (
          <TiltWrapper key={s.label} className="glass p-4 rounded-xl" maxTilt={6}>
            <div className="text-xs text-muted">{s.label}</div>
            <div className={`font-display text-2xl ${s.color}`}>{s.value}</div>
          </TiltWrapper>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => exportRegistrationsCSV(regs)} className="btn-primary !py-2">
          <Download size={14} />
          Download CSV
        </button>
        <button onClick={() => setGithubOpen(true)} className="btn-outline !py-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5.1 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
          </svg>
          Export to GitHub
        </button>
        <button
          onClick={() => setConfirmDel(true)}
          className="btn-outline !py-2 !border-red-500 !text-red-400"
        >
          <Trash2 size={14} />
          Clear All Data
        </button>
      </div>

      {loading ? (
        <div className="glass p-10 text-center text-muted">Loading registrations from cloud…</div>
      ) : regs.length === 0 ? (
        <div className="glass p-10 text-center text-muted">No registrations yet.</div>
      ) : (
        <div className="glass overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-violet/20">
              <tr className="text-left">
                {[
                  "#",
                  "Team",
                  "Size",
                  "Fee",
                  "Leader",
                  "Email",
                  "Phone",
                  "Status",
                  "Registered",
                  "",
                ].map((h) => (
                  <th key={h} className="p-3 font-display text-xs uppercase text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRegs.map((r, i) => {
                const leader = r.members[0];
                const open = expanded === r.id;
                return (
                  <Fragment key={r.id}>
                    <tr className={i % 2 === 0 ? "" : "bg-surface/50"}>
                      <td className="p-3">{page * PAGE_SIZE + i + 1}</td>
                      <td className="p-3 font-bold">{r.teamName}</td>
                      <td className="p-3">{r.teamSize}</td>
                      <td className="p-3 text-amber">₹{r.totalFee}</td>
                      <td className="p-3">{leader.name}</td>
                      <td className="p-3 text-xs">{leader.email}</td>
                      <td className="p-3 text-xs">{leader.phone}</td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleStatus(r.id)}
                          className={`text-xs px-2 py-1 rounded-full ${r.status === "verified" ? "bg-success/20 text-success" : "bg-amber/20 text-amber"}`}
                        >
                          {r.status}
                        </button>
                      </td>
                      <td className="p-3 text-xs text-muted">
                        {new Date(r.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <button onClick={() => setExpanded(open ? null : r.id)}>
                          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                    </tr>
                    {open && (
                      <tr className="bg-space">
                        <td colSpan={10} className="p-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead className="text-muted">
                                  <tr>
                                    {[
                                      "#",
                                      "Name",
                                      "Roll",
                                      "Email",
                                      "Phone",
                                      "Branch",
                                      "Sec",
                                      "IEEE",
                                      "IEEE ID",
                                    ].map((h) => (
                                      <th key={h} className="p-1 text-left">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {r.members.slice(0, r.teamSize).map((m, mi) => (
                                    <tr key={mi} className="border-t border-violet/10">
                                      <td className="p-1">{mi + 1}</td>
                                      <td className="p-1">{m.name}</td>
                                      <td className="p-1">{m.roll}</td>
                                      <td className="p-1">{m.email}</td>
                                      <td className="p-1">{m.phone}</td>
                                      <td className="p-1">{m.branch}</td>
                                      <td className="p-1">{m.section}</td>
                                      <td className="p-1">{m.isIEEE ? "Yes" : "No"}</td>
                                      <td className="p-1">{m.ieeeId || "—"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div>
                              <div className="text-xs text-muted mb-1">Payment Screenshot</div>
                              {r.paymentScreenshotBase64 ? (
                                <img
                                  src={r.paymentScreenshotBase64}
                                  alt="receipt"
                                  className="max-h-40 rounded cursor-pointer hover:scale-105 transition"
                                  onClick={() => setPreviewImg(r.paymentScreenshotBase64)}
                                />
                              ) : (
                                <p className="text-xs text-muted">None</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-3 text-sm">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="btn-outline !py-1 !px-3 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-muted">
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="btn-outline !py-1 !px-3 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {confirmDel && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass p-6 max-w-sm w-full">
            <h3 className="font-display text-xl mb-2 text-red-400">⚠️ Clear All Data</h3>
            <p className="text-sm text-muted mb-3">
              Type <span className="text-red-400 font-bold">DELETE</span> to confirm.
            </p>
            <input
              className="input-field"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setConfirmDel(false);
                  setConfirmText("");
                }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button onClick={clearAll} className="btn-primary flex-1 !bg-red-500">
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}
        >
          <button className="absolute top-4 right-4 text-white">
            <X size={24} />
          </button>
          <img src={previewImg} alt="preview" className="max-h-[90vh] max-w-full rounded" />
        </div>
      )}

      <GitHubExport open={githubOpen} onClose={() => setGithubOpen(false)} />
    </div>
  );
}