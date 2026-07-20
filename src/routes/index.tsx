import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Phone,
  X,
  Plus,
  Lock,
  Mail,
  Sparkles,
  Code2,
  Trophy,
  Award,
  Gift,
  Zap,
  CheckCircle2,
  Star,
  Layers,
  Bot,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import { CountdownTimer } from "@/components/hackspirit/CountdownTimer";
import { PasswordModal } from "@/components/hackspirit/PasswordModal";
import { TiltWrapper } from "@/components/hackspirit/TiltWrapper";
import { useMouseParallax } from "@/components/hackspirit/useMouseParallax";
import { useApp } from "@/lib/AppContext";
import { COUNTDOWN_TARGET } from "@/lib/hackspirit-utils";
import {
  uploadToBucket,
  fetchSettings,
  saveProblemStatement,
  saveGalleryUrls,
  toggleLiveRegistration,
} from "@/lib/hackspirit-cloud";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const CONTACTS = [
  {
    name: "N. Upali",
    role: "Chair, IEEE Student Branch",
    phone: "6305349156",
    email: "upalinijamaala@gmail.com",
  },
  {
    name: "K Guravaiah",
    role: "Vice Chair, IEEE Student Branch",
    phone: "9491501919",
    email: "kattaguravaiah00@gmail.com",
  },
  {
    name: "Kanumuru Rithika",
    role: "Secretary, IEEE Student Branch",
    phone: "7708731095",
    email: "rithikareddyk2005@gmail.com",
  },
];

function PrizePoolHighlightCard() {
  const [isHovered, setIsHovered] = useState(false);

  const prizes = [
    {
      place: "1st Place",
      amount: "₹5,000",
      label: "5K Cash Prize",
      perk: "Winner Trophy & IEEE Winner Certificates",
      badge: "🥇 Winner",
      color: "border-amber-400/50 bg-amber-500/10 text-amber-300",
      glow: "shadow-[0_0_25px_rgba(245,158,11,0.35)]",
    },
    {
      place: "2nd Place",
      amount: "₹3,000",
      label: "3K Cash Prize",
      perk: "Runner-up Trophy & IEEE Certificates",
      badge: "🥈 Runner-up",
      color: "border-slate-300/50 bg-slate-400/10 text-slate-200",
      glow: "shadow-[0_0_25px_rgba(203,213,225,0.25)]",
    },
    {
      place: "3rd Place",
      amount: "₹2,000",
      label: "2K Cash Prize",
      perk: "Excellence Trophy & IEEE Certificates",
      badge: "🥉 3rd Place",
      color: "border-amber-600/50 bg-amber-700/10 text-amber-200",
      glow: "shadow-[0_0_25px_rgba(217,119,6,0.25)]",
    },
    {
      place: "Best Performer",
      amount: "Voucher",
      label: "Microsoft Voucher",
      perk: "Official Microsoft Certification Voucher & Award",
      badge: "🎓 Microsoft Voucher",
      color: "border-cyan-400/50 bg-cyan-500/10 text-cyan-300",
      glow: "shadow-[0_0_25px_rgba(6,182,212,0.35)]",
    },
  ];

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered((prev) => !prev)}
      className="sm:col-span-2 md:col-span-3 cursor-pointer"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <TiltWrapper
        className={`glass p-6 sm:p-8 rounded-2xl border-2 transition-all duration-500 relative overflow-hidden ${
          isHovered
            ? "border-amber-400/80 shadow-[0_0_45px_rgba(245,158,11,0.4)] bg-gradient-to-br from-amber-500/15 via-surface/95 to-violet-950/40"
            : "border-amber-500/40 hover:border-amber-400/70 shadow-[0_0_25px_rgba(245,158,11,0.2)]"
        }`}
        maxTilt={5}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              🎁
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-2xl sm:text-3xl text-white font-bold">
                  ₹10K Prize Pool & Certifications
                </h3>
                <span className="animate-pulse px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40 uppercase">
                  Hover to Expand
                </span>
              </div>
              <p className="text-muted text-xs sm:text-sm mt-1">
                {isHovered
                  ? "Official Prize & Award Distribution Breakdown:"
                  : "Move cursor over this card to view 1st (5K), 2nd (3K), 3rd (2K) cash awards & Microsoft Certification Voucher!"}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg border transition-all duration-300 self-start sm:self-center ${
              isHovered
                ? "bg-amber-400 text-black font-bold border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                : "text-amber-300 bg-amber-500/10 border-amber-500/30 animate-pulse"
            }`}
          >
            <Sparkles size={14} />
            <span>{isHovered ? "Prize Details Active" : "Hover for Prize Breakdown"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {prizes.map((p, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: isHovered ? 1.03 : 1,
                y: isHovered ? -3 : 0,
              }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${p.color} ${
                isHovered ? p.glow : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black/50 border border-white/10">
                  {p.badge}
                </span>
                <span className="text-xl">{p.icon}</span>
              </div>
              <div className="font-display font-black text-2xl text-white tracking-wide">
                {p.amount}
              </div>
              <div className="text-xs font-bold text-amber-300 mt-0.5">{p.label}</div>
              <p className="text-[11px] text-muted mt-2 leading-tight border-t border-white/10 pt-2">
                {p.perk}
              </p>
            </motion.div>
          ))}
        </div>
      </TiltWrapper>
    </motion.div>
  );
}

const TRACKS_DATA = [
  {
    id: "aiml",
    icon: "🤖",
    title: "AI / Machine Learning Track",
    tagline: "Intelligent Systems, Generative AI & Autonomous Agents",
    summary:
      "Architect intelligent systems using machine learning models, computer vision pipelines, natural language processing, and autonomous AI agents to solve complex real-world challenges.",
    technologies: [
      {
        name: "Python",
        role: "Core AI Language",
        desc: "Dataset preprocessing, ML algorithms, scientific computing & model deployment pipelines.",
      },
      {
        name: "TensorFlow & PyTorch",
        role: "Deep Learning Frameworks",
        desc: "Neural network architectures, image recognition models & predictive analytics.",
      },
      {
        name: "LLMs & GenAI",
        role: "Foundation Models",
        desc: "Integrating GPT, Claude, Gemini & Llama for intelligent search, coding assistants & AI agents.",
      },
      {
        name: "OpenCV",
        role: "Computer Vision",
        desc: "Real-time video processing, facial detection, spatial computing & object tracking.",
      },
    ],
    ideas: [
      "AI Medical Diagnostic & X-Ray Assistant",
      "Automated Code Security & Vulnerability Auditor",
      "Real-time Sign Language Video Translator",
      "Smart Agriculture Crop Health Detector",
    ],
    accentColor: "border-cyan/70 shadow-[0_0_35px_rgba(6,182,212,0.3)]",
    badgeBg: "bg-cyan/20 text-cyan border-cyan/40",
  },
  {
    id: "fullstack",
    icon: "🌐",
    title: "Full Stack Web & Mobile Track",
    tagline: "End-to-End Responsive Apps, Scalable APIs & Cloud Data",
    summary:
      "Engineer end-to-end web and mobile applications with intuitive user interfaces, high-performance backend microservices, and secure real-time databases.",
    technologies: [
      {
        name: "React & Next.js",
        role: "Modern Frontend",
        desc: "Component-driven UI, server-side rendering, dynamic animations & lightning-fast UX.",
      },
      {
        name: "Node.js & Express",
        role: "Backend Runtime",
        desc: "Asynchronous microservices, RESTful APIs, WebSocket servers & secure routing.",
      },
      {
        name: "Databases (Supabase / Postgres / Mongo)",
        role: "Data Layer",
        desc: "Relational & NoSQL cloud databases with real-time subscriptions & row-level security.",
      },
      {
        name: "APIs & Webhooks",
        role: "Cloud Integration",
        desc: "Connecting client applications, cloud microservices & third-party SaaS APIs.",
      },
    ],
    ideas: [
      "Decentralized Campus Event & Hackathon Portal",
      "Real-Time Emergency Dispatcher App",
      "Collaborative Code Workspace with Video Call",
      "Smart Personal Finance & Expense Analytics App",
    ],
    accentColor: "border-violet/70 shadow-[0_0_35px_rgba(124,58,237,0.3)]",
    badgeBg: "bg-violet/20 text-violet border-violet/40",
  },
];

function TrackCardItem({ track }: { track: (typeof TRACKS_DATA)[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTech, setActiveTech] = useState<string | null>(null);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveTech(null);
      }}
      className="h-full"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      <TiltWrapper
        className={`glass p-6 sm:p-8 rounded-2xl border-2 transition-all duration-500 h-full flex flex-col justify-between relative overflow-hidden ${
          isHovered
            ? track.accentColor + " bg-gradient-to-br from-surface/95 via-surface/90 to-violet-950/40"
            : "border-white/10 hover:border-cyan/40"
        }`}
        maxTilt={5}
      >
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl sm:text-5xl p-3 rounded-2xl bg-surface/80 border border-white/10 shadow-inner shrink-0">
                {track.icon}
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {track.title}
                </h3>
                <span className="text-xs text-cyan font-medium tracking-wide">
                  {track.tagline}
                </span>
              </div>
            </div>
            <span
              className={`text-[11px] px-2.5 py-1 rounded-full border ${track.badgeBg} font-mono shrink-0 hidden sm:inline-block`}
            >
              Interactive Track
            </span>
          </div>

          <p className="text-muted text-sm leading-relaxed mb-6">
            {track.summary}
          </p>

          <div className="mb-6">
            <div className="text-xs font-semibold text-white/90 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Code2 size={14} className="text-cyan" />
              <span>Technology Stack Specs</span>
              <span className="text-[10px] text-muted font-normal">(Hover/Tap tech for info)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {track.technologies.map((tech) => {
                const isSelected = activeTech === tech.name;
                return (
                  <button
                    key={tech.name}
                    onMouseEnter={() => setActiveTech(tech.name)}
                    onClick={() => setActiveTech(activeTech === tech.name ? null : tech.name)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 font-medium flex items-center gap-1.5 ${
                      isSelected || (isHovered && !activeTech)
                        ? "bg-cyan/20 text-cyan border-cyan/50 shadow-[0_0_12px_rgba(6,182,212,0.3)] scale-105"
                        : "bg-surface/60 text-muted border-white/10 hover:border-cyan/40 hover:text-white"
                    }`}
                  >
                    <span>{tech.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 my-4">
            <AnimatePresence mode="wait">
              {activeTech ? (
                <motion.div
                  key={activeTech}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-4 rounded-xl bg-cyan/10 border border-cyan/40 text-xs text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                >
                  {(() => {
                    const tech = track.technologies.find((t) => t.name === activeTech);
                    if (!tech) return null;
                    return (
                      <div>
                        <div className="font-bold text-cyan flex items-center justify-between text-sm mb-1">
                          <span>{tech.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan/20 border border-cyan/30 text-cyan-300">
                            {tech.role}
                          </span>
                        </div>
                        <p className="text-muted text-xs leading-relaxed">{tech.desc}</p>
                      </div>
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  {track.technologies.map((tech) => (
                    <div
                      key={tech.name}
                      onMouseEnter={() => setActiveTech(tech.name)}
                      className="p-3 rounded-xl bg-surface/50 border border-white/5 hover:border-cyan/40 transition-all text-xs cursor-pointer group"
                    >
                      <div className="font-bold text-white group-hover:text-cyan transition-colors flex items-center justify-between">
                        <span>{tech.name}</span>
                        <Zap size={12} className="text-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-[11px] text-muted truncate mt-0.5">{tech.role}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              <span>Project Ideas You Can Build</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {track.ideas.map((idea, idx) => (
                <div
                  key={idx}
                  className="text-xs p-2.5 rounded-xl bg-violet-950/25 border border-violet-500/20 text-muted flex items-start gap-2 hover:border-violet-400/50 hover:text-white transition-all"
                >
                  <CheckCircle2 size={14} className="text-cyan shrink-0 mt-0.5" />
                  <span className="leading-snug">{idea}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TiltWrapper>
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { setAdminAuth } = useApp();

  useEffect(() => {
    document.title = "HACKSPIRIT 2K26 — IEEE Student Branch Hackathon";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Register for HACKSPIRIT 2K26 — a 6-hour college hackathon by IEEE Student Branch, NBKRIST. Open to all tech branches."
      );
    }
  }, []);
  const parallax = useMouseParallax(12); // degrees of drift for hero depth layers
  const [contactOpen, setContactOpen] = useState(false);
  const [hostPwOpen, setHostPwOpen] = useState(false);
  const [hostActionsOpen, setHostActionsOpen] = useState(false);
  const [adminPwOpen, setAdminPwOpen] = useState(false);
  const [galleryPwOpen, setGalleryPwOpen] = useState(false);
  const [expired, setExpired] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [adminSession, setAdminSession] = useState(false);
  const [galleryImgs, setGalleryImgs] = useState<(string | null)[]>([null, null, null]);
  const [uploading, setUploading] = useState(false);
  const [regOpen, setRegOpen] = useState(true);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const galleryRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    setAdminSession(sessionStorage.getItem("hackspirit_admin_session") === "true");
    fetchSettings()
      .then((s) => {
        setPdfUrl(s.problem_statement_url);
        setGalleryImgs([
          s.gallery_urls[0] ?? null,
          s.gallery_urls[1] ?? null,
          s.gallery_urls[2] ?? null,
        ]);
        setRegOpen(s.registration_open);
      })
      .catch((e) => console.warn("settings load failed", e));
  }, []);

  const onPdfFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) return toast.error("Max 20MB");
    setUploading(true);
    const t = toast.loading("Uploading problem statement…");
    try {
      const url = await uploadToBucket(
        f,
        `problem-statement/HACKSPIRIT_Problem_Statements_${Date.now()}.pdf`,
      );
      await saveProblemStatement(url);
      setPdfUrl(url);
      toast.dismiss(t);
      toast.success("Problem statement published! ✓");
    } catch (error: unknown) {
      toast.dismiss(t);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
    setUploading(false);
    e.target.value = "";
  };

  const viewPdf = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const onGalleryFile = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    const t = toast.loading("Uploading…");
    try {
      const url = await uploadToBucket(
        f,
        `gallery/img_${idx}_${Date.now()}.${f.name.split(".").pop() || "jpg"}`,
      );
      const next = [...galleryImgs];
      next[idx] = url;
      setGalleryImgs(next);
      await saveGalleryUrls(next);
      toast.dismiss(t);
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.dismiss(t);
      console.error("Gallery upload error:", error);
      const errMsg = error?.message || (typeof error === "string" ? error : "Upload failed");
      toast.error(errMsg);
    }
    e.target.value = "";
  };

  const scrollToSchedule = () =>
    document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* TOP NAV BAR */}
      <div className="fixed top-0 left-0 right-0 z-30 glass px-4 sm:px-8 py-2 flex items-center justify-between">
        <img
          src="/nbkrist-logo.png"
          alt="NBKR Institute of Science and Technology Logo"
          className="h-10 sm:h-14 w-auto object-contain"
        />
        <div className="glass px-3 py-1.5 flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${regOpen ? "bg-success animate-pulse" : "bg-red-500"}`} />
          <span className="hidden sm:inline">{regOpen ? "LIVE REGISTRATION OPEN" : "REGISTRATION CLOSED"}</span>
          <span className="sm:hidden">{regOpen ? "LIVE" : "CLOSED"}</span>
        </div>
        <img
          src="/college-logo.png"
          alt="IEEE Student Branch NBKRIST Logo"
          className="h-10 sm:h-14 w-auto object-contain"
        />
      </div>

      {/* HERO */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16"
        style={{ perspective: "1200px" }}
      >
        <div
          style={{
            transform: `translate3d(${parallax.x * -1}px, ${parallax.y * -1}px, 0)`,
            transition: "transform 0.25s ease-out",
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted tracking-widest uppercase text-xs sm:text-sm mb-4"
          >
            IEEE Student Branch Event
          </motion.p>
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="font-display font-black gradient-text leading-none w-full max-w-full break-words"
            style={{
              fontSize: "clamp(40px, 11vw, 144px)",
              transform: `translate3d(${parallax.x * -1.8}px, ${parallax.y * -1.8}px, 0)`,
              transition: "transform 0.2s ease-out",
              textShadow: `${parallax.x * -0.6}px ${parallax.y * -0.6}px 24px rgba(124,58,237,0.35)`,
            }}
          >
            HACKSPIRIT
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-cyan mt-4 tracking-[0.25em] text-xs sm:text-base"
          >
            CODE. CREATE. ELEVATE.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted max-w-2xl mx-auto mt-6 text-sm sm:text-base"
          >
            A 6-hour sprint where bold ideas become working prototypes. Build something brilliant
            with your team, get expert feedback, and walk away with ₹10K prize money & certificates.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-3 justify-center mt-8"
          >
            {regOpen ? (
              <button className="btn-primary" onClick={() => navigate("/register")}>
                Start Registration
              </button>
            ) : (
              <button
                className="btn-primary opacity-60 cursor-not-allowed animate-pulse"
                onClick={() => toast.error("Registration is currently closed by the organizers.")}
              >
                Registration Closed
              </button>
            )}
            <button className="btn-outline" onClick={scrollToSchedule}>
              View Schedule
            </button>
          </motion.div>
          <button className="btn-outline mt-4" onClick={() => setContactOpen((o) => !o)}>
            {contactOpen ? "Hide Contact" : "Contact Us"}
          </button>
        </div>

        {contactOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden w-full max-w-3xl mx-auto mt-6"
          >
            <div className="glass p-4 sm:p-6 relative">
              <button
                onClick={() => setContactOpen(false)}
                className="absolute top-3 right-3 text-muted hover:text-white"
              >
                <X size={18} />
              </button>
              <h3 className="font-display text-xl mb-4">📞 Contact Us</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {CONTACTS.map((c, i) => (
                  <div key={i} className="glass p-3 sm:p-4 flex items-start gap-3 text-left">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-surface flex items-center justify-center text-muted">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold truncate">{c.name}</div>
                      <div className="text-cyan text-xs">{c.role}</div>
                      {c.phone && (
                        <a
                          href={`tel:${c.phone}`}
                          className="text-amber text-sm flex items-center gap-1 mt-1"
                        >
                          <Phone size={12} />
                          {c.phone}
                        </a>
                      )}
                      {c.email && (
                        <a
                          href={`mailto:${c.email}`}
                          className="text-muted text-xs flex items-center gap-1 mt-0.5 break-all"
                        >
                          <Mail size={12} />
                          {c.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.h2 {...fadeUp} className="font-display text-3xl sm:text-4xl text-center">
          <span className="gradient-text">Event Highlights</span>
        </motion.h2>
        <p className="text-center text-muted text-xs sm:text-sm mt-2 max-w-xl mx-auto">
          Explore what makes HACKSPIRIT 2K26 extraordinary. Move cursor over the Prize Pool card below for full award distribution!
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {[
            {
              icon: "⏱",
              title: "6-Hour Sprint",
              desc: "Intense, focused build time with active mentor check-ins",
            },
            {
              icon: "🎓",
              title: "Open to All Tech Branches",
              desc: "CSE, IT, ECE, AI&DS and all engineering streams",
            },
            {
              icon: "🏆",
              title: "Expert Evaluations",
              desc: "Industry experts & senior faculty judge every project",
            },
          ].map((h, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: "0 0 32px rgba(124,58,237,0.4)" }}
            >
              <TiltWrapper className="glass p-6 rounded-2xl h-full flex flex-col justify-between border border-white/10 hover:border-violet/40 transition-colors">
                <div>
                  <div className="text-4xl mb-3">{h.icon}</div>
                  <h3 className="font-display text-xl mb-1.5 text-white">{h.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{h.desc}</p>
                </div>
              </TiltWrapper>
            </motion.div>
          ))}

          {/* Special Interactive Highlighted Prize Pool Card */}
          <PrizePoolHighlightCard />
        </div>
      </section>

      {/* TRACKS */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.h2
          {...fadeUp}
          className="font-display text-3xl sm:text-4xl text-center gradient-text"
        >
          What Can You Build?
        </motion.h2>
        <p className="text-center text-muted text-xs sm:text-sm mt-2 max-w-2xl mx-auto">
          Unleash your innovation across specialized tracks. Move your cursor over any track card or technology tag to inspect framework details and real-world project ideas.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {TRACKS_DATA.map((track) => (
            <TrackCardItem key={track.id} track={track} />
          ))}
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" className="py-20 px-4 max-w-4xl mx-auto">
        <motion.h2
          {...fadeUp}
          className="font-display text-3xl sm:text-4xl text-center gradient-text mb-12"
        >
          Event Schedule
        </motion.h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet to-cyan md:-translate-x-1/2" />
          {[
            {
              time: "09:00 AM",
              title: "Registration & Check-in",
              desc: "Team verification and kit distribution",
            },
            { time: "09:30 AM", title: "Problem Reveal", desc: "Tracks and statements unlocked" },
            { time: "09:45 AM", title: "Hack Starts", desc: "Build, code, iterate" },
            { time: "01:00 PM", title: "Games Start", desc: "Fun activities and refuel" },
            { time: "02:30 PM", title: "Submissions Close", desc: "Final code/demo deadline" },
            { time: "03:30 PM", title: "Judging & Prizes", desc: "Expert panel evaluations and awards" },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative mb-8 md:w-1/2 pl-12 md:pl-0 ${i % 2 === 0 ? "md:pr-12 md:text-right md:mr-auto" : "md:pl-12 md:ml-auto"}`}
            >
              <div
                className="absolute left-2 md:left-auto top-2 w-4 h-4 rounded-full bg-violet border-2 border-cyan glow"
                style={i % 2 === 0 ? { right: "-8px" } : { left: "-8px" }}
              />
              <div className="glass p-4 inline-block max-w-full">
                <span className="inline-block bg-amber/20 text-amber font-display text-sm px-3 py-1 rounded-full mb-2">
                  {item.time}
                </span>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-muted text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROBLEM STATEMENTS */}
      <section className="py-20 px-4 max-w-4xl mx-auto relative">
        <motion.h2
          {...fadeUp}
          className="font-display text-3xl sm:text-4xl text-center gradient-text mb-8"
        >
          Problem Statements
        </motion.h2>
        <div className="text-center">
          <CountdownTimer target={COUNTDOWN_TARGET} onExpire={setExpired} />
          <div className="mt-8">
            {expired ? (
              pdfUrl ? (
                <button className="btn-primary" onClick={viewPdf}>
                  📄 View Problem Statement
                </button>
              ) : (
                <p className="text-muted">
                  Problem statements will be uploaded by the host shortly…
                </p>
              )
            ) : (
              <div>
                <p className="text-muted flex items-center justify-center gap-2">
                  <Lock size={16} /> Locked — unlocks July 23, 2026 at 9:30 AM IST
                </p>
                {pdfUrl && adminSession && (
                  <p className="text-xs text-success mt-2">
                    ✓ PDF already uploaded — will appear when timer ends
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setHostPwOpen(true)}
          className="absolute bottom-2 right-2 text-xs text-muted/50 hover:text-muted"
        >
          🔐 Host
        </button>
        <input
          ref={pdfInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={onPdfFile}
          disabled={uploading}
        />
      </section>

      {/* GALLERY */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.h2
          {...fadeUp}
          className="font-display text-3xl sm:text-4xl text-center gradient-text mb-10"
        >
          Gallery
        </motion.h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Past Hackathon", "Team Spirit", "Winners"].map((title, i) => (
            <TiltWrapper
              key={i}
              className="glass aspect-video relative overflow-hidden rounded-xl"
              maxTilt={6}
              scale={1.03}
            >
              {galleryImgs[i] ? (
                <img src={galleryImgs[i]!} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet to-cyan">
                  <div className="text-5xl mb-2">📸</div>
                  <div className="font-display">{title}</div>
                </div>
              )}
              {adminSession && (
                <>
                  <button
                    onClick={() => galleryRefs[i].current?.click()}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-violet flex items-center justify-center text-white hover:scale-110 transition"
                  >
                    <Plus size={16} />
                  </button>
                  <input
                    ref={galleryRefs[i]}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onGalleryFile(i, e)}
                  />
                </>
              )}
            </TiltWrapper>
          ))}
        </div>
        {!adminSession && (
          <div className="text-center mt-6">
            <button
              onClick={() => setGalleryPwOpen(true)}
              className="text-xs text-muted/40 hover:text-muted"
            >
              Manage Gallery
            </button>
          </div>
        )}
      </section>

      <footer className="py-10 px-4 text-center text-muted text-sm border-t border-violet/20 mt-10">
        <p>© 2026 HACKSPIRIT. Organized by IEEE Student Branch Volunteers.</p>
        <button
          onClick={() => setAdminPwOpen(true)}
          className="text-xs text-muted/30 hover:text-muted/70 mt-2"
        >
          Admin Panel
        </button>
      </footer>

      <PasswordModal
        open={hostPwOpen}
        onClose={() => setHostPwOpen(false)}
        title="Host Password"
        onSuccess={async () => {
          setHostPwOpen(false);
          if (pdfUrl) {
            setHostActionsOpen(true);
          } else {
            pdfInputRef.current?.click();
          }
        }}
      />

      <AnimatePresence>
        {hostActionsOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass p-6 w-full max-w-sm relative text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setHostActionsOpen(false)}
                className="absolute top-3 right-3 text-muted hover:text-white"
              >
                <X size={20} />
              </button>
              <h3 className="font-display text-xl mb-4 gradient-text">Manage Problem Statement</h3>
              <p className="text-muted text-sm mb-6">
                Choose an action for the currently published PDF statement.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setHostActionsOpen(false);
                    pdfInputRef.current?.click();
                  }}
                  className="btn-primary w-full"
                >
                  📤 Upload / Replace PDF
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete the current problem statement?")) {
                      const t = toast.loading("Deleting problem statement...");
                      try {
                        await saveProblemStatement(null);
                        setPdfUrl(null);
                        toast.dismiss(t);
                        toast.success("Problem statement deleted successfully! ✓");
                        setHostActionsOpen(false);
                      } catch (err: any) {
                        toast.dismiss(t);
                        toast.error(err?.message || "Failed to delete");
                      }
                    }
                  }}
                  className="btn-outline border-red-500 hover:bg-red-500/20 text-red-400 w-full"
                >
                  🗑️ Delete PDF Statement
                </button>
                <button
                  onClick={() => setHostActionsOpen(false)}
                  className="btn-outline w-full mt-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <PasswordModal
        open={adminPwOpen}
        onClose={() => setAdminPwOpen(false)}
        title="Admin Login"
        onSuccess={() => {
          sessionStorage.setItem("hackspirit_admin_session", "true");
          setAdminAuth(true);
          setAdminPwOpen(false);
          navigate("/admin");
        }}
      />
      <PasswordModal
        open={galleryPwOpen}
        onClose={() => setGalleryPwOpen(false)}
        title="Gallery Admin"
        onSuccess={() => {
          sessionStorage.setItem("hackspirit_admin_session", "true");
          setAdminSession(true);
          setGalleryPwOpen(false);
          toast.success("Gallery edit unlocked");
        }}
      />
    </div>
  );
}