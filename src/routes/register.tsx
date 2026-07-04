import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useApp, emptyMember, type Member } from "@/lib/AppContext";
import { calculateFee, getFeeBreakdown } from "@/lib/hackspirit-utils";
import { teamNameExists } from "@/lib/hackspirit-cloud";
import { TiltWrapper } from "@/components/hackspirit/TiltWrapper";

const BRANCHES = [
  "CSE",
  "AI & DS",
  "AI/ML",
  "DS",
  "IT",
  "ECE",
  "EEE",
  "Civil",
  "Mechanical",
  "Other Technical Branch"
];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { formData, setFormData, setCalculatedFee } = useApp();
  const [errorField, setErrorField] = useState<string>("");

  useEffect(() => {
    document.title = "Register — HACKSPIRIT 2K26";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Register your team for HACKSPIRIT 2K26. ₹100/IEEE member, ₹150/non-IEEE.");
    }
  }, []);

  const total = useMemo(() => calculateFee(formData.members, formData.teamSize), [formData]);
  const breakdown = useMemo(() => getFeeBreakdown(formData.members, formData.teamSize), [formData]);

  const updateMember = (idx: number, patch: Partial<Member>) => {
    const next = [...formData.members];
    next[idx] = { ...next[idx], ...patch };
    setFormData({ ...formData, members: next });
  };

  const FIELD_LABELS: Record<string, string> = {
    name: "Full Name",
    roll: "Roll Number",
    email: "Email",
    phone: "Phone (10 digits)",
    branch: "Branch",
    section: "Section",
    ieeeId: "IEEE Member ID",
  };

  const validate = (): { key: string; msg: string } | null => {
    if (!formData.teamName.trim()) return { key: "teamName", msg: "Please enter a Team Name" };
    for (let i = 0; i < formData.teamSize; i++) {
      const m = formData.members[i];
      if (!m.name.trim())
        return { key: `m${i}.name`, msg: `Member ${i + 1}: Full Name is required` };
      if (!m.roll.trim())
        return { key: `m${i}.roll`, msg: `Member ${i + 1}: Roll Number is required` };
      if (!m.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email))
        return { key: `m${i}.email`, msg: `Member ${i + 1}: Enter a valid email` };
      if (!/^\d{10}$/.test(m.phone))
        return { key: `m${i}.phone`, msg: `Member ${i + 1}: Phone must be exactly 10 digits` };
      if (!m.branch) return { key: `m${i}.branch`, msg: `Member ${i + 1}: Select a Branch` };
      if (!m.section) return { key: `m${i}.section`, msg: `Member ${i + 1}: Select a Section` };
      if (m.isIEEE && !m.ieeeId.trim())
        return { key: `m${i}.ieeeId`, msg: `Member ${i + 1}: IEEE Member ID required` };
    }
    return null;
  };

  const proceed = async () => {
    const err = validate();
    if (err) {
      setErrorField(err.key);
      toast.error(err.msg, { duration: 4000 });
      setTimeout(() => setErrorField(""), 800);
      return;
    }
    try {
      if (await teamNameExists(formData.teamName)) {
        toast(`Note: a team named "${formData.teamName}" already registered. Continuing anyway.`, {
          duration: 3500,
        });
      }
    } catch {
      /* non-blocking */
    }
    setCalculatedFee(total);
    toast.success("Proceeding to payment…");
    navigate("/payment");
  };

  const fieldErr = (k: string) => errorField === k;

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-muted hover:text-white mb-6">
        <ArrowLeft size={16} />
        Back
      </Link>

      <h1 className="font-display text-3xl sm:text-5xl gradient-text">HACKSPIRIT 2K26</h1>
      <p className="text-cyan font-display tracking-widest text-sm mt-1">REGISTER YOUR TEAM</p>

      {/* Fee panel */}
      <div className="glass p-5 mt-6 sticky top-4 z-20">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs">
              IEEE: ₹100/member
            </span>
            <span className="px-3 py-1 rounded-full bg-amber/20 text-amber text-xs">
              Non-IEEE: ₹150/member
            </span>
          </div>
          <div className="font-display text-3xl sm:text-4xl text-amber">Total: ₹{total}</div>
        </div>
        {breakdown.length > 0 && (
          <ul className="text-xs text-muted mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {breakdown.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Team name */}
      <div className="mt-6">
        <label className="text-sm text-muted">Team Name *</label>
        <motion.input
          animate={fieldErr("teamName") ? { x: [0, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="input-field mt-1"
          style={fieldErr("teamName") ? { borderColor: "#f87171" } : {}}
          value={formData.teamName}
          onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
          placeholder="The Code Sprinters"
        />
      </div>

      {/* Team size */}
      <div className="mt-6">
        <label className="text-sm text-muted">Team Size *</label>
        <div className="flex gap-3 mt-2 flex-wrap">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setFormData({ ...formData, teamSize: n })}
              className={`px-6 py-3 rounded-xl border-2 transition ${formData.teamSize === n ? "border-violet bg-violet/20 glow" : "border-violet/30 hover:border-violet"}`}
            >
              <div className="font-display text-2xl">{n}</div>
              <div className="text-xs text-muted">Members</div>
            </button>
          ))}
        </div>
      </div>

      {/* Members */}
      <div className="mt-8 space-y-6">
        {Array.from({ length: formData.teamSize }).map((_, i) => {
          const m = formData.members[i] || emptyMember();

          // Calculate filled fields progress for dynamic border glow
          const filledFields = [
            m.name.trim() !== "",
            m.roll.trim() !== "",
            m.email.trim() !== "",
            m.phone.trim() !== "",
            m.branch !== "",
            m.section !== "",
            ...(m.isIEEE ? [m.ieeeId.trim() !== ""] : [])
          ];
          const filledCount = filledFields.filter(Boolean).length;
          const totalFields = m.isIEEE ? 7 : 6;
          const progress = filledCount / totalFields;

          return (
            <TiltWrapper
              key={i}
              className="glass p-5 rounded-xl transition-all duration-350"
              style={{
                borderColor: progress > 0 ? `rgba(0, 240, 255, ${0.15 + progress * 0.85})` : undefined,
                boxShadow: progress > 0 ? `0 0 ${progress * 24}px rgba(0, 240, 255, ${progress * 0.45})` : undefined
              }}
              maxTilt={4}
              glare={false}
              scale={1.005}
            >
              <h3 className="font-display text-xl mb-4 text-cyan">
                Member {i + 1}{" "}
                {i === 0 && <span className="text-xs text-amber">(Team Leader)</span>}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {(
                  [
                    ["name", "Full Name", "text"],
                    ["roll", "Roll Number", "text"],
                    ["email", i === 0 ? "Team Leader Email" : "Email", "email"],
                    ["phone", "Phone (10 digits)", "tel"],
                  ] as const
                ).map(([key, label, type]) => (
                  <div key={key}>
                    <label className="text-xs text-muted">{label} *</label>
                    <motion.input
                      type={type}
                      animate={fieldErr(`m${i}.${key}`) ? { x: [0, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className="input-field mt-1"
                      style={fieldErr(`m${i}.${key}`) ? { borderColor: "#f87171" } : {}}
                      value={m[key]}
                      onChange={(e) =>
                        updateMember(i, { [key]: e.target.value } as Partial<typeof m>)
                      }
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-muted">Branch *</label>
                  <select
                    className="input-field mt-1"
                    value={m.branch}
                    style={fieldErr(`m${i}.branch`) ? { borderColor: "#f87171" } : {}}
                    onChange={(e) => updateMember(i, { branch: e.target.value })}
                  >
                    <option value="">Select Branch</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted">Section *</label>
                  <select
                    className="input-field mt-1"
                    value={m.section}
                    style={fieldErr(`m${i}.section`) ? { borderColor: "#f87171" } : {}}
                    onChange={(e) => updateMember(i, { section: e.target.value })}
                  >
                    <option value="">Select Section</option>
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted block mb-1">IEEE Member? *</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateMember(i, { isIEEE: true })}
                      className={`px-6 py-2 rounded-full border-2 transition ${m.isIEEE ? "bg-success border-success text-white" : "border-success/40 text-success/70"}`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => updateMember(i, { isIEEE: false, ieeeId: "" })}
                      className={`px-6 py-2 rounded-full border-2 transition ${!m.isIEEE ? "bg-red-500 border-red-500 text-white" : "border-red-500/40 text-red-500/70"}`}
                    >
                      No
                    </button>
                  </div>
                </div>
                {m.isIEEE && (
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted">IEEE Member ID *</label>
                    <motion.input
                      animate={fieldErr(`m${i}.ieeeId`) ? { x: [0, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className="input-field mt-1"
                      style={fieldErr(`m${i}.ieeeId`) ? { borderColor: "#f87171" } : {}}
                      value={m.ieeeId}
                      onChange={(e) => updateMember(i, { ieeeId: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </TiltWrapper>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={proceed} className="btn-primary">
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}